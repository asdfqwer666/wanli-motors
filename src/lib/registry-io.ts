import fs from "fs";
import path from "path";
import type { MediaRegistry, ModelMediaData } from "@/types/media";

export const REGISTRY_PATH = path.join(process.cwd(), "data", "media-registry.json");

export const MEDIA_WRITE_ERROR =
  "写入失败：当前运行环境的文件系统为只读（常见于 Vercel 等无服务器平台）。请本地运行或自托管服务器使用后台媒体管理功能。";

export function readRegistry(): MediaRegistry {
  try {
    const raw = fs.readFileSync(REGISTRY_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as MediaRegistry) : {};
  } catch {
    return {};
  }
}

export function writeRegistry(registry: MediaRegistry): void {
  fs.mkdirSync(path.dirname(REGISTRY_PATH), { recursive: true });
  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2), "utf8");
}

export function emptyMediaData(): ModelMediaData {
  return { demoImages: [], actualImages: [] };
}
