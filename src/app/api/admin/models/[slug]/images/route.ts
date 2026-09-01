import crypto from "crypto";
import { del, head } from "@vercel/blob";
import sharp from "sharp";
import { NextResponse, type NextRequest } from "next/server";
import { getModelBySlug } from "@/data/models";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import {
  MEDIA_WRITE_ERROR,
  deleteActualImage,
  readModelMedia,
  storeActualImage,
  usesBlobStorage,
  writeModelMedia
} from "@/lib/registry-io";
import type { ModelImage } from "@/types/media";

export const runtime = "nodejs";

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_BATCH = 10;
const MAX_PIXELS = 50_000_000;
const MAX_WIDTH = 2560;
const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const ALLOWED_CONTENT_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

function isAuthorized(req: NextRequest): boolean {
  return verifySessionToken(req.cookies.get(ADMIN_COOKIE_NAME)?.value);
}

function safeSlug(slug: string): string | null {
  return SLUG_RE.test(slug) && getModelBySlug(slug) ? slug : null;
}

function detectImageKind(buf: Buffer): "jpeg" | "png" | "webp" | "avif" | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpeg";
  if (
    buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47 &&
    buf[4] === 0x0d && buf[5] === 0x0a && buf[6] === 0x1a && buf[7] === 0x0a
  ) return "png";
  if (buf.subarray(0, 4).toString("ascii") === "RIFF" && buf.subarray(8, 12).toString("ascii") === "WEBP") return "webp";
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
  console.error("[admin/images]", err);
  const message = err instanceof Error ? err.message : "";
  if (/Blob|token|BLOB_READ_WRITE_TOKEN|路径越界|EROFS|EACCES|EPERM/i.test(message)) {
    return jsonError(MEDIA_WRITE_ERROR, 500);
  }
  return jsonError("服务端处理失败，请稍后重试。", 500);
}

async function validateAndTransform(buf: Buffer, label: string): Promise<{ output: Buffer; width?: number; height?: number }> {
  if (buf.byteLength > MAX_FILE_BYTES) throw new Error(`「${label}」超过 10MB 单张限制。`);
  if (!detectImageKind(buf)) throw new Error(`「${label}」不是受支持的图片格式（仅允许 JPEG / PNG / WebP / AVIF）。`);
  const original = await sharp(buf, { limitInputPixels: MAX_PIXELS }).metadata();
  const pixels = (original.width ?? 0) * (original.height ?? 0);
  if (!pixels || pixels > MAX_PIXELS) throw new Error(`「${label}」像素数据异常或超过 50MP 限制。`);

  const output = await sharp(buf, { limitInputPixels: MAX_PIXELS })
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();
  const metadata = await sharp(output).metadata();
  return { output, width: metadata.width, height: metadata.height };
}

async function createActualImage(slug: string, buf: Buffer, isCover: boolean, sortOrder: number, label: string): Promise<ModelImage> {
  const transformed = await validateAndTransform(buf, label);
  const id = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
  const stored = await storeActualImage(slug, id, transformed.output);
  return {
    id,
    src: stored.src,
    storageKey: stored.storageKey,
    alt: `${getModelBySlug(slug)?.name ?? "车型"} 门店实拍`,
    note: "由后台上传的门店自有车辆照片",
    kind: "actual",
    matchLevel: "exact",
    isCover,
    sortOrder,
    width: transformed.width,
    height: transformed.height,
    createdAt: new Date().toISOString()
  };
}

async function bufferFromBlob(slug: string, body: unknown): Promise<{ buffer: Buffer; url: string; pathname: string }> {
  if (!body || typeof body !== "object") throw new Error("Blob 上传信息不完整。");
  const { blobUrl, pathname } = body as { blobUrl?: unknown; pathname?: unknown };
  if (typeof blobUrl !== "string" || typeof pathname !== "string") throw new Error("Blob 上传信息不完整。");
  if (!pathname.startsWith(`incoming/models/${slug}/`)) throw new Error("Blob 路径与车型不匹配。");

  const info = await head(blobUrl);
  if (info.pathname !== pathname || info.size <= 0 || info.size > MAX_FILE_BYTES || !ALLOWED_CONTENT_TYPES.has(info.contentType)) {
    throw new Error("Blob 文件类型、大小或路径校验失败。");
  }
  const response = await fetch(info.url, { cache: "no-store" });
  if (!response.ok) throw new Error("无法读取刚上传的 Blob 文件。");
  return { buffer: Buffer.from(await response.arrayBuffer()), url: info.url, pathname: info.pathname };
}

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  if (!isAuthorized(req)) return jsonError("未登录或会话已过期，请重新登录。", 401);
  const slug = safeSlug(params.slug);
  if (!slug) return jsonError("车型不存在。", 404);

  try {
    const entry = await readModelMedia(slug);
    if (usesBlobStorage()) {
      let temporary: { buffer: Buffer; url: string; pathname: string } | undefined;
      try {
        temporary = await bufferFromBlob(slug, await req.json());
        const image = await createActualImage(slug, temporary.buffer, entry.actualImages.length === 0, entry.actualImages.length, temporary.pathname);
        entry.actualImages.push(image);
        await writeModelMedia(slug, entry);
        return NextResponse.json({ ok: true, images: [image] });
      } finally {
        if (temporary) await del(temporary.url).catch((error) => console.error("[admin/images] 清理临时 Blob 失败", error));
      }
    }

    const formData = await req.formData();
    const files = formData.getAll("files").filter((file): file is File => file instanceof File && file.size > 0);
    if (files.length === 0) return jsonError("未收到任何文件。", 400);
    if (files.length > MAX_BATCH) return jsonError(`单次最多上传 ${MAX_BATCH} 张图片。`, 400);
    if (files.some((file) => file.size > MAX_FILE_BYTES)) return jsonError("存在超过 10MB 单张限制的文件。", 400);

    const buffers = await Promise.all(files.map(async (file) => ({ name: file.name, buffer: Buffer.from(await file.arrayBuffer()) })));
    const created: ModelImage[] = [];
    for (const item of buffers) {
      created.push(await createActualImage(slug, item.buffer, entry.actualImages.length === 0 && created.length === 0, entry.actualImages.length + created.length, item.name));
    }
    entry.actualImages.push(...created);
    await writeModelMedia(slug, entry);
    return NextResponse.json({ ok: true, images: created });
  } catch (err) {
    if (err instanceof Error && /10MB|图片格式|50MP|Blob 上传信息|Blob 路径|Blob 文件类型/.test(err.message)) return jsonError(err.message, 400);
    return serverError(err);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { slug: string } }) {
  if (!isAuthorized(req)) return jsonError("未登录或会话已过期，请重新登录。", 401);
  const slug = safeSlug(params.slug);
  if (!slug) return jsonError("车型不存在。", 404);
  try {
    const body = await req.json();
    const entry = await readModelMedia(slug);
    if (entry.actualImages.length === 0) return jsonError("当前车型暂无实拍图可操作。", 400);
    if (Array.isArray(body.order)) {
      const ids: string[] = body.order;
      const known = new Set(entry.actualImages.map((image) => image.id));
      if (ids.length !== entry.actualImages.length || !ids.every((id) => known.has(id))) return jsonError("排序数据不合法。", 400);
      entry.actualImages = ids.map((id) => entry.actualImages.find((image) => image.id === id)!).map((image, index) => ({ ...image, sortOrder: index }));
    } else if (typeof body.id === "string") {
      const target = entry.actualImages.find((image) => image.id === body.id);
      if (!target) return jsonError("未找到对应图片。", 404);
      if (typeof body.alt === "string" && body.alt.trim()) target.alt = body.alt.trim().slice(0, 160);
      if (typeof body.note === "string") target.note = body.note.trim().slice(0, 300);
      if (body.isCover === true) entry.actualImages = entry.actualImages.map((image) => ({ ...image, isCover: image.id === target.id }));
    } else return jsonError("缺少可执行的操作字段。", 400);
    await writeModelMedia(slug, entry);
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
    const entry = await readModelMedia(slug);
    const target = entry.actualImages.find((image) => image.id === body?.id);
    if (!target) return jsonError("未找到对应图片。", 404);
    if (target.kind !== "actual") return jsonError("只能删除门店实拍图。", 400);
    await deleteActualImage(slug, target.src, target.storageKey);
    entry.actualImages = entry.actualImages.filter((image) => image.id !== target.id);
    if (target.isCover && entry.actualImages[0]) entry.actualImages[0].isCover = true;
    await writeModelMedia(slug, entry);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return serverError(err);
  }
}
