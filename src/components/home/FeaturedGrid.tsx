import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { featuredModels } from "@/data/models";
import { resolveCoverForSlug } from "@/lib/model-media";
import ModelCard from "@/components/models/ModelCard";

export default function FeaturedGrid() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">精选主力车型</h2>
          <p className="mt-3 text-apple-subtext">干线牵引 · 智能冷链 · 燃气与纯电新能源的口碑之选</p>
        </div>
        <Link
          href="/models"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-apple-blue transition-colors hover:text-apple-blueHover"
        >
          进入车型中心
          <ArrowRight size={15} />
        </Link>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {featuredModels.map((model) => {
          const { image, isDemo } = resolveCoverForSlug(model.slug);
          return (
            <ModelCard
              key={model.slug}
              model={model}
              cover={{ src: image.src, alt: image.alt, isDemo }}
            />
          );
        })}
      </div>
    </section>
  );
}
