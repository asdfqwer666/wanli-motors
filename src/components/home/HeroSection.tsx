"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Gauge, Leaf, MapPin } from "lucide-react";

const stats = [
  { icon: Gauge, label: "580PS 强劲动力" },
  { icon: Leaf, label: "LNG / EV 新能源专区" },
  { icon: MapPin, label: "颍东核心展厅现车储备" }
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } }
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

export default function HeroSection() {
  return (
    <section data-testid="home-hero" className="relative overflow-hidden pb-20 pt-36 md:pt-44">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(255,255,255,0.9),transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-[100%] bg-gradient-to-b from-white to-transparent blur-2xl"
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto max-w-6xl px-6 text-center"
      >
        <motion.div variants={item}>
          <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200/60 bg-white/80 px-4 py-1.5 text-xs font-medium text-neutral-600 backdrop-blur">
            欧曼 · 乘龙 官方授权经销服务商
          </span>
        </motion.div>

        <motion.h1
          variants={item}
          className="mt-6 text-4xl font-semibold tracking-tight md:text-6xl lg:text-7xl"
        >
          万里笃行 · 智领干线
        </motion.h1>

        <motion.p
          variants={item}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-apple-subtext md:text-lg"
        >
          阜阳市万里汽车销售服务有限公司 —— 欧曼 / 乘龙 官方授权与专业商用车解决方案提供商
        </motion.p>

        <motion.div variants={item} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/models"
            className="inline-flex items-center gap-2 rounded-full bg-apple-blue px-6 py-3 text-[15px] font-medium text-white transition-colors hover:bg-apple-blueHover"
          >
            探索全部车型
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-apple-border bg-white px-6 py-3 text-[15px] font-medium text-apple-text transition-colors hover:bg-apple-hover"
          >
            预约咨询选型
          </Link>
        </motion.div>

        <motion.div
          variants={item}
          className="mt-14 flex flex-wrap items-center justify-center gap-3 md:gap-4"
        >
          {stats.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 rounded-full border border-apple-border bg-white/80 px-4 py-2 text-sm text-neutral-600 shadow-appleCard backdrop-blur"
            >
              <Icon size={15} className="text-apple-blue" />
              {label}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
