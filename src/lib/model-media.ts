import type { ModelImage, ModelMediaData } from "@/types/media";
import { getModelBySlug } from "@/data/models";
import { DEMO_DISCLAIMER_TEXT, GALLERY_STATUS_TEXT } from "@/lib/demo-text";
import { readModelMedia } from "@/lib/registry-io";

export { DEMO_DISCLAIMER_TEXT, GALLERY_STATUS_TEXT };

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
export async function getMediaFor(slug: string): Promise<ModelMediaData> {
  const stored = await readModelMedia(slug);
  return {
    demoImages: builtinDemoImages(slug),
    referenceImages: stored.referenceImages ?? [],
    actualImages: stored.actualImages ?? []
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

  const exactReference = media.referenceImages?.find((img) => img.matchLevel === "exact" && img.isCover)
    ?? media.referenceImages?.find((img) => img.matchLevel === "exact");
  if (exactReference) return { image: exactReference, isDemo: false };

  const seriesReference = media.referenceImages?.find((img) => img.matchLevel === "series" && img.isCover)
    ?? media.referenceImages?.find((img) => img.matchLevel === "series");
  if (seriesReference) return { image: seriesReference, isDemo: false };

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
  const references = (media.referenceImages ?? []).filter((img) => ["exact", "series"].includes(img.matchLevel));
  if (references.length > 0) return { images: references, isDemo: false };
  if (media.demoImages && media.demoImages.length > 0) {
    return { images: media.demoImages, isDemo: true };
  }
  return {
    images: [resolveCoverImage(media, slug).image],
    isDemo: true
  };
}

export async function resolveCoverForSlug(slug: string): Promise<{ image: ModelImage; isDemo: boolean }> {
  return resolveCoverImage(await getMediaFor(slug), slug);
}
