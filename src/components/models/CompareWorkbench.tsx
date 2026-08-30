"use client";

import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import type { TruckModel } from "@/types/model";
import { cn } from "@/lib/utils";

interface CompareWorkbenchProps {
  allModels: TruckModel[];
  initialIds: string[];
}

const UNKNOWN = "— 咨询门店";

export default function CompareWorkbench({ allModels, initialIds }: CompareWorkbenchProps) {
  const [ids, setIds] = useState<string[]>(initialIds);
  const selected = allModels.filter((m) => ids.includes(m.slug));

  const toggle = (slug: string) => {
    setIds((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= 4) return prev;
      return [...prev, slug];
    });
  };

  const rows: { label: string; get: (m: TruckModel) => string; unknown?: boolean }[] = [
    { label: "品牌系列", get: (m) => m.brandFull },
    { label: "车型类别", get: (m) => m.categoryLabel },
    { label: "能源类型", get: (m) => m.energyLabel },
    { label: "驱动形式", get: (m) => m.drive },
    { label: "马力 / 功率", get: (m) => m.power.display },
    { label: "推荐运输工况", get: (m) => m.scenario },
    { label: "发动机型号", get: () => UNKNOWN, unknown: true },
    { label: "变速箱档位", get: () => UNKNOWN, unknown: true },
    { label: "后桥速比", get: () => UNKNOWN, unknown: true },
    { label: "整备质量", get: () => UNKNOWN, unknown: true },
    { label: "现车 / 价格", get: () => "门店详询", unknown: true }
  ];

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-base font-semibold">选择要对比的车型（2 - 4 款）</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {allModels.map((m) => {
            const active = ids.includes(m.slug);
            return (
              <button
                key={m.slug}
                type="button"
                onClick={() => toggle(m.slug)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition-colors",
                  active
                    ? "border-apple-blue bg-apple-blue text-white"
                    : "border-apple-border bg-white text-apple-subtext hover:border-neutral-300 hover:text-apple-text"
                )}
              >
                {m.name}
                {active && <X size={13} />}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-apple-subtext">
          已选 {ids.length} 款 · 未确认参数将显示“— 咨询门店”，本页不做任何虚构数值展示。
        </p>
      </section>

      {selected.length < 2 ? (
        <div className="rounded-3xl border border-dashed border-apple-border bg-white/60 py-20 text-center text-apple-subtext">
          请至少选择 2 款车型开始对比
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-apple-border bg-apple-card shadow-appleCard">
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr className="border-b border-apple-border">
                <th className="w-36 px-6 py-4 text-left text-sm font-medium text-apple-subtext">对比项</th>
                {selected.map((m) => (
                  <th key={m.slug} className="px-6 py-4 text-left">
                    <Link href={`/models/${m.slug}`} className="text-sm font-semibold hover:text-apple-blue">
                      {m.name}
                    </Link>
                    <span className="mt-1 block text-xs font-normal text-apple-subtext">
                      {m.brandLabel} · {m.categoryLabel}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-b border-apple-border last:border-b-0">
                  <td className="px-6 py-3.5 text-sm text-apple-subtext">{row.label}</td>
                  {selected.map((m) => (
                    <td
                      key={m.slug}
                      className={cn(
                        "px-6 py-3.5 text-sm",
                        row.unknown ? "text-apple-subtext" : "font-medium"
                      )}
                    >
                      {row.get(m)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
