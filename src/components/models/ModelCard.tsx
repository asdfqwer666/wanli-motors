"use client";

import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";
import type { TruckModel } from "@/types/model";
import { cn } from "@/lib/utils";
import ImageFallback from "@/components/common/ImageFallback";
import DisclaimerBadge from "@/components/common/DisclaimerBadge";

export interface CoverInfo {
  src: string;
  alt: string;
  isDemo: boolean;
}

interface ModelCardProps {
  model: TruckModel;
  cover: CoverInfo;
  selectable?: boolean;
  selected?: boolean;
  onToggle?: (slug: string) => void;
}

export default function ModelCard({ model, cover, selectable = false, selected = false, onToggle }: ModelCardProps) {
  const specChips = [model.power.display, model.drive, model.energyShort];

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-apple-border bg-apple-card shadow-appleCard transition-shadow duration-300 hover:shadow-appleHover">
      <div className="relative aspect-[16/10] bg-gradient-to-b from-[#F5F5F7] to-[#ECECED]">
        {selectable ? (
          <button
            type="button"
            aria-pressed={selected}
            onClick={() => onToggle?.(model.slug)}
            className={cn(
              "absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-sm transition-colors",
              selected
                ? "border-apple-blue bg-apple-blue text-white"
                : "border-neutral-200/70 bg-white/85 text-neutral-600 hover:bg-white"
            )}
          >
            <span
              className={cn(
                "flex h-3.5 w-3.5 items-center justify-center rounded-full border",
                selected ? "border-white bg-white/25" : "border-neutral-400"
              )}
            >
              {selected && <Check size={10} strokeWidth={3} />}
            </span>
            {selected ? "已加入对比" : "加入对比"}
          </button>
        ) : null}

        <Link href={`/models/${model.slug}`} className="block h-full w-full p-5">
          <ImageFallback src={cover.src} alt={cover.alt} className="h-full w-full object-contain" />
        </Link>

        {cover.isDemo ? (
          <div className="absolute inset-x-3 bottom-2.5 flex justify-center">
            <DisclaimerBadge className="max-w-full" />
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-neutral-200/60 bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
            {model.brandLabel}
          </span>
          <span className="rounded-full border border-neutral-200/60 bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
            {model.categoryLabel}
          </span>
        </div>
        <h3 className="mt-3 text-lg font-semibold leading-snug">
          <Link href={`/models/${model.slug}`} className="transition-colors hover:text-apple-blue">
            {model.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-apple-subtext">核心场景：{model.scenario}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {specChips.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-neutral-200/60 bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600"
            >
              {chip}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-5">
          <Link
            href={`/models/${model.slug}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-apple-blue transition-colors hover:text-apple-blueHover"
          >
            查看车型详情
            <ChevronRight size={15} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
