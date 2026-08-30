import type { SalesConsultant } from "@/types/sales";

export type { SalesConsultant } from "@/types/sales";

export const salesConsultants: SalesConsultant[] = [
  {
    id: "chen-bo",
    name: "陈波",
    role: "资深销售顾问",
    phone: "13956812256",
    displayPhone: "139 5681 2256",
    avatarPlaceholderText: "陈",
    badge: "干线物流选型顾问",
    active: true,
    tags: ["高效快递快运车", "动力总成匹配", "全包售后服务协议"]
  },
  {
    id: "hou-xichang",
    name: "侯西昌",
    role: "资深销售顾问",
    phone: "17755853338",
    displayPhone: "177 5585 3338",
    avatarPlaceholderText: "侯",
    badge: "重卡选型顾问",
    active: true,
    tags: ["欧曼/乘龙全系重卡", "大客户车队集采", "低息金融分期"]
  },
  {
    id: "ren-xinbiao",
    name: "任信彪",
    role: "资深销售顾问",
    phone: "13955873257",
    displayPhone: "139 5587 3257",
    avatarPlaceholderText: "任",
    badge: "燃气重卡专家",
    active: true,
    tags: ["LNG 低气耗选型", "二手车置换评估", "长途运营 TCO 测算"]
  },
  {
    id: "ding-huaqiang",
    name: "丁华强",
    role: "资深销售顾问",
    phone: "17756878969",
    displayPhone: "177 5687 8969",
    avatarPlaceholderText: "丁",
    badge: "专用与工程车专家",
    active: true,
    tags: ["温控冷链车定制", "工程渣土自卸", "挂靠与上牌营运"]
  },
  {
    id: "liu-huihui",
    name: "刘慧慧",
    role: "资深销售顾问",
    phone: "15720586817",
    displayPhone: "157 2058 6817",
    avatarPlaceholderText: "刘",
    badge: "新能源与城配专员",
    active: true,
    tags: ["纯电重卡/轻卡", "同城商超仓配", "绿色物流路权政策"]
  }
];
