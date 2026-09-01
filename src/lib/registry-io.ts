import fs from "fs";
import path from "path";
import { del, list, put } from "@vercel/blob";
import type { MediaRegistry, ModelImage, ModelMediaData } from "@/types/media";

export const REGISTRY_PATH = path.join(process.cwd(), "data", "media-registry.json");

export const MEDIA_WRITE_ERROR =
  "媒体存储写入失败，请检查 MEDIA_STORAGE_PROVIDER 与 Blob 环境变量配置。";

const BLOB_METADATA_PREFIX = "metadata/models";
const LOCAL_UPLOADS_ROOT = path.join(process.cwd(), "public", "images", "uploads", "models");

export function usesBlobStorage(): boolean {
  return process.env.MEDIA_STORAGE_PROVIDER === "blob";
}

function readLocalRegistry(): MediaRegistry {
  try {
    const raw = fs.readFileSync(REGISTRY_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as MediaRegistry) : {};
  } catch {
    return {};
  }
}

function writeLocalRegistry(registry: MediaRegistry): void {
  fs.mkdirSync(path.dirname(REGISTRY_PATH), { recursive: true });
  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2), "utf8");
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

function metadataPath(slug: string): string {
  return `${BLOB_METADATA_PREFIX}/${slug}.json`;
}

export async function readModelMedia(slug: string): Promise<ModelMediaData> {
  if (!usesBlobStorage()) {
    return normalizeMediaData(readLocalRegistry()[slug]);
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) return emptyMediaData();

  try {
    const result = await list({ prefix: metadataPath(slug), limit: 1 });
    const blob = result.blobs.find((item) => item.pathname === metadataPath(slug));
    if (!blob) return emptyMediaData();
    const response = await fetch(blob.url, { cache: "no-store" });
    if (!response.ok) return emptyMediaData();
    return normalizeMediaData((await response.json()) as Partial<ModelMediaData>);
  } catch (error) {
    console.error(`[media-storage] 无法读取 ${slug} 的 Blob 元数据，已回退演示图。`, error);
    return emptyMediaData();
  }
}

export async function writeModelMedia(slug: string, data: ModelMediaData): Promise<void> {
  const normalized = normalizeMediaData(data);
  if (!usesBlobStorage()) {
    const registry = readLocalRegistry();
    registry[slug] = normalized;
    writeLocalRegistry(registry);
    return;
  }

  await put(metadataPath(slug), JSON.stringify(normalized), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60
  });
}

export async function storeActualImage(slug: string, id: string, data: Buffer): Promise<{ src: string; storageKey: string }> {
  const storageKey = `models/${slug}/${id}.webp`;
  if (usesBlobStorage()) {
    const blob = await put(storageKey, data, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: false,
      contentType: "image/webp",
      cacheControlMaxAge: 60 * 60 * 24 * 365
    });
    return { src: blob.url, storageKey: blob.pathname };
  }

  const base = path.resolve(LOCAL_UPLOADS_ROOT);
  const dir = path.resolve(base, slug);
  if (!dir.startsWith(base + path.sep)) throw new Error("路径越界");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${id}.webp`), data);
  return { src: `/images/uploads/models/${slug}/${id}.webp`, storageKey };
}

export async function deleteActualImage(slug: string, src: string, storageKey?: string): Promise<void> {
  if (usesBlobStorage()) {
    await del(storageKey || src);
    return;
  }

  const base = path.resolve(LOCAL_UPLOADS_ROOT);
  const filename = path.basename(src);
  if (!/^[0-9]+-[a-f0-9]{8}\.webp$/.test(filename)) return;
  const target = path.resolve(base, slug, filename);
  if (target.startsWith(path.resolve(base, slug) + path.sep) && fs.existsSync(target)) {
    fs.rmSync(target, { force: true });
  }
}
