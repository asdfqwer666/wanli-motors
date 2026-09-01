import type { Metadata } from "next";
import { Suspense } from "react";
import { models } from "@/data/models";
import { resolveCoverForSlug } from "@/lib/model-media";
import ModelsExplorer from "@/components/models/ModelsExplorer";

export const metadata: Metadata = {
  title: "车型产品中心",
  description: "欧曼 · 乘龙 12 款主营商用车型，支持品牌、能源类型与用途多维筛选与横向对比。"
};

export default async function ModelsPage() {
  const covers = Object.fromEntries(
    await Promise.all(models.map(async (m) => {
      const { image, isDemo } = await resolveCoverForSlug(m.slug);
      return [m.slug, { src: image.src, alt: image.alt, isDemo, kind: image.kind }];
    }))
  );

  return (
    <div className="mx-auto max-w-6xl px-6 pb-28 pt-32">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">车型产品中心</h1>
        <p className="mt-3 text-apple-subtext">
          覆盖欧曼 / 乘龙两大品牌的 12 款主营车型，支持按品牌、能源类型与用途实时筛选，勾选 2-4 款即可横向对比。
        </p>
      </div>
      <Suspense fallback={null}>
        <ModelsExplorer models={models} covers={covers} />
      </Suspense>
    </div>
  );
}
