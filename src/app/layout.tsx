import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "万里商用车 | 阜阳市万里汽车销售服务有限公司",
    template: "%s | 万里商用车"
  },
  description:
    "欧曼、乘龙官方授权商用车经销服务商，位于安徽省阜阳市颍东区，提供重卡选型、金融分期、置换评估、上牌营运协助与售后保障服务。",
  keywords: ["欧曼", "乘龙", "商用车", "重卡", "颍东区", "阜阳", "万里汽车"]
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F5F5F7"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className="font-sans">{children}</body>
    </html>
  );
}
