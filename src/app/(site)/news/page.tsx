import type { Metadata } from "next";
import { ArrowRight, Bell, Truck } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "门店动态",
  description: "万里商用车新车到店、批量交付与养护关怀动态（示例占位，正式信息以门店发布为准）。"
};

const items = [
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
    desc: "为本地物流车队提供批量选车、金融分期与上牌营运一站式交付协助，缩短投运周期。"
  },
  {
    tag: "季节关怀",
    icon: Bell,
    title: "换季保养与配件保障提醒",
    desc: "提供原厂配件与定期保养咨询建议，助力车队在运输旺季保持高出勤率。"
  }
];

export default function NewsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-28 pt-32">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">新车到店与交付动态</h1>
        <p className="mt-4 text-apple-subtext">
          记录门店的到店、交付与养护服务动态，欢迎持续关注。
        </p>
      </div>

      <div className="mt-10 space-y-6">
        {items.map(({ icon: Icon, tag, title, desc }) => (
          <article
            key={title}
            className="rounded-3xl border border-apple-border bg-apple-card p-6 shadow-appleCard transition-shadow hover:shadow-appleHover md:p-8"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200/60 bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600">
              <Icon size={12} />
              {tag}
            </span>
            <h2 className="mt-4 text-lg font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-apple-subtext">{desc}</p>
          </article>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-apple-subtext">
        以上为门店动态示例占位内容，正式动态信息以门店实际发布为准。
      </p>

      <div className="mt-10 text-center">
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-full bg-apple-blue px-6 py-3 text-[15px] font-medium text-white transition-colors hover:bg-apple-blueHover"
        >
          联系顾问了解最新到店信息
        </Link>
      </div>
    </div>
  );
}
