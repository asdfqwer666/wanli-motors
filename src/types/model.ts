export type BrandId = "auman" | "chenglong";
export type EnergyId = "diesel" | "lng" | "ev";
export type ModelCategoryId = "tractor" | "cargo" | "cold-chain" | "dump-truck" | "box-van";

export interface ModelPower {
  value: number;
  unit: "PS" | "kW";
  display: string;
}

/** 未经验证的参数一律为 null，界面展示“— 咨询门店”，严禁虚构 */
export interface ModelSpecs {
  engineModel: string | null;
  gearbox: string | null;
  axleRatio: string | null;
  dimensions: string | null;
  curbWeight: string | null;
}

export interface TruckModel {
  slug: string;
  name: string;
  brand: BrandId;
  brandLabel: string;
  brandFull: string;
  energy: EnergyId;
  energyLabel: string;
  energyShort: string;
  drive: string;
  power: ModelPower;
  category: ModelCategoryId;
  categoryLabel: string;
  scenario: string;
  highlights: string[];
  specs: ModelSpecs;
  featured: boolean;
}
