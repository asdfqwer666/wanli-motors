import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse, type NextRequest } from "next/server";
import { getModelBySlug } from "@/data/models";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { usesBlobStorage } from "@/lib/registry-io";

export const runtime = "nodejs";

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ALLOWED_CONTENT_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const slug = params.slug;
  if (!usesBlobStorage()) return NextResponse.json({ error: "当前环境未启用 Blob 存储。" }, { status: 400 });
  if (!SLUG_RE.test(slug) || !getModelBySlug(slug)) return NextResponse.json({ error: "车型不存在。" }, { status: 404 });

  try {
    const body = (await req.json()) as HandleUploadBody;
    if (body.type === "blob.generate-client-token" && !verifySessionToken(req.cookies.get(ADMIN_COOKIE_NAME)?.value)) {
      return NextResponse.json({ error: "未登录或会话已过期，请重新登录。" }, { status: 401 });
    }
    const result = await handleUpload({
      request: req,
      body,
      onBeforeGenerateToken: async (pathname) => {
        const validPath = pathname.startsWith(`incoming/models/${slug}/`)
          && /^incoming\/models\/[a-z0-9-]+\/[a-f0-9-]+\.(jpe?g|png|webp|avif)$/i.test(pathname);
        if (!validPath) throw new Error("上传路径不合法。");
        return {
          allowedContentTypes: ALLOWED_CONTENT_TYPES,
          maximumSizeInBytes: MAX_FILE_BYTES,
          addRandomSuffix: false,
          allowOverwrite: false,
          tokenPayload: JSON.stringify({ slug })
        };
      }
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("[admin/blob-token]", error);
    return NextResponse.json({ error: "无法签发上传凭证，请检查 Blob 配置。" }, { status: 400 });
  }
}
