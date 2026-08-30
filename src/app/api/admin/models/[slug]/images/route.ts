import crypto from "crypto";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { NextResponse, type NextRequest } from "next/server";
import { getModelBySlug } from "@/data/models";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { MEDIA_WRITE_ERROR, readRegistry, writeRegistry } from "@/lib/registry-io";
import type { ModelImage } from "@/types/media";

export const runtime = "nodejs";

const UPLOADS_ROOT = path.join(process.cwd(), "public", "images", "uploads", "models");
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 单张 ≤ 10MB
const MAX_BATCH = 10; // 单次 ≤ 10 张
const MAX_PIXELS = 50_000_000; // ≤ 50MP，防御解压炸弹
const MAX_WIDTH = 2560;

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const FILENAME_RE = /^[a-z0-9]+-[a-f0-9]{8}\.webp$/;

function isAuthorized(req: NextRequest): boolean {
  return verifySessionToken(req.cookies.get(ADMIN_COOKIE_NAME)?.value);
}

function safeSlug(slug: string): string | null {
  if (!SLUG_RE.test(slug) || !getModelBySlug(slug)) return null;
  return slug;
}

function slugDir(slug: string): string {
  const resolved = path.resolve(UPLOADS_ROOT, slug);
  if (!resolved.startsWith(path.resolve(UPLOADS_ROOT) + path.sep)) {
    throw new Error("路径越界");
  }
  return resolved;
}

/** Magic Number 校验：仅放行 JPEG / PNG / WebP / AVIF，拒绝 SVG、GIF、HTML 及伪装文件 */
function detectImageKind(buf: Buffer): "jpeg" | "png" | "webp" | "avif" | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpeg";
  if (
    buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47 &&
    buf[4] === 0x0d && buf[5] === 0x0a && buf[6] === 0x1a && buf[7] === 0x0a
  ) {
    return "png";
  }
  if (buf.subarray(0, 4).toString("ascii") === "RIFF" && buf.subarray(8, 12).toString("ascii") === "WEBP") {
    return "webp";
  }
  if (buf.subarray(4, 8).toString("ascii") === "ftyp") {
    const brand = buf.subarray(8, 12).toString("ascii");
    if (brand.startsWith("avif") || brand.startsWith("avis")) return "avif";
  }
  return null;
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function serverError(err: unknown) {
  const code = (err as NodeJS.ErrnoException)?.code ?? "";
  console.error("[admin/images]", err);
  if (["EROFS", "EACCES", "EPERM", "ENOENT"].includes(code) || (err as Error)?.message === "路径越界") {
    return jsonError(MEDIA_WRITE_ERROR, 500);
  }
  return jsonError("服务端处理失败，请稍后重试。", 500);
}

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  if (!isAuthorized(req)) return jsonError("未登录或会话已过期，请重新登录。", 401);
  const slug = safeSlug(params.slug);
  if (!slug) return jsonError("车型不存在。", 404);

  try {
    const formData = await req.formData();
    const files = formData.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
    if (files.length === 0) return jsonError("未收到任何文件。", 400);
    if (files.length > MAX_BATCH) return jsonError(`单次最多上传 ${MAX_BATCH} 张图片。`, 400);

    for (const file of files) {
      if (file.size > MAX_FILE_BYTES) {
        return jsonError(`「${file.name}」超过 10MB 单张限制。`, 400);
      }
    }

    // 第一阶段：全部通过校验后再进入处理流水线，避免半成功状态
    const prepared: { name: string; buf: Buffer }[] = [];
    for (const file of files) {
      const buf = Buffer.from(await file.arrayBuffer());
      if (!detectImageKind(buf)) {
        return jsonError(`「${file.name}」不是受支持的图片格式（仅允许 JPEG / PNG / WebP / AVIF）。`, 400);
      }
      const meta = await sharp(buf).metadata();
      const pixels = (meta.width ?? 0) * (meta.height ?? 0);
      if (pixels > MAX_PIXELS) {
        return jsonError(`「${file.name}」像素总量超过 50MP 限制，疑似异常图片。`, 400);
      }
      prepared.push({ name: file.name, buf });
    }

    const registry = readRegistry();
    const entry = registry[slug] ?? { demoImages: [], actualImages: [] };
    const dir = slugDir(slug);
    fs.mkdirSync(dir, { recursive: true });

    const created: ModelImage[] = [];
    for (const { buf } of prepared) {
      // Sharp 流水线：EXIF 方向校正 → 去除隐私元数据（含 GPS）→ 等比限宽 → 高保真 WebP
      const output = await sharp(buf)
        .rotate()
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: 85 })
        .toBuffer();

      const meta = await sharp(output).metadata();
      const id = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
      const filename = `${id}.webp`;
      fs.writeFileSync(path.join(dir, filename), output);

      const model = getModelBySlug(slug);
      created.push({
        id,
        src: `/images/uploads/models/${slug}/${filename}`,
        alt: `${model?.name ?? "车型"} 门店实拍`,
        kind: "actual",
        matchLevel: "exact",
        isCover: entry.actualImages.length === 0 && created.length === 0,
        sortOrder: entry.actualImages.length + created.length,
        width: meta.width,
        height: meta.height,
        createdAt: new Date().toISOString()
      });
    }

    entry.actualImages.push(...created);
    registry[slug] = entry;
    writeRegistry(registry);

    return NextResponse.json({ ok: true, images: created });
  } catch (err) {
    return serverError(err);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { slug: string } }) {
  if (!isAuthorized(req)) return jsonError("未登录或会话已过期，请重新登录。", 401);
  const slug = safeSlug(params.slug);
  if (!slug) return jsonError("车型不存在。", 404);

  try {
    const body = await req.json();
    const registry = readRegistry();
    const entry = registry[slug];
    if (!entry || entry.actualImages.length === 0) {
      return jsonError("当前车型暂无实拍图可操作。", 400);
    }

    if (Array.isArray(body.order)) {
      const ids: string[] = body.order;
      const known = new Set(entry.actualImages.map((i) => i.id));
      if (ids.length !== entry.actualImages.length || !ids.every((id) => known.has(id))) {
        return jsonError("排序数据不合法。", 400);
      }
      entry.actualImages = ids
        .map((id) => entry.actualImages.find((i) => i.id === id)!)
        .map((img, index) => ({ ...img, sortOrder: index }));
    } else if (typeof body.id === "string") {
      const target = entry.actualImages.find((i) => i.id === body.id);
      if (!target) return jsonError("未找到对应图片。", 404);
      if (typeof body.alt === "string" && body.alt.trim()) {
        target.alt = body.alt.trim();
      }
      if (body.isCover === true) {
        entry.actualImages = entry.actualImages.map((img) => ({
          ...img,
          isCover: img.id === target.id
        }));
      }
    } else {
      return jsonError("缺少可执行的操作字段。", 400);
    }

    registry[slug] = entry;
    writeRegistry(registry);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return serverError(err);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
  if (!isAuthorized(req)) return jsonError("未登录或会话已过期，请重新登录。", 401);
  const slug = safeSlug(params.slug);
  if (!slug) return jsonError("车型不存在。", 404);

  try {
    const body = await req.json();
    const registry = readRegistry();
    const entry = registry[slug];
    if (!entry) return jsonError("当前车型暂无实拍图可操作。", 400);

    const target = entry.actualImages.find((i) => i.id === body?.id);
    if (!target) return jsonError("未找到对应图片。", 404);

    // 仅允许删除上传隔离目录内的 WebP 文件，严禁触碰 demo 目录
    const filename = path.basename(target.src);
    if (target.kind === "actual" && FILENAME_RE.test(filename)) {
      const filePath = path.resolve(slugDir(slug), filename);
      if (filePath.startsWith(slugDir(slug) + path.sep) && fs.existsSync(filePath)) {
        fs.rmSync(filePath, { force: true });
      }
    }

    entry.actualImages = entry.actualImages.filter((i) => i.id !== target.id);
    if (entry.actualImages.length === 0) {
      delete registry[slug]; // 实拍清空 → 前台自动回退 Demo 并激活免责声明
    } else if (target.isCover) {
      entry.actualImages[0].isCover = true;
    } else {
      registry[slug] = entry;
    }
    writeRegistry(registry);

    return NextResponse.json({ ok: true });
  } catch (err) {
    return serverError(err);
  }
}
