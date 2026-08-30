"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Fuel, Gauge, Info, Zap } from "lucide-react";
import type { EnergyId } from "@/types/model";
import { cn } from "@/lib/utils";

interface TcoCalculatorProps {
  energy: EnergyId;
  consumption: number;
  defaultPrice: number;
}

const energyNames: Record<EnergyId, string> = { diesel: "柴油", lng: "LNG 天然气", ev: "电力" };
const priceUnits: Record<EnergyId, string> = { diesel: "元/升", lng: "元/公斤", ev: "元/度" };
const priceRanges: Record<EnergyId, { min: number; max: number }> = {
  diesel: { min: 6, max: 9 },
  lng: { min: 3.5, max: 6.5 },
  ev: { min: 0.5, max: 1.2 }
};
const DIESEL_BASE_CONSUMPTION = 32;

function annualCost(mileageWanKm: number, consumption: number, price: number) {
  return (mileageWanKm * 10000 * consumption * price) / 100;
}

function wan(value: number) {
  return (value / 10000).toFixed(1);
}

export default function TcoCalculator({ energy, consumption, defaultPrice }: TcoCalculatorProps) {
  const [mileage, setMileage] = useState(15); // 万公里/年
  const [price, setPrice] = useState(defaultPrice);
  const [dieselPrice, setDieselPrice] = useState(7.5);

  const myCost = annualCost(mileage, consumption, price);
  const isAltEnergy = energy !== "diesel";
  const baselineCost = annualCost(mileage, DIESEL_BASE_CONSUMPTION, dieselPrice);
  const maxCost = Math.max(myCost, isAltEnergy ? baselineCost : 0);
  const saving = isAltEnergy ? baselineCost - myCost : 0;
  const threeYearSaving = saving * 3;

  const priceCfg = priceRanges[energy];

  const sliderLabel = "text-xs font-medium text-apple-subtext";
  const sliderValue = "text-xs font-semibold tabular-nums text-apple-text";

  return (
    <section id="tco" className="overflow-hidden rounded-4xl border border-apple-border bg-apple-card shadow-appleCard">
      <div className="border-b border-apple-border px-6 py-4 md:px-8">
        <h2 className="flex items-center gap-2 text-base font-semibold md:text-lg">
          <Gauge size={17} className="text-apple-blue" />
          TCO 运营成本测算器
        </h2>
        <p className="mt-1 text-xs text-apple-subtext">拖动滑块调整参数，实时估算年度能耗支出（参考值，实际以运营情况为准）。</p>
      </div>

      <div className="grid gap-8 p-6 md:grid-cols-2 md:p-8">
        <div className="space-y-6">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className={sliderLabel}>年运营里程</span>
              <span className={sliderValue}>{mileage} 万公里/年</span>
            </div>
            <input
              type="range"
              min={5}
              max={30}
              step={1}
              value={mileage}
              onChange={(e) => setMileage(Number(e.target.value))}
              className="w-full accent-[#0071E3]"
              aria-label="年运营里程"
            />
            <div className="mt-1 flex justify-between text-[10px] text-apple-subtext">
              <span>5 万（短途区域）</span>
              <span>15 万（标准干线）</span>
              <span>30 万（双驾极限）</span>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className={sliderLabel}>
                {energyNames[energy]}单价（{priceUnits[energy]}）
              </span>
              <span className={sliderValue}>{price.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min={priceCfg.min}
              max={priceCfg.max}
              step={0.1}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full accent-[#0071E3]"
              aria-label={`${energyNames[energy]}单价`}
            />
            <div className="mt-1 flex justify-between text-[10px] text-apple-subtext">
              <span>{priceCfg.min}</span>
              <span>{priceCfg.max}</span>
            </div>
          </div>

          {isAltEnergy && (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className={sliderLabel}>柴油单价（对比基准，元/升）</span>
                <span className={sliderValue}>{dieselPrice.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min={6}
                max={9}
                step={0.1}
                value={dieselPrice}
                onChange={(e) => setDieselPrice(Number(e.target.value))}
                className="w-full accent-[#86868B]"
                aria-label="柴油单价"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center rounded-3xl bg-apple-bg p-5">
          <div className="space-y-4">
            <div>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-neutral-700">
                  {energy === "ev" ? <Zap size={13} className="text-apple-green" /> : <Fuel size={13} className="text-apple-blue" />}
                  本车年能耗支出
                </span>
                <span className="font-semibold tabular-nums">¥ {(myCost / 10000).toFixed(1)} 万</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-neutral-200">
                <motion.div
                  className={cn("h-full rounded-full", energy === "ev" ? "bg-apple-green" : "bg-apple-blue")}
                  animate={{ width: `${(myCost / maxCost) * 100}%` }}
                  transition={{ type: "spring", damping: 20, stiffness: 200 }}
                />
              </div>
            </div>

            {isAltEnergy && (
              <div>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="font-medium text-apple-subtext">同级柴油车对比基准</span>
                  <span className="font-semibold tabular-nums text-apple-subtext">¥ {(baselineCost / 10000).toFixed(1)} 万</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-neutral-200">
                  <motion.div
                    className="h-full rounded-full bg-[#A7ABB2]"
                    animate={{ width: `${(baselineCost / maxCost) * 100}%` }}
                    transition={{ type: "spring", damping: 20, stiffness: 200 }}
                  />
                </div>
              </div>
            )}
          </div>

          {isAltEnergy && saving > 0 && (
            <div className="mt-6 rounded-2xl border border-apple-green/30 bg-apple-green/10 px-5 py-4 text-center">
              <p className="text-xs text-neutral-600">按当前参数估算，较柴油基准每年可节省能耗支出</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-apple-green">¥ {wan(saving)} 万 / 年</p>
              <p className="mt-1 text-[11px] text-apple-subtext">
                3 年累计约 <span className="font-semibold text-apple-text">¥ {wan(threeYearSaving)} 万</span>
              </p>
              <p className="mt-1 text-[10px] text-apple-subtext">按 {mileage} 万公里/年 · 参考能耗 {consumption}{energy === "ev" ? " 度" : energy === "lng" ? " 公斤" : " 升"}/100km 估算</p>
            </div>
          )}

          <p className="mt-4 flex items-start gap-1.5 text-[11px] leading-relaxed text-apple-subtext">
            <Info size={12} className="mt-0.5 shrink-0" />
            测算结果为参考估算，不构成任何收益承诺；实际油耗/气耗/电耗受路况、载重与驾驶习惯影响。
          </p>
        </div>
      </div>
    </section>
  );
}
