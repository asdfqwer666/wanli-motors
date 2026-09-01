import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { models } from "@/data/models";
import { getMediaFor, resolveCoverImage } from "@/lib/model-media";
import { requireAdmin } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";
import ImageFallback from "@/components/common/ImageFallback";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "车型媒体总览",
  robots: { index: false, follow: false }
};

export const dynamic = "force-dynamic";

export default async function AdminModelsPage() {
  requireAdmin();

  const mediaBySlug = Object.fromEntries(
    await Promise.all(models.map(async (model) => [model.slug, await getMediaFor(model.slug)] as const))
  );

  return (
    <AdminShell
      title="车型媒体状态总览"
      description="12 款车型的媒体来源状态。点击任意车型进入双栏工作台，为门店现车实拍图建立档案。"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {models.map((model) => {
          const media = mediaBySlug[model.slug];
          const cover = resolveCoverImage(media, model.slug);
          const actualCount = media.actualImages.length;
          return (
            <article
              key={model.slug}
              className="flex gap-4 rounded-3xl border border-apple-border bg-apple-card p-4 shadow-appleCard"
            >
              <div className="h-20 w-32 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-b from-[#F5F5F7] to-[#ECECED]">
                <ImageFallback src={cover.image.src} alt={cover.image.alt} className="h-full w-full object-contain" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <h2 className="truncate text-sm font-semibold">{model.name}</h2>
                <p className="mt-0.5 text-xs text-apple-subtext">
                  {model.brandLabel} · {model.categoryLabel}
                </p>
                <span
                  className={cn(
                    "mt-2 w-fit rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                    actualCount > 0
                      ? "bg-emerald-50 text-emerald-700"
                      : "border border-neutral-200/60 bg-neutral-100 text-neutral-600"
                  )}
                >
                  {actualCount > 0 ? `已上线实拍 · ${actualCount} 张` : "当前使用演示图 · category"}
                </span>
                <div className="mt-auto flex gap-3 pt-3 text-xs">
                  <Link
                    href={`/admin/models/${model.slug}/images`}
                    className="inline-flex items-center gap-0.5 font-medium text-apple-blue hover:underline"
                  >
                    管理媒体
                    <ChevronRight size={12} />
                  </Link>
                  <Link
                    href={`/models/${model.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-0.5 text-apple-subtext hover:text-apple-text"
                  >
                    前台查看
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </AdminShell>
  );
}
