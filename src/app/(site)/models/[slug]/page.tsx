import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Cog, Flame, Fuel, Gauge, Info, Zap } from "lucide-react";
import { getModelBySlug, models } from "@/data/models";
import { getMediaFor, resolveCoverImage, resolveGalleryImages, GALLERY_STATUS_TEXT } from "@/lib/model-media";
import { salesConsultants } from "@/data/sales-consultants";
import CinemaStage from "@/components/models/CinemaStage";
import SpecTable from "@/components/models/SpecTable";
import DecisionCard from "@/components/models/DecisionCard";
import TcoCalculator from "@/components/models/TcoCalculator";
import ImageFallback from "@/components/common/ImageFallback";
import { ConsultantCard } from "@/components/home/SalesTeamSection";

export const dynamic = "force-dynamic";

interface ModelDetailPageProps {
  params: { slug: string };
}

export function generateMetadata({ params }: ModelDetailPageProps): Metadata {
  const model = getModelBySlug(params.slug);
  if (!model) return { title: "车型未找到" };
  return {
    title: model.name,
    description: `${model.name} —— ${model.brandFull}，${model.drive} 驱动，${model.power.display}，核心场景：${model.scenario}。`
  };
}

const energyIcons = { diesel: Fuel, lng: Flame, ev: Zap } as const;

export default function ModelDetailPage({ params }: ModelDetailPageProps) {
  const model = getModelBySlug(params.slug);
  if (!model) notFound();

  const media = getMediaFor(model.slug);
  const cover = resolveCoverImage(media, model.slug);
  const gallery = resolveGalleryImages(media, model.slug);
  const EnergyIcon = energyIcons[model.energy];

  return (
    <div className="mx-auto max-w-6xl px-6 pb-28 pt-32">
      <Link
        href="/models"
        className="inline-flex items-center gap-1 text-sm text-apple-subtext transition-colors hover:text-apple-text"
      >
        <ChevronLeft size={15} />
        返回车型中心
      </Link>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-neutral-200/60 bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
              {model.brandFull}
            </span>
            <span className="rounded-full border border-neutral-200/60 bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
              {model.categoryLabel}
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">{model.name}</h1>
          <p className="mt-2 text-sm text-apple-subtext md:text-base">{model.subtitle}</p>
          <p className="mt-3 text-apple-subtext">核心场景：{model.scenario} · 价格与现车请{model.priceGuide}</p>
        </div>
      </div>

      <div className="mt-10">
        <CinemaStage name={model.name} image={cover.image} isDemo={cover.isDemo} />
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        <div className="rounded-3xl border border-apple-border bg-apple-card p-6 text-center shadow-appleCard">
          <Gauge size={22} className="mx-auto text-apple-blue" strokeWidth={1.8} />
          <p className="mt-3 text-2xl font-semibold tracking-tight">{model.power.display}</p>
          <p className="mt-1 text-xs text-apple-subtext">{model.power.unit === "PS" ? "最大马力" : "最大功率"}</p>
        </div>
        <div className="rounded-3xl border border-apple-border bg-apple-card p-6 text-center shadow-appleCard">
          <Cog size={22} className="mx-auto text-apple-blue" strokeWidth={1.8} />
          <p className="mt-3 text-2xl font-semibold tracking-tight">{model.drive}</p>
          <p className="mt-1 text-xs text-apple-subtext">驱动形式</p>
        </div>
        <div className="rounded-3xl border border-apple-border bg-apple-card p-6 text-center shadow-appleCard">
          <EnergyIcon size={22} className="mx-auto text-apple-blue" strokeWidth={1.8} />
          <p className="mt-3 text-2xl font-semibold tracking-tight">{model.energyShort}</p>
          <p className="mt-1 text-xs text-apple-subtext">{model.energyLabel}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        {model.highlightSpecs.map((spec) => (
          <div
            key={spec.label}
            className="rounded-2xl border border-apple-border bg-apple-bg px-5 py-4 text-center"
          >
            <div className="text-[11px] text-apple-subtext">{spec.label}</div>
            <div className="mt-1 text-sm font-semibold text-apple-text">{spec.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <DecisionCard decision={model.decision} />
      </div>

      <div className="mt-10">
        <TcoCalculator
          energy={model.energy}
          consumption={model.tco.fuelConsumption100km}
          defaultPrice={model.tco.unitPriceEstimate}
        />
      </div>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold tracking-tight">实拍图库与车辆状态</h2>
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
            {gallery.images.map((img) => (
              <figure
                key={img.id}
                className="overflow-hidden rounded-3xl border border-apple-border bg-apple-card shadow-appleCard"
              >
                <div className="aspect-[4/3] bg-gradient-to-b from-[#F5F5F7] to-[#ECECED] p-4">
                  <ImageFallback src={img.src} alt={img.alt} className="h-full w-full object-contain" />
                </div>
                <figcaption className="px-4 py-3 text-xs text-apple-subtext">{img.alt}</figcaption>
              </figure>
            ))}
          </div>
          <aside className="flex flex-col justify-center rounded-3xl border border-apple-border bg-apple-card p-6 shadow-appleCard">
            <h3 className="text-base font-semibold">车辆状态说明</h3>
            <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-apple-subtext">
              <Info size={15} className="mt-0.5 shrink-0 text-apple-blue" />
              {gallery.isDemo
                ? GALLERY_STATUS_TEXT
                : "以下为门店现车实拍档案，车辆外观与配置以门店实际在售车辆及购销合同为准。"}
            </p>
            <p className="mt-4 rounded-2xl bg-apple-bg px-4 py-3 text-xs leading-relaxed text-apple-subtext">
              现车库存与指导售价请咨询门店核实，本站不做任何未经确认的价格与库存承诺。
            </p>
          </aside>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold tracking-tight">完整技术规格</h2>
        <div className="mt-6">
          <SpecTable model={model} />
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold tracking-tight">专属顾问对接</h2>
        <p className="mt-3 text-apple-subtext">任选一位顾问即可直接电话咨询本款车型，支持一键拨号。</p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {salesConsultants.map((consultant) => (
            <ConsultantCard key={consultant.id} consultant={consultant} />
          ))}
        </div>
      </section>
    </div>
  );
}
