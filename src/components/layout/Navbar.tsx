"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calculator,
  ChevronRight,
  MapPin,
  Menu,
  Phone,
  Scale,
  ShieldCheck,
  Sparkles,
  Truck,
  X
} from "lucide-react";
import { companyInfo } from "@/data/company-info";
import { salesConsultants } from "@/data/sales-consultants";
import { openTruckMatcher } from "@/components/common/TruckMatcher";
import MobileMenu from "@/components/layout/MobileMenu";
import { cn } from "@/lib/utils";

type MenuKey = "models" | "tools" | "about" | "contact";

interface MegaTruckItem {
  title: string;
  slug: string;
  desc: string;
  tag: string;
  brand: string;
}

const FEATURED_TRUCKS: MegaTruckItem[] = [
  { title: "欧曼星辉 MAX 580", slug: "auman-xinghui-max-580", desc: "580PS 柴油旗舰 · 干线长途高效物流", tag: "干线旗舰", brand: "欧曼" },
  { title: "乘龙 H7 560 LNG", slug: "chenglong-h7-560-lng", desc: "560PS 燃气重卡 · 极致低 TCO 运营", tag: "燃气畅销", brand: "乘龙" },
  { title: "乘龙 T7 长头重卡", slug: "chenglong-t7-longhead", desc: "美洲长头风范 · 超低风阻舒适长途", tag: "长途舒适", brand: "乘龙" },
  { title: "欧曼星辉冷链 530", slug: "auman-xinghui-cold-chain-530", desc: "智能温控一体化 · 生鲜高时效保障", tag: "冷链专线", brand: "欧曼" },
  { title: "乘龙 H7 纯电 400kW", slug: "chenglong-h7-ev-400kw", desc: "400kW 零碳绿电 · 港口钢厂短驳", tag: "新能源", brand: "乘龙" },
  { title: "乘龙 L3 城配轻卡", slug: "chenglong-l3-city-light", desc: "同城商超仓配 · 灵活合规大容积", tag: "城市配送", brand: "乘龙" }
];

export default function Navbar() {
  const [activeMenu, setActiveMenu] = useState<MenuKey | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

  /** 120ms 进场防抖：鼠标快速扫过导航条不误触 */
  const handleMouseEnter = (key: MenuKey) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setActiveMenu(key), 120);
  };

  /** 200ms 离场缓冲桥：允许斜向移动鼠标进入面板而不消失 */
  const handleMouseLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setActiveMenu(null), 200);
  };

  const cancelClose = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  useEffect(() => {
    setActiveMenu(null);
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveMenu(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const navItemClass = (key: MenuKey, href: string) =>
    cn(
      "px-3.5 py-1.5 rounded-full text-sm font-medium tracking-wide transition-all duration-200",
      activeMenu === key || pathname === href
        ? "text-apple-blue bg-black/[0.04]"
        : "text-apple-text/80 hover:text-apple-text hover:bg-black/[0.03]"
    );

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50" onMouseLeave={handleMouseLeave}>
        <nav className="relative z-50 border-b border-black/[0.06] bg-apple-bg/85 text-apple-text backdrop-blur-2xl">
          <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link className="group flex items-center gap-2.5" href="/">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-apple-text text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
                <Truck className="h-4 w-4" />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-sm font-semibold tracking-tight">万里商用车</span>
                <span className="text-[10px] uppercase tracking-wider text-apple-subtext">Fuyang Wanli Auto</span>
              </span>
            </Link>

            <div className="hidden items-center gap-1 lg:flex lg:gap-1.5">
              <Link href="/models" className={navItemClass("models", "/models")} onMouseEnter={() => handleMouseEnter("models")}>
                车型中心
              </Link>
              <Link href="/compare" className={navItemClass("tools", "/compare")} onMouseEnter={() => handleMouseEnter("tools")}>
                选型与决策
              </Link>
              <Link href="/about" className={navItemClass("about", "/about")} onMouseEnter={() => handleMouseEnter("about")}>
                门店与实景
              </Link>
              <Link href="/contact" className={navItemClass("contact", "/contact")} onMouseEnter={() => handleMouseEnter("contact")}>
                销售团队
              </Link>
              <Link
                href="/news"
                onMouseEnter={handleMouseLeave}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-sm font-medium tracking-wide transition-all duration-200",
                  pathname === "/news" ? "text-apple-blue bg-black/[0.04]" : "text-apple-text/80 hover:text-apple-text hover:bg-black/[0.03]"
                )}
              >
                交付动态
              </Link>
            </div>

            <div className="hidden items-center gap-3 sm:flex">
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 rounded-full bg-apple-text px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-all duration-200 hover:bg-apple-accent hover:shadow"
              >
                <Phone className="h-3 w-3 text-apple-green" />
                <span>咨询顾问</span>
              </Link>
            </div>

            <div className="flex items-center lg:hidden">
              <button
                ref={mobileMenuButtonRef}
                type="button"
                aria-label={mobileMenuOpen ? "关闭导航菜单" : "打开导航菜单"}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation"
                onClick={() => setMobileMenuOpen((v) => !v)}
                className="flex h-11 w-11 items-center justify-center rounded-xl text-neutral-600 outline-none transition-colors hover:bg-black/[0.04] hover:text-neutral-900 focus-visible:ring-2 focus-visible:ring-apple-blue"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </nav>

        <AnimatePresence>
          {activeMenu && (
            <motion.div
              key={activeMenu}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={cancelClose}
              onMouseLeave={handleMouseLeave}
              className="absolute left-0 right-0 top-14 overflow-hidden border-b border-black/[0.08] bg-apple-bg/95 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.12)] backdrop-blur-3xl"
            >
              <div className="mx-auto max-w-7xl px-6 py-8">
                {activeMenu === "models" && (
                  <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-12 border-black/[0.06] pr-6 lg:col-span-3 lg:border-r">
                      <span className="mb-3 block text-[11px] font-semibold uppercase tracking-wider text-apple-subtext">
                        按品牌选购
                      </span>
                      <div className="flex gap-4 space-y-3 lg:flex-col lg:gap-0">
                        <Link
                          href="/models?brand=auman"
                          onClick={() => setActiveMenu(null)}
                          className="block text-2xl font-bold tracking-tight text-apple-text transition-colors hover:text-apple-blue"
                        >
                          福田戴姆勒 欧曼
                        </Link>
                        <Link
                          href="/models?brand=chenglong"
                          onClick={() => setActiveMenu(null)}
                          className="block text-2xl font-bold tracking-tight text-apple-text transition-colors hover:text-apple-blue"
                        >
                          东风柳汽 乘龙
                        </Link>
                      </div>
                      <div className="pt-4">
                        <Link
                          href="/models"
                          onClick={() => setActiveMenu(null)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-apple-blue hover:underline"
                        >
                          <span>浏览全部 12 款在售车型</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>

                    <div className="col-span-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-6">
                      {FEATURED_TRUCKS.map((truck) => (
                        <Link
                          key={truck.slug}
                          href={`/models/${truck.slug}`}
                          onClick={() => setActiveMenu(null)}
                          className="group rounded-2xl border border-black/[0.04] bg-white/70 p-3 transition-all duration-200 hover:border-black/[0.08] hover:bg-white hover:shadow-sm"
                        >
                          <div className="mb-1.5 flex items-center justify-between">
                            <span className="rounded-full border border-black/[0.03] bg-apple-pill px-2 py-0.5 text-[10px] font-medium text-apple-text/70">
                              {truck.tag}
                            </span>
                            <span className="text-[10px] text-apple-subtext">{truck.brand}</span>
                          </div>
                          <h4 className="text-sm font-semibold text-apple-text transition-colors group-hover:text-apple-blue">
                            {truck.title}
                          </h4>
                          <p className="mt-0.5 line-clamp-1 text-[11px] text-apple-subtext">{truck.desc}</p>
                        </Link>
                      ))}
                    </div>

                    <div className="col-span-12 flex flex-col justify-between border-black/[0.06] lg:col-span-3 lg:border-l lg:pl-6">
                      <div>
                        <span className="mb-3 block text-[11px] font-semibold uppercase tracking-wider text-apple-subtext">
                          购车极速工具
                        </span>
                        <div className="space-y-2.5">
                          <Link
                            href="/compare"
                            onClick={() => setActiveMenu(null)}
                            className="flex items-center gap-2 text-xs text-apple-text/80 transition-colors hover:text-apple-blue"
                          >
                            <Scale className="h-3.5 w-3.5 text-apple-blue" />
                            <span>多车型参数横向对比</span>
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenu(null);
                              openTruckMatcher();
                            }}
                            className="flex items-center gap-2 text-xs text-apple-text/80 transition-colors hover:text-apple-blue"
                          >
                            <Sparkles className="h-3.5 w-3.5 text-apple-blue" />
                            <span>3 秒智能选型自测</span>
                          </button>
                          <Link
                            href="/models/chenglong-h7-560-lng#tco"
                            onClick={() => setActiveMenu(null)}
                            className="flex items-center gap-2 text-xs text-apple-text/80 transition-colors hover:text-apple-blue"
                          >
                            <Calculator className="h-3.5 w-3.5 text-apple-blue" />
                            <span>TCO 运营成本计算器</span>
                          </Link>
                        </div>
                      </div>

                      <div className="mt-6 hidden rounded-2xl border border-black/[0.04] bg-apple-hover/60 p-3 lg:block">
                        <p className="text-[11px] text-apple-subtext">颍东区展厅选车专享</p>
                        <p className="mt-0.5 text-xs font-medium text-apple-text">支持实车试乘试驾与分期定制</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeMenu === "tools" && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Link
                      href="/compare"
                      onClick={() => setActiveMenu(null)}
                      className="group rounded-2xl border border-black/[0.04] bg-white/70 p-4 transition-all hover:bg-white"
                    >
                      <Scale className="mb-2 h-6 w-6 text-apple-blue" />
                      <h4 className="text-sm font-semibold text-apple-text group-hover:text-apple-blue">车型规格横向对比</h4>
                      <p className="mt-1 text-xs text-apple-subtext">支持 2-4 款重卡马力、气耗、驱动与承载能力同屏对比，可只看差异。</p>
                    </Link>

                    <Link
                      href="/models/chenglong-h7-560-lng#tco"
                      onClick={() => setActiveMenu(null)}
                      className="group rounded-2xl border border-black/[0.04] bg-white/70 p-4 transition-all hover:bg-white"
                    >
                      <Calculator className="mb-2 h-6 w-6 text-apple-green" />
                      <h4 className="text-sm font-semibold text-apple-text group-hover:text-apple-blue">TCO 燃气/燃油经济账</h4>
                      <p className="mt-1 text-xs text-apple-subtext">按年行驶里程与油气电价动态测算，每年为您节省的真金白银一目了然。</p>
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveMenu(null);
                        openTruckMatcher();
                      }}
                      className="group rounded-2xl border border-black/[0.04] bg-white/70 p-4 text-left transition-all hover:bg-white"
                    >
                      <Sparkles className="mb-2 h-6 w-6 text-orange-400" />
                      <h4 className="text-sm font-semibold text-apple-text group-hover:text-apple-blue">3 秒智能场景找车</h4>
                      <p className="mt-1 text-xs text-apple-subtext">回答干线快递、冷链、工程或城配场景，系统秒级匹配最具性价比车型。</p>
                    </button>
                  </div>
                )}

                {activeMenu === "about" && (
                  <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-12 space-y-2 lg:col-span-4">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-apple-subtext">展厅与服务基地</span>
                      <h4 className="text-lg font-bold text-apple-text">{companyInfo.name}</h4>
                      <p className="text-xs leading-relaxed text-apple-subtext">
                        位于安徽省阜阳市颍东区核心商用车枢纽，建有标准化重卡展厅、大型整车停放车场与专属交付服务区。
                      </p>
                    </div>
                    <div className="col-span-12 space-y-2 border-black/[0.06] lg:col-span-4 lg:border-l lg:pl-6">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-apple-subtext">营业地址</span>
                      <div className="flex items-start gap-2 text-xs text-apple-text">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-apple-blue" />
                        <span>{companyInfo.primaryAddress}</span>
                      </div>
                      <p className="mt-1 text-[11px] text-apple-subtext">支持高德 / 百度 / 腾讯 / 苹果地图一键实时导航到店（门店页一键调起）</p>
                    </div>
                    <div className="col-span-12 space-y-2 border-black/[0.06] lg:col-span-4 lg:border-l lg:pl-6">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-apple-subtext">服务保障</span>
                      <div className="space-y-1 text-xs text-apple-text">
                        <p className="flex items-center gap-1.5">
                          <ShieldCheck className="h-3.5 w-3.5 text-apple-green" /> 厂家授权正品车源
                        </p>
                        <p className="flex items-center gap-1.5">
                          <ShieldCheck className="h-3.5 w-3.5 text-apple-green" /> 专属金融分期方案咨询
                        </p>
                        <p className="flex items-center gap-1.5">
                          <ShieldCheck className="h-3.5 w-3.5 text-apple-green" /> 上牌营运与售后配件保障
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeMenu === "contact" && (
                  <div>
                    <span className="mb-3 block text-[11px] font-semibold uppercase tracking-wider text-apple-subtext">
                      {salesConsultants.length} 位专业认证销售顾问（点击直拨咨询）
                    </span>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                      {salesConsultants.map((consultant) => (
                        <a
                          key={consultant.id}
                          href={`tel:${consultant.phone}`}
                          className="group block rounded-2xl border border-black/[0.04] bg-white/70 p-3.5 transition-all hover:border-black/[0.08] hover:bg-white hover:shadow-sm"
                        >
                          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-apple-text text-xs font-semibold text-white transition-colors group-hover:bg-apple-blue">
                            {consultant.name.slice(0, 1)}
                          </div>
                          <div className="text-sm font-semibold text-apple-text">{consultant.name}</div>
                          <div className="mt-0.5 text-[10px] leading-snug text-apple-subtext">{consultant.badge}</div>
                          <div className="mt-2 text-xs font-medium text-apple-blue group-hover:underline">
                            {consultant.displayPhone}
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {activeMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-none fixed inset-0 z-40 bg-black/20 backdrop-blur-md"
          />
        )}
      </AnimatePresence>

      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} triggerRef={mobileMenuButtonRef} />
    </>
  );
}
