import ImageFallback from "@/components/common/ImageFallback";
import { STORE_SCENE_NOTE } from "@/lib/demo-text";

const scenes = [
  { src: "/images/store/storefront.svg", title: "展厅门头形象" },
  { src: "/images/store/parking.svg", title: "标准化大车停放区" },
  { src: "/images/store/lounge.svg", title: "客户洽谈区" },
  { src: "/images/store/delivery.svg", title: "交车服务展区" }
];

export default function StoreGallery() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="text-center">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">门店与真实车场</h2>
        <p className="mt-3 text-apple-subtext">
          颍东核心展厅 · 标准化停放区 · 面对面的选车与交付体验
        </p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {scenes.map((scene) => (
          <figure
            key={scene.src}
            className="overflow-hidden rounded-3xl border border-apple-border bg-apple-card shadow-appleCard transition-shadow hover:shadow-appleHover"
          >
            <div className="aspect-[4/3] bg-gradient-to-b from-[#F5F5F7] to-[#ECECED]">
              <ImageFallback src={scene.src} alt={scene.title} className="h-full w-full object-cover" />
            </div>
            <figcaption className="flex items-center justify-between gap-3 px-5 py-4">
              <span className="text-sm font-medium">{scene.title}</span>
              <span className="text-xs text-apple-subtext">{STORE_SCENE_NOTE}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-apple-subtext">
        以上为门店场景示意图，实拍照片整理完成后将第一时间替换更新。
      </p>
    </section>
  );
}
