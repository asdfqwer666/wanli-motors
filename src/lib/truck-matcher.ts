import { models } from "@/data/models";
import type { TruckModel } from "@/types/model";

export type ScenarioId = "express" | "cold" | "engineering" | "city";
export type DistanceId = "long" | "mid" | "regional" | "short";
export type EnergyPrefId = "diesel" | "lng" | "ev";

export interface MatcherOption {
  id: string;
  label: string;
  description?: string;
}

export const matcherQuestions: { key: "scenario" | "distance" | "energy"; title: string; options: MatcherOption[] }[] = [
  {
    key: "scenario",
    title: "您的运输业务场景是什么？",
    options: [
      { id: "express", label: "跨省干线 / 快递快运 / 高速零担" },
      { id: "cold", label: "绿通生鲜 / 温控冷链运输" },
      { id: "engineering", label: "砂石矿区 / 工程自卸 / 渣土" },
      { id: "city", label: "城市仓配 / 商超配送 / 区域集散" }
    ]
  },
  {
    key: "distance",
    title: "您的典型单程运输距离是？",
    options: [
      { id: "long", label: "1000 公里以上长途干线" },
      { id: "mid", label: "300 - 800 公里城际中长途" },
      { id: "regional", label: "100 - 300 公里区域集散" },
      { id: "short", label: "100 公里以内短驳闭环" }
    ]
  },
  {
    key: "energy",
    title: "动力与成本偏好？",
    options: [
      { id: "diesel", label: "柴油高效版 · 加油便利、残值稳定" },
      { id: "lng", label: "LNG 天然气版 · 燃料成本更低" },
      { id: "ev", label: "纯电动 EV 版 · 零排放、路权友好" }
    ]
  }
];

export interface MatchResult {
  model: TruckModel;
  reason: string;
}

/** 规则化匹配：场景 × 里程 × 能源偏好 → 推荐 1-2 款车型 */
export function recommendTrucks(scenario: string, distance: string, energy: string): { results: MatchResult[]; note: string | null } {
  const scored = models.map((m) => {
    let score = 0;
    const reasons: string[] = [];

    if (scenario === "express") {
      if (m.category === "tractor") {
        score += 3;
        reasons.push("干线牵引定位匹配");
      }
      if (["auman-xinghui-max-580", "auman-xinghui-express-500", "chenglong-k7-600", "chenglong-t7-longhead"].includes(m.slug)) score += 2;
    } else if (scenario === "cold") {
      if (m.category === "cold-chain") {
        score += 4;
        reasons.push("冷链温控专业适配");
      }
      if (m.scenario.includes("绿通")) score += 1;
    } else if (scenario === "engineering") {
      if (m.category === "dump-truck") {
        score += 4;
        reasons.push("工程自卸专车定位");
      }
    } else if (scenario === "city") {
      if (m.slug === "chenglong-l3-city-light") {
        score += 4;
        reasons.push("城配轻卡灵活高效");
      }
      if (m.slug === "chenglong-h5-cargo-260") score += 2;
      if (m.slug === "auman-xinghui-box-350" && distance === "regional") score += 1;
    }

    if (distance === "long") {
      if (m.drive === "6×4" && m.category === "tractor") score += 2;
      if ((m.power.unit === "PS" && m.power.value >= 500) || (m.power.unit === "kW" && m.power.value >= 300)) score += 1;
    } else if (distance === "short") {
      if (["chenglong-l3-city-light", "chenglong-h7-ev-400kw"].includes(m.slug)) score += 1;
      if (m.drive === "4×2") score += 1;
    } else if (distance === "mid") {
      if (["6×2", "4×2"].includes(m.drive)) score += 1;
    } else if (distance === "regional") {
      if (["chenglong-h5-cargo-260", "auman-xinghui-box-350"].includes(m.slug)) score += 1;
    }

    if (m.energy === energy) {
      score += 3;
      if (energy === "lng") reasons.push("LNG 燃料成本优势");
      if (energy === "ev") reasons.push("纯电能耗与路权优势");
      if (energy === "diesel") reasons.push("加油便利、残值稳定");
    }

    return { model: m, score, reasons };
  });

  const energyMatched = scored.filter((s) => s.model.energy === energy && s.score >= 4);
  let note: string | null = null;
  let pool = energyMatched.length > 0 ? energyMatched : scored;
  if (energyMatched.length === 0) {
    note = "您选择的动力偏好在该场景下暂无完全匹配车型，以下为同场景的主力推荐，可咨询顾问定制方案。";
  }

  pool = [...pool].sort((a, b) => b.score - a.score || b.model.decision.recommendScore - a.model.decision.recommendScore);

  const results: MatchResult[] = pool.slice(0, 2).map((s) => ({
    model: s.model,
    reason: Array.from(new Set([...s.reasons, `${s.model.categoryLabel} · ${s.model.scenario}`])).slice(0, 3).join("，")
  }));

  return { results, note };
}
