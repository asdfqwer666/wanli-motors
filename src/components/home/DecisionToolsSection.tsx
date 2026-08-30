"use client";

import Link from "next/link";
import { GitCompareArrows, MousePointerClick, Sparkles } from "lucide-react";
import { openTruckMatcher } from "@/components/common/TruckMatcher";

const tools = [
  {
    key: "matcher",
    icon: Sparkles,
    title: "3 秒智能选型自测",
    desc: "回答 3 个问题：业务场景、运输距离、动力偏好，立即匹配最适合您的 1-2 款车。",
    cta: "开始自测"
  },
  {
    key: "tco",
    icon: MousePointerClick,
    title: "TCO 运营成本测算",
    desc: "拖动里程与油气电价滑块，实时估算年度能耗支出，LNG / 纯电省多少一目了然。",
    cta: "去测算",
    href: "/models/chenglong-h7-560-lng#tco"
  },
  {
    key: "compare",
    icon: GitCompareArrows,
    title: "车型横向对比",
    desc: "勾选 2-4 款意向车型并排比较，支持「只看差异」，聚焦真正影响决策的区别。",
    cta: "开始对比",
    href: "/compare"
  }
];

export default function DecisionToolsSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="text-center">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">购车决策工具</h2>
        <p className="mt-3 text-apple-subtext">适不适合、省多少钱、差在哪里 —— 3 个工具帮您快速判断</p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {tools.map(({ key, icon: Icon, title, desc, cta, href }) => (
          <article
            key={key}
            className="flex flex-col rounded-3xl border border-apple-border bg-apple-card p-7 shadow-appleCard transition-shadow hover:shadow-appleHover"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-apple-pill text-apple-blue">
              <Icon size={20} strokeWidth={1.8} />
            </span>
            <h3 className="mt-4 text-lg font-semibold">{title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-apple-subtext">{desc}</p>
            {href ? (
              <Link
                href={href}
                className="mt-6 inline-flex w-fit items-center gap-1.5 rounded-full bg-apple-blue px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-apple-blueHover"
              >
                {cta}
              </Link>
            ) : (
              <button
                type="button"
                onClick={openTruckMatcher}
                className="mt-6 inline-flex w-fit items-center gap-1.5 rounded-full bg-apple-blue px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-apple-blueHover"
              >
                {cta}
              </button>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
