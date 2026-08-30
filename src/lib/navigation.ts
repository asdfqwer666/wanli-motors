import { companyInfo } from "@/data/company-info";

/** 全平台地图调起参数（坐标为门店登记坐标，具体路线以地图平台规划为准） */
export interface NavigationTarget {
  name: string;
  description: string;
  getUrl: (lat: number, lng: number, title: string, address: string) => string;
}

export const navigationProviders: NavigationTarget[] = [
  {
    name: "高德地图",
    description: "Amap · 手机端可直达调起",
    getUrl: (lat, lng, title) =>
      `https://uri.amap.com/marker?position=${lng},${lat}&name=${encodeURIComponent(title)}&coordinate=gaode&callnative=1`
  },
  {
    name: "百度地图",
    description: "Baidu Map",
    getUrl: (lat, lng, title, address) =>
      `https://api.map.baidu.com/marker?location=${lat},${lng}&title=${encodeURIComponent(title)}&content=${encodeURIComponent(address)}&output=html&src=webapp.wanli.truck`
  },
  {
    name: "腾讯地图",
    description: "Tencent Map",
    getUrl: (lat, lng, title, address) =>
      `https://apis.map.qq.com/uri/v1/marker?marker=coord:${lat},${lng};title:${encodeURIComponent(title)};addr:${encodeURIComponent(address)}&referer=wanli_truck`
  },
  {
    name: "Apple 地图",
    description: "iPhone 自带地图",
    getUrl: (lat, lng, title) =>
      `https://maps.apple.com/?q=${encodeURIComponent(title)}&ll=${lat},${lng}`
  }
];

export function buildNavigationLinks() {
  const { coordinates, primaryAddress, name } = companyInfo;
  return navigationProviders.map((p) => ({
    name: p.name,
    description: p.description,
    url: p.getUrl(coordinates.lat, coordinates.lng, coordinates.name, primaryAddress)
  }));
}
