"use client";

import { brandMeta, categoryFilterOptions, energyFilterOptions } from "@/data/models";
import type { BrandId, EnergyId, ModelCategoryId } from "@/types/model";
import { cn } from "@/lib/utils";

export interface FilterState {
  brand: BrandId | "all";
  energy: EnergyId | "all";
  category: ModelCategoryId | "all";
}

interface ModelFiltersProps {
  value: FilterState;
  onChange: (next: FilterState) => void;
}

function Pill({
  active,
  label,
  onClick
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-1.5 text-sm transition-colors",
        active
          ? "border-transparent bg-apple-text font-medium text-white"
          : "border-apple-border bg-white text-apple-subtext hover:border-neutral-300 hover:text-apple-text"
      )}
    >
      {label}
    </button>
  );
}

export default function ModelFilters({ value, onChange }: ModelFiltersProps) {
  const group = "flex flex-wrap items-center gap-2";

  return (
    <div className="space-y-3 rounded-3xl border border-apple-border bg-apple-card/80 p-5 shadow-appleCard backdrop-blur-xl">
      <div className={group}>
        <span className="mr-1 w-12 shrink-0 text-sm font-medium text-apple-subtext">品牌</span>
        <Pill
          active={value.brand === "all"}
          label="全部"
          onClick={() => onChange({ ...value, brand: "all" })}
        />
        {(Object.keys(brandMeta) as BrandId[]).map((id) => (
          <Pill
            key={id}
            active={value.brand === id}
            label={brandMeta[id].label}
            onClick={() => onChange({ ...value, brand: id })}
          />
        ))}
      </div>

      <div className={group}>
        <span className="mr-1 w-12 shrink-0 text-sm font-medium text-apple-subtext">能源</span>
        {energyFilterOptions.map((opt) => (
          <Pill
            key={opt.id}
            active={value.energy === opt.id}
            label={opt.label}
            onClick={() => onChange({ ...value, energy: opt.id })}
          />
        ))}
      </div>

      <div className={group}>
        <span className="mr-1 w-12 shrink-0 text-sm font-medium text-apple-subtext">用途</span>
        {categoryFilterOptions.map((opt) => (
          <Pill
            key={opt.id}
            active={value.category === opt.id}
            label={opt.label}
            onClick={() => onChange({ ...value, category: opt.id })}
          />
        ))}
      </div>
    </div>
  );
}
