import fs from "fs";
import path from "path";
import type { MediaRegistry, ModelImage, ModelMediaData } from "@/types/media";
import { getModelBySlug } from "@/data/models";
import { DEMO_DISCLAIMER_TEXT, GALLERY_STATUS_TEXT } from "@/lib/demo-text";

export { DEMO_DISCLAIMER_TEXT, GALLERY_STATUS_TEXT };

const REGISTRY_PATH = path.join(process.cwd(), "data", "media-registry.json");

export function readMediaRegistry(): MediaRegistry {
  try {
    const raw = fs.readFileSync(REGISTRY_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as MediaRegistry) : {};
  } catch {
    return {};
  }
}

/** 系统内置 Demo 演示图（matchLevel: category，只读，绝不因后台操作被修改） */
function builtinDemoImages(slug: string): ModelImage[] {
  const model = getModelBySlug(slug);
  return [
    {
      id: `demo-${slug}-cover`,
      src: `/images/demo/models/${slug}/cover.svg`,
      alt: `${model?.name ?? "车型"} 选型演示图`,
      kind: "demo",
      matchLevel: "category",
      isCover: true,
      sortOrder: 0,
      sourceId: "builtin:generate-placeholders"
    }
  ];
}

/** Actual（门店实拍）> Demo（内置演示图）> Placeholder 的媒体分层读取 */
export function getMediaFor(slug: string): ModelMediaData {
  const registry = readMediaRegistry();
  return {
    demoImages: builtinDemoImages(slug),
    actualImages: registry[slug]?.actualImages ?? []
  };
}

export function resolveCoverImage(
  media: ModelMediaData,
  slug: string
): { image: ModelImage; isDemo: boolean } {
  const actualCover = media.actualImages?.find((img) => img.isCover);
  if (actualCover) return { image: actualCover, isDemo: false };

  if (media.actualImages && media.actualImages.length > 0) {
    return { image: media.actualImages[0], isDemo: false };
  }

  const demoCover = media.demoImages?.find((img) => img.isCover);
  if (demoCover) return { image: demoCover, isDemo: true };

  if (media.demoImages && media.demoImages.length > 0) {
    return { image: media.demoImages[0], isDemo: true };
  }

  return {
    image: {
      id: `placeholder-${slug}`,
      src: `/images/demo/models/${slug}/cover.svg`,
      alt: "车型图像录入中",
      kind: "placeholder",
      matchLevel: "placeholder",
      isCover: true,
      sortOrder: 0
    },
    isDemo: true
  };
}

export function resolveGalleryImages(
  media: ModelMediaData,
  slug: string
): { images: ModelImage[]; isDemo: boolean } {
  if (media.actualImages && media.actualImages.length > 0) {
    return { images: media.actualImages, isDemo: false };
  }
  if (media.demoImages && media.demoImages.length > 0) {
    return { images: media.demoImages, isDemo: true };
  }
  return {
    images: [resolveCoverImage(media, slug).image],
    isDemo: true
  };
}

export function resolveCoverForSlug(slug: string): { image: ModelImage; isDemo: boolean } {
  return resolveCoverImage(getMediaFor(slug), slug);
}
