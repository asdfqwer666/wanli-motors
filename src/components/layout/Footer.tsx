import Link from "next/link";
import { Clock, MapPin, Phone, Truck } from "lucide-react";
import { companyInfo } from "@/data/company-info";
import { navLinks } from "@/lib/nav-links";

export default function Footer() {
  return (
    <footer className="border-t border-apple-border bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-apple-text text-white">
              <Truck size={18} strokeWidth={1.8} />
            </span>
            <span className="text-sm font-semibold">万里商用车</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-apple-subtext">
            {companyInfo.authorizedBrands.join(" · ")} 授权经销服务商，为物流公司与个体车主提供选型、金融、交付与售后全流程服务。
          </p>
          <p className="mt-4 flex items-center gap-2 text-sm text-apple-subtext">
            <Clock size={14} /> {companyInfo.businessHours}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold">快速导航</h3>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-apple-subtext transition-colors hover:text-apple-text">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">联系与地址</h3>
          <ul className="mt-4 space-y-3 text-sm text-apple-subtext">
            <li className="flex gap-2">
              <MapPin size={14} className="mt-0.5 shrink-0" />
              <span>{companyInfo.primaryAddress}</span>
            </li>
            <li className="flex gap-2">
              <MapPin size={14} className="mt-0.5 shrink-0" />
              <span>售后/停放区域：{companyInfo.storeSceneAddress}</span>
            </li>
            <li className="flex gap-2">
              <Phone size={14} className="mt-0.5 shrink-0" />
              <span>
                顾问直线电话见
                <Link href="/contact" className="mx-1 text-apple-blue hover:underline">
                  联系我们
                </Link>
                页面
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-apple-border">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <p className="text-xs leading-relaxed text-apple-subtext">{companyInfo.disclaimer}</p>
          <p className="mt-3 text-xs text-apple-subtext">
            © {new Date().getFullYear()} {companyInfo.name} · 本网站备案信息待补充
          </p>
        </div>
      </div>
    </footer>
  );
}
