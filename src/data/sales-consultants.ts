import type { SalesConsultant } from "@/types/sales";

export type { SalesConsultant } from "@/types/sales";

export const salesConsultants: SalesConsultant[] = [
  {
    id: "hou-xichang",
    name: "侯西昌",
    role: "资深销售顾问",
    phone: "17755853338",
    displayPhone: "177 5585 3338",
    avatarPlaceholderText: "侯",
    badge: "重卡选型顾问",
    active: true,
    tags: ["重卡选型", "金融分期", "欧曼/乘龙全系"]
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
    tags: ["干线物流", "燃气车型", "置换评估"]
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
    tags: ["冷链专用", "工程自卸", "车队集采"]
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
    tags: ["新能源轻卡", "城配物流", "上牌交付"]
  }
];
