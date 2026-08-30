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

/** TCO 参考能耗与默认单价（行业常用估算值，可在计算器中调整） */
const TCO_DIESEL = { fuelConsumption100km: 32, unitPriceEstimate: 7.5 };
const TCO_LNG = { fuelConsumption100km: 29, unitPriceEstimate: 4.8 };
const TCO_EV = { fuelConsumption100km: 140, unitPriceEstimate: 0.8 };

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
    decision: {
      targetUser: "适合跨省干线高速物流、月行驶 1.5 万公里以上的配货运输与干线车队。",
      boundaryCondition: "以短途倒短、工地泥泞重载为主的工况不建议选择，可考虑乘龙 M3 工程自卸版。",
      paybackEstimate: "以 TCO 计算器默认参数估算，年燃料支出约 36 万元级；建议结合实际线路油耗与运价核算回本周期。",
      killerFeatures: ["580PS 大马力动力链", "低风阻驾驶室", "平地板大卧铺"],
      recommendScore: 96
    },
    tco: TCO_DIESEL,
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
    decision: {
      targetUser: "适合气源充足区域的资源运输与长途干线车队，年行驶里程越高、油气价差越大越划算。",
      boundaryCondition: "运营线路上加气站稀少或以短途工况为主的用户不建议首选。",
      paybackEstimate: "以 TCO 计算器默认参数估算，年燃料支出较同级柴油车型低约 15 万元（估算值，随油气价差浮动）。",
      killerFeatures: ["LNG 双气瓶长续航", "燃料成本低", "自重优化"],
      recommendScore: 93
    },
    tco: TCO_LNG,
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
    decision: {
      targetUser: "适合生鲜果蔬、冻品等温控运输车队，对温区稳定性和时效要求高的线路。",
      boundaryCondition: "以常温散货、建材为主的运输需求无需为温控配置买单，可选标准载货车。",
      paybackEstimate: "以 TCO 计算器默认参数估算年燃料支出约 36 万元级；温控货单价高，回本通常快于常温运输（以实际货量为准）。",
      killerFeatures: ["冷藏机组适配", "多温区可选", "8×4 / 6×2 可选"],
      recommendScore: 94
    },
    tco: TCO_DIESEL,
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
    decision: {
      targetUser: "适合以抛货为主的快递电商干线运输，追求时效与油耗平衡的车队。",
      boundaryCondition: "自重较大的重载资源运输不适合 6×2 布局，建议选 6×4 车型。",
      paybackEstimate: "以 TCO 计算器默认参数估算年燃料支出约 36 万元级；轻量化带来单趟多装，回本以票件量为准。",
      killerFeatures: ["6×2 轻量化", "高速经济工况", "大容积挂载"],
      recommendScore: 92
    },
    tco: TCO_DIESEL,
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
    decision: {
      targetUser: "适合绿通、重载干线运输，且线路沿线加气便利的车队与个体车主。",
      boundaryCondition: "极寒地区或加气网络覆盖弱的线路需谨慎评估气源保障。",
      paybackEstimate: "以 TCO 计算器默认参数估算，年燃料支出较同级柴油车型低约 15 万元（估算值，随油气价差浮动）。",
      killerFeatures: ["560PS 燃气动力", "气耗表现友好", "重载工况适配"],
      recommendScore: 95
    },
    tco: TCO_LNG,
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
    decision: {
      targetUser: "适合区域集散、分拨转运等中短途甩挂运输，看重装载效率与机动性。",
      boundaryCondition: "长途干线牵引需求请选择重卡牵引车系，本车为载货车定位。",
      paybackEstimate: "以 TCO 计算器默认参数估算年燃料支出约 20 万元级（按 10 万公里/年）；购车门槛低、周转快。",
      killerFeatures: ["大容积货厢", "4×2 灵活机动", "区域路况适配"],
      recommendScore: 90
    },
    tco: TCO_DIESEL,
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
    decision: {
      targetUser: "适合高端干线零担与快运线路，对驾驶舒适性、出勤率和形象有要求的车队。",
      boundaryCondition: "预算优先、路线固定且运价偏低的场景可对比同系列经济配置。",
      paybackEstimate: "以 TCO 计算器默认参数估算年燃料支出约 36 万元级；高端配置有助于吸引稳定优质货源。",
      killerFeatures: ["600PS 旗舰动力", "高端舒适配置", "低风阻造型"],
      recommendScore: 94
    },
    tco: TCO_DIESEL,
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
    decision: {
      targetUser: "适合跨省长途、单人在途时间长或双驾轮班的干线运输，重视安全与舒适。",
      boundaryCondition: "市政短驳、频繁倒车挪库的工况对长头车长不友好，请优先平头车型。",
      paybackEstimate: "以 TCO 计算器默认参数估算年燃料支出约 36 万元级；舒适性带来驾驶员留存与出勤稳定。",
      killerFeatures: ["长头碰撞缓冲", "低风阻车头", "宽适卧铺空间"],
      recommendScore: 91
    },
    tco: TCO_DIESEL,
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
    decision: {
      targetUser: "适合同城商超配送、仓配一体与市内短驳，路窄单多的城区场景。",
      boundaryCondition: "重载干线或工程工况请选择重卡系列，轻卡承载上限有限。",
      paybackEstimate: "以 TCO 计算器默认参数估算年燃料支出约 12 万元级（按 8 万公里/年）；购车与养车成本双低。",
      killerFeatures: ["车身灵活", "城区通过性好", "装卸高效"],
      recommendScore: 89
    },
    tco: { fuelConsumption100km: 14, unitPriceEstimate: 7.5 },
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
    decision: {
      targetUser: "适合渣土清运、矿区砂石等工程自卸场景，重载爬坡与非铺装路面作业。",
      boundaryCondition: "高速干线物流请选择牵引车系，自卸车不适应长途高速运营。",
      paybackEstimate: "以 TCO 计算器默认参数估算年燃料支出约 30 万元级（按 8 万公里/年，工程工况油耗偏高）；工程运价结算周期需纳入资金规划。",
      killerFeatures: ["8×4 重载底盘", "工程强化桥", "自卸上装适配"],
      recommendScore: 92
    },
    tco: { fuelConsumption100km: 38, unitPriceEstimate: 7.5 },
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
    decision: {
      targetUser: "适合港口短驳、钢厂/电厂闭环等有固定充电条件的高频短倒运输。",
      boundaryCondition: "无固定充电桩、线路不固定的长途运输暂不建议选择纯电车型。",
      paybackEstimate: "以 TCO 计算器默认参数估算，年能耗支出较同级柴油车型低约 19 万元（按工业电价 0.8 元/kWh 估算，实际以电价与充电模式为准）。",
      killerFeatures: ["零排放路权优", "电耗成本低", "高频出勤稳定"],
      recommendScore: 93
    },
    tco: TCO_EV,
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
    decision: {
      targetUser: "适合工业散货、零担专线等需要厢式防护与定点往返运输的用户。",
      boundaryCondition: "需要自卸功能的工程工况请选择自卸车系。",
      paybackEstimate: "以 TCO 计算器默认参数估算年燃料支出约 26 万元级（按 12 万公里/年）；专线定点运营成本可控。",
      killerFeatures: ["厢式防护", "6×2 专线经济性", "装卸便利"],
      recommendScore: 88
    },
    tco: TCO_DIESEL,
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
