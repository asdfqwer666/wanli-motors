import Link from "next/link";
import { ArrowRight, Bell, MapPin, Truck } from "lucide-react";
import { companyInfo } from "@/data/company-info";
import HeroSection from "@/components/home/HeroSection";
import BrandTabs from "@/components/home/BrandTabs";
import FeaturedGrid from "@/components/home/FeaturedGrid";
import StoreGallery from "@/components/home/StoreGallery";
import SalesTeamSection from "@/components/home/SalesTeamSection";
import TrustSection from "@/components/home/TrustSection";

export const dynamic = "force-dynamic";

const dynamics = [
  {
    tag: "新车到店",
    icon: Truck,
    title: "星辉系列展车整备上线",
    desc: "星辉系列牵引车与 LNG 配置展车已完成整备与出库检查，欢迎到店鉴赏并试乘对比。"
  },
  {
    tag: "批量交付",
    icon: ArrowRight,
    title: "车队客户批量交付服务",
    desc: "为本地物流车队提供批量选车、金融分期与上牌营运一站式交付协助。"
  },
  {
    tag: "季节关怀",
    icon: Bell,
    title: "换季保养与配件保障提醒",
    desc: "提供原厂配件与定期保养咨询建议，助力运输旺季保持高出勤率。"
  }
];

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BrandTabs />
      <FeaturedGrid />
      <StoreGallery />
      <SalesTeamSection />
      <TrustSection />

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">门店动态</h2>
          <p className="mt-3 text-apple-subtext">新车到店 · 批量交付 · 养护关怀</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {dynamics.map(({ icon: Icon, tag, title, desc }) => (
            <article
              key={title}
              className="rounded-3xl border border-apple-border bg-apple-card p-6 shadow-appleCard transition-shadow hover:shadow-appleHover"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200/60 bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600">
                <Icon size={12} />
                {tag}
              </span>
              <h3 className="mt-4 text-base font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-apple-subtext">{desc}</p>
            </article>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-apple-subtext">
          以上为门店动态示例占位内容，正式动态信息以门店实际发布为准。
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-28">
        <div className="rounded-4xl bg-apple-text px-8 py-14 text-center text-white md:px-14">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">到店咨询 · 现场选车</h2>
          <p className="mx-auto mt-4 flex max-w-xl items-center justify-center gap-2 text-sm text-white/70 md:text-base">
            <MapPin size={16} className="shrink-0" />
            {companyInfo.primaryAddress}
          </p>
          <p className="mt-2 text-sm text-white/60">营业时间：{companyInfo.businessHours}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[15px] font-medium text-apple-text transition-opacity hover:opacity-90"
            >
              联系销售顾问
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/models"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-[15px] font-medium text-white transition-colors hover:bg-white/10"
            >
              浏览全部车型
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
