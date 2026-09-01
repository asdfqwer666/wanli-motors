"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { GitCompareArrows, X } from "lucide-react";
import type { BrandId, EnergyId, ModelCategoryId, TruckModel } from "@/types/model";
import ModelCard, { type CoverInfo } from "@/components/models/ModelCard";
import ModelFilters, { type FilterState } from "@/components/models/ModelFilters";

interface ModelsExplorerProps {
  models: TruckModel[];
  covers: Record<string, CoverInfo>;
  initialBrand?: BrandId | "all";
  initialEnergy?: EnergyId | "all";
  initialCategory?: ModelCategoryId | "all";
}

const MAX_COMPARE = 4;

export default function ModelsExplorer({
  models,
  covers,
  initialBrand = "all",
  initialEnergy = "all",
  initialCategory = "all"
}: ModelsExplorerProps) {
  const router = useRouter();
  const [filters, setFilters] = useState<FilterState>({
    brand: initialBrand,
    energy: initialEnergy,
    category: initialCategory
  });
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = useMemo(
    () =>
      models.filter(
        (m) =>
          (filters.brand === "all" || m.brand === filters.brand) &&
          (filters.energy === "all" || m.energy === filters.energy) &&
          (filters.category === "all" || m.category === filters.category)
      ),
    [models, filters]
  );

  const toggle = (slug: string) => {
    setSelected((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, slug];
    });
  };

  const goCompare = () => {
    if (selected.length >= 2) {
      router.push(`/compare?ids=${selected.join(",")}`);
    }
  };

  return (
    <div className="space-y-8">
      <ModelFilters value={filters} onChange={setFilters} />

      <p className="text-sm text-apple-subtext">
        共 <span className="font-medium text-apple-text">{filtered.length}</span> 款车型
        {selected.length > 0 ? ` · 已选 ${selected.length}/${MAX_COMPARE} 款进入对比` : " · 勾选 2-4 款车型可横向对比"}
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-apple-border bg-white/60 py-20 text-center text-apple-subtext">
          没有符合筛选条件的车型，请调整筛选组合
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((model) => (
            <ModelCard
              key={model.slug}
              model={model}
              cover={covers[model.slug] ?? { src: "", alt: model.name, isDemo: true, kind: "placeholder" }}
              selectable
              selected={selected.includes(model.slug)}
              onToggle={toggle}
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {selected.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-x-0 bottom-6 z-40 flex justify-center px-4"
          >
            <div className="flex items-center gap-3 rounded-full border border-white/60 bg-apple-text/95 py-2.5 pl-6 pr-2.5 text-white shadow-appleHover backdrop-blur-xl">
              <GitCompareArrows size={16} />
              <span className="text-sm font-medium">已选 {selected.length} 款车型</span>
              <button
                type="button"
                onClick={goCompare}
                disabled={selected.length < 2}
                className="rounded-full bg-apple-blue px-4 py-1.5 text-sm font-medium transition-colors hover:bg-apple-blueHover disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/70"
              >
                立即对比
              </button>
              <button
                type="button"
                aria-label="清空对比选择"
                onClick={() => setSelected([])}
                className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X size={15} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
