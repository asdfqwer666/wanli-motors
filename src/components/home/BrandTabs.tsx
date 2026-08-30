"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { brandMeta, models } from "@/data/models";
import type { BrandId } from "@/types/model";
import { cn } from "@/lib/utils";

const tabs: BrandId[] = ["auman", "chenglong"];

export default function BrandTabs() {
  const [active, setActive] = useState<BrandId>("auman");
  const meta = brandMeta[active];
  const brandModels = models.filter((m) => m.brand === active);

  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="text-center">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">双品牌展台</h2>
        <p className="mt-3 text-apple-subtext">官方授权 · 原厂渠道 · 覆盖干线物流全场景的运力矩阵</p>
      </div>

      <div className="mt-10 flex justify-center">
        <div className="inline-flex rounded-full border border-apple-border bg-white p-1 shadow-appleCard">
          {tabs.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setActive(id)}
              className={cn(
                "rounded-full px-6 py-2 text-sm font-medium transition-colors",
                active === id ? "bg-apple-text text-white" : "text-apple-subtext hover:text-apple-text"
              )}
            >
              {brandMeta[id].label}
              <span className="ml-1.5 text-xs opacity-60">{id === "auman" ? "AUMAN" : "CHENGLONG"}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-8 rounded-4xl border border-apple-border bg-apple-card p-8 shadow-appleCard md:grid-cols-2 md:p-10">
        <div className="flex flex-col justify-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-apple-subtext">
            {meta.full}
          </span>
          <h3 className="mt-3 text-2xl font-semibold">{meta.label}系列</h3>
          <p className="mt-4 leading-relaxed text-apple-subtext">{meta.intro}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {meta.chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-neutral-200/60 bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600"
              >
                {chip}
              </span>
            ))}
          </div>
          <Link
            href={`/models?brand=${active}`}
            className="mt-8 inline-flex w-fit items-center gap-1.5 rounded-full bg-apple-blue px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-apple-blueHover"
          >
            查看该品牌全部车型
            <ArrowRight size={15} />
          </Link>
        </div>

        <ul className="divide-y divide-apple-border overflow-hidden rounded-3xl border border-apple-border bg-apple-bg/60">
          {brandModels.map((m) => (
            <li key={m.slug}>
              <Link
                href={`/models/${m.slug}`}
                className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-apple-hover"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{m.name}</span>
                  <span className="mt-0.5 block text-xs text-apple-subtext">{m.scenario}</span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block text-sm font-semibold">{m.power.display}</span>
                  <span className="block text-xs text-apple-subtext">
                    {m.drive} · {m.energyShort}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
