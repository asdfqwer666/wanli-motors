import type { BrandId, EnergyId, ModelCategoryId, TruckModel } from "@/types/model";

const brandLabels: Record<BrandId, { label: string; full: string }> = {
  auman: { label: "欧曼", full: "福田戴姆勒欧曼 (AUMAN)" },
  chenglong: { label: "乘龙", full: "东风柳汽乘龙 (CHENGLONG)" }
};

const energyLabels: Record<EnergyId, { label: string; short: string }> = {
  diesel: { label: "燃油 (柴油)", short: "柴油" },
  lng: { label: "LNG (天然气)", short: "LNG" },
  ev: { label: "纯电动 (EV)", short: "纯电" }
};

const categoryLabels: Record<ModelCategoryId, string> = {
  tractor: "牵引车",
  cargo: "载货车",
  "cold-chain": "冷链车",
  "dump-truck": "工程自卸",
  "box-van": "专用厢式"
};

type ModelSeed = Omit<TruckModel, "brandLabel" | "brandFull" | "energyLabel" | "energyShort" | "categoryLabel">;

const seeds: ModelSeed[] = [
  {
    slug: "auman-xinghui-max-580",
    name: "欧曼星辉 MAX 580 牵引车",
    brand: "auman",
    energy: "diesel",
    drive: "6×4",
    power: { value: 580, unit: "PS", display: "580 PS" },
    category: "tractor",
    scenario: "干线高效物流",
    highlights: ["大马力动力链", "高效干线运输", "长途舒适驾驶室"],
    specs: { engineModel: null, gearbox: null, axleRatio: null, dimensions: null, curbWeight: null },
    featured: true
  },
  {
    slug: "auman-xinghui-lng-500",
    name: "欧曼星辉 LNG 500 燃气重卡",
    brand: "auman",
    energy: "lng",
    drive: "6×4",
    power: { value: 500, unit: "PS", display: "500 PS" },
    category: "tractor",
    scenario: "资源与长途运输",
    highlights: ["LNG 燃气动力", "燃料成本友好", "资源运输场景"],
    specs: { engineModel: null, gearbox: null, axleRatio: null, dimensions: null, curbWeight: null },
    featured: false
  },
  {
    slug: "auman-xinghui-cold-chain-530",
    name: "欧曼星辉 530 智能冷链车",
    brand: "auman",
    energy: "diesel",
    drive: "8×4 / 6×2",
    power: { value: 530, unit: "PS", display: "530 PS" },
    category: "cold-chain",
    scenario: "生鲜温控冷链",
    highlights: ["智能温控改装", "生鲜运输适配", "多驱动形式可选"],
    specs: { engineModel: null, gearbox: null, axleRatio: null, dimensions: null, curbWeight: null },
    featured: true
  },
  {
    slug: "auman-xinghui-express-500",
    name: "欧曼星辉 500 高速快运车",
    brand: "auman",
    energy: "diesel",
    drive: "6×2",
    power: { value: 500, unit: "PS", display: "500 PS" },
    category: "tractor",
    scenario: "快递电商干线",
    highlights: ["6×2 快运布局", "高时效干线", "轻量化取向"],
    specs: { engineModel: null, gearbox: null, axleRatio: null, dimensions: null, curbWeight: null },
    featured: false
  },
  {
    slug: "chenglong-h7-560-lng",
    name: "乘龙 H7 560 燃气牵引车",
    brand: "chenglong",
    energy: "lng",
    drive: "6×4",
    power: { value: 560, unit: "PS", display: "560 PS" },
    category: "tractor",
    scenario: "绿通及重载干线",
    highlights: ["560PS 燃气动力", "绿通重载适配", "燃气经济性"],
    specs: { engineModel: null, gearbox: null, axleRatio: null, dimensions: null, curbWeight: null },
    featured: true
  },
  {
    slug: "chenglong-h5-cargo-260",
    name: "乘龙 H5 260 大容积载货车",
    brand: "chenglong",
    energy: "diesel",
    drive: "4×2",
    power: { value: 260, unit: "PS", display: "260 PS" },
    category: "cargo",
    scenario: "区域集散分拨",
    highlights: ["大容积货厢", "区域分拨适配", "4×2 灵活机动"],
    specs: { engineModel: null, gearbox: null, axleRatio: null, dimensions: null, curbWeight: null },
    featured: false
  },
  {
    slug: "chenglong-k7-600",
    name: "乘龙 K7 600 旗舰重卡",
    brand: "chenglong",
    energy: "diesel",
    drive: "6×4",
    power: { value: 600, unit: "PS", display: "600 PS" },
    category: "tractor",
    scenario: "高端干线零担",
    highlights: ["600PS 旗舰动力", "高端驾驶室配置", "干线零担高效"],
    specs: { engineModel: null, gearbox: null, axleRatio: null, dimensions: null, curbWeight: null },
    featured: false
  },
  {
    slug: "chenglong-t7-longhead",
    name: "乘龙 T7 长头美洲风重卡",
    brand: "chenglong",
    energy: "diesel",
    drive: "6×4",
    power: { value: 560, unit: "PS", display: "560 PS" },
    category: "tractor",
    scenario: "跨省长途舒适型",
    highlights: ["长头安全布局", "美洲风造型", "长途舒适取向"],
    specs: { engineModel: null, gearbox: null, axleRatio: null, dimensions: null, curbWeight: null },
    featured: false
  },
  {
    slug: "chenglong-l3-city-light",
    name: "乘龙 L3 城配轻卡",
    brand: "chenglong",
    energy: "diesel",
    drive: "4×2",
    power: { value: 160, unit: "PS", display: "160 PS" },
    category: "cargo",
    scenario: "同城商超仓配",
    highlights: ["城配轻量车身", "商超仓配灵活", "城市路况适配"],
    specs: { engineModel: null, gearbox: null, axleRatio: null, dimensions: null, curbWeight: null },
    featured: false
  },
  {
    slug: "chenglong-m3-engineering-400",
    name: "乘龙 M3 400 重载工程自卸车",
    brand: "chenglong",
    energy: "diesel",
    drive: "8×4",
    power: { value: 400, unit: "PS", display: "400 PS" },
    category: "dump-truck",
    scenario: "渣土与矿区工程",
    highlights: ["8×4 重载底盘", "工程工况强化", "自卸上装适配"],
    specs: { engineModel: null, gearbox: null, axleRatio: null, dimensions: null, curbWeight: null },
    featured: false
  },
  {
    slug: "chenglong-h7-ev-400kw",
    name: "乘龙 H7 纯电牵引车",
    brand: "chenglong",
    energy: "ev",
    drive: "6×4",
    power: { value: 400, unit: "kW", display: "400 kW" },
    category: "tractor",
    scenario: "港口短驳/钢厂闭环",
    highlights: ["纯电动力平台", "短驳高频场景", "运营能耗友好"],
    specs: { engineModel: null, gearbox: null, axleRatio: null, dimensions: null, curbWeight: null },
    featured: true
  },
  {
    slug: "auman-xinghui-box-350",
    name: "欧曼星辉 350 专用厢式运输车",
    brand: "auman",
    energy: "diesel",
    drive: "6×2",
    power: { value: 350, unit: "PS", display: "350 PS" },
    category: "box-van",
    scenario: "工业散货及专线",
    highlights: ["厢式专用上装", "6×2 专线布局", "工业散货适配"],
    specs: { engineModel: null, gearbox: null, axleRatio: null, dimensions: null, curbWeight: null },
    featured: false
  }
];

export const models: TruckModel[] = seeds.map((seed) => ({
  ...seed,
  brandLabel: brandLabels[seed.brand].label,
  brandFull: brandLabels[seed.brand].full,
  energyLabel: energyLabels[seed.energy].label,
  energyShort: energyLabels[seed.energy].short,
  categoryLabel: categoryLabels[seed.category]
}));

export function getModelBySlug(slug: string): TruckModel | undefined {
  return models.find((m) => m.slug === slug);
}

export const featuredModels: TruckModel[] = models.filter((m) => m.featured);

export const brandMeta: Record<BrandId, { label: string; full: string; intro: string; chips: string[] }> = {
  auman: {
    label: "欧曼",
    full: "福田戴姆勒欧曼 (AUMAN)",
    intro: "以星辉系列为核心的科技重卡产品矩阵，聚焦干线高效物流、智能冷链与高速快运场景。",
    chips: ["干线高效", "冷链专线", "大马力动力链"]
  },
  chenglong: {
    label: "乘龙",
    full: "东风柳汽乘龙 (CHENGLONG)",
    intro: "以轻量化与燃气经济性见长，覆盖燃气重卡、纯电新能源与城配轻卡的全场景运力方案。",
    chips: ["轻量化", "燃气省芯", "新能源重卡"]
  }
};

export const energyFilterOptions: { id: EnergyId | "all"; label: string }[] = [
  { id: "all", label: "全部能源" },
  { id: "diesel", label: "燃油" },
  { id: "lng", label: "LNG 天然气" },
  { id: "ev", label: "纯电动 EV" }
];

export const categoryFilterOptions: { id: ModelCategoryId | "all"; label: string }[] = [
  { id: "all", label: "全部用途" },
  { id: "tractor", label: "牵引车" },
  { id: "cargo", label: "载货车" },
  { id: "cold-chain", label: "冷链车" },
  { id: "dump-truck", label: "工程自卸" },
  { id: "box-van", label: "专用厢式" }
];
