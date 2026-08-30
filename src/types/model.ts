export type BrandId = "auman" | "chenglong";
export type EnergyId = "diesel" | "lng" | "ev";
export type ModelCategoryId = "tractor" | "cargo" | "cold-chain" | "dump-truck" | "light" | "box-van";

export interface ModelPower {
  value: number;
  unit: "PS" | "kW";
  display: string;
}

/** 由门店确认提供的结构化参数；未经确认的字段为 null，界面展示“— 咨询门店” */
export interface ModelSpecs {
  engineModel: string | null;
  gearbox: string | null;
  axleRatio: string | null;
  dimensions: string | null;
  curbWeight: string | null;
}

/** 「3 秒选型决策卡」结构化判断档案（编辑性建议内容，非厂家参数） */
export interface TruckDecisionProfile {
  targetUser: string;
  boundaryCondition: string;
  paybackEstimate: string;
  killerFeatures: string[];
  recommendScore: number;
}

/** TCO 测算参数：百公里参考能耗 + 默认能源单价（均为可调估算默认值） */
export interface TruckTCOConfig {
  fuelConsumption100km: number;
  unitPriceEstimate: number;
}

export interface HighlightSpec {
  label: string;
  value: string;
}

export interface TruckModel {
  slug: string;
  name: string;
  subtitle: string;
  brand: BrandId;
  brandLabel: string;
  brandFull: string;
  energy: EnergyId;
  energyLabel: string;
  energyShort: string;
  drive: string;
  power: ModelPower;
  torque: string;
  engine: string;
  transmission: string;
  rearAxle: string;
  gvw: string;
  category: ModelCategoryId;
  categoryLabel: string;
  scenario: string;
  specs: ModelSpecs;
  decision: TruckDecisionProfile;
  tco: TruckTCOConfig;
  highlightSpecs: HighlightSpec[];
  priceGuide: string;
  featured: boolean;
}
