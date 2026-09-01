import fs from "fs";
import path from "path";
import type { MediaRegistry, ModelImage, ModelMediaData } from "@/types/media";

export const REGISTRY_PATH = path.join(process.cwd(), "data", "media-registry.json");

function readLocalRegistry(): MediaRegistry {
  try {
    const raw = fs.readFileSync(REGISTRY_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as MediaRegistry) : {};
  } catch {
    return {};
  }
}

export function emptyMediaData(): ModelMediaData {
  return { demoImages: [], referenceImages: [], actualImages: [] };
}

function normalizeMediaData(value: Partial<ModelMediaData> | undefined): ModelMediaData {
  const imageKinds = new Set(["actual", "reference", "demo", "placeholder"]);
  const matchLevels = new Set(["exact", "series", "category", "placeholder"]);
  const validImages = (images: unknown): ModelImage[] => Array.isArray(images)
    ? images.filter((image): image is ModelImage => {
      if (!image || typeof image !== "object") return false;
      const item = image as Partial<ModelImage>;
      return typeof item.id === "string"
        && typeof item.src === "string"
        && typeof item.alt === "string"
        && typeof item.kind === "string"
        && imageKinds.has(item.kind)
        && typeof item.matchLevel === "string"
        && matchLevels.has(item.matchLevel)
        && typeof item.isCover === "boolean"
        && typeof item.sortOrder === "number"
        && Number.isFinite(item.sortOrder);
    })
    : [];
  return {
    demoImages: validImages(value?.demoImages),
    referenceImages: validImages(value?.referenceImages),
    actualImages: validImages(value?.actualImages)
  };
}

/**
 * cloudflare-static 分支：仅读取仓库内 data/media-registry.json（构建期 Node 文件系统）。
 * 不包含 Vercel Blob 与文件写入能力；后台媒体管理由 Vercel 主生产端负责。
 */
export async function readModelMedia(slug: string): Promise<ModelMediaData> {
  return normalizeMediaData(readLocalRegistry()[slug]);
}
