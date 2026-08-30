"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Phone, Sparkles, Truck, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { navLinks } from "@/lib/nav-links";
import { salesConsultants } from "@/data/sales-consultants";
import { openTruckMatcher } from "@/components/common/TruckMatcher";
import MobileMenu from "@/components/layout/MobileMenu";
import NavigationSheet from "@/components/common/NavigationSheet";

const featuredLinks = [
  { href: "/models", label: "选购全部商用车", big: true },
  { href: "/models/auman-xinghui-max-580", label: "欧曼星辉 MAX 580" },
  { href: "/models/chenglong-h7-560-lng", label: "乘龙 H7 560 LNG" },
  { href: "/models/chenglong-k7-600", label: "乘龙 K7 600 旗舰" },
  { href: "/models/chenglong-t7-longhead", label: "乘龙 T7 长头旗舰" },
  { href: "/models/chenglong-h7-ev-400kw", label: "乘龙 H7 纯电重卡" }
];

const zoneLinks = [
  { href: "/models?energy=diesel", label: "燃油高效车型" },
  { href: "/models?energy=lng", label: "LNG 天然气专区" },
  { href: "/models?energy=ev", label: "纯电动 EV 专区" },
  { href: "/models?category=cold-chain", label: "冷链专用车" },
  { href: "/models?category=dump-truck", label: "工程自卸车" }
];

const toolLinks: { action?: "matcher"; href?: string; label: string; desc: string }[] = [
  { action: "matcher", label: "3 秒智能选型自测", desc: "3 个问题匹配最优车型" },
  { href: "/compare", label: "车型横向对比", desc: "2-4 款参数对照" },
  { href: "/models/chenglong-h7-560-lng#tco", label: "TCO 成本测算", desc: "算一算每年省多少" },
  { href: "/contact#consultants", label: "顾问名录", desc: "4 位顾问一键直拨" }
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [phoneOpen, setPhoneOpen] = useState(false);
  const pathname = usePathname();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setMegaOpen(false), 160);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4" onMouseLeave={scheduleClose}>
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between rounded-2xl border border-white/60 bg-white/80 px-4 shadow-sm backdrop-blur-xl md:px-5">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-apple-text text-white">
            <Truck size={18} strokeWidth={1.8} />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold tracking-wide">万里商用车</span>
            <span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-apple-subtext">
              Wanli Motors
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <button
            type="button"
            onMouseEnter={openMega}
            onFocus={openMega}
            onClick={() => setMegaOpen(true)}
            aria-expanded={megaOpen}
            className={cn(
              "flex items-center gap-1 rounded-full px-3.5 py-1.5 text-sm transition-colors",
              megaOpen || pathname.startsWith("/models")
                ? "bg-apple-hover font-medium text-apple-text"
                : "text-apple-subtext hover:text-apple-text"
            )}
          >
            车型中心
            <ChevronDown size={13} className={cn("transition-transform", megaOpen && "rotate-180")} />
          </button>
          {navLinks
            .filter((l) => l.href !== "/" && l.href !== "/models")
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onMouseEnter={scheduleClose}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm transition-colors",
                  pathname === link.href
                    ? "bg-apple-hover font-medium text-apple-text"
                    : "text-apple-subtext hover:text-apple-text"
                )}
              >
                {link.label}
              </Link>
            ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:block" onMouseEnter={scheduleClose}>
            <NavigationSheet label="一键导航" variant="ghost" className="px-3.5 py-1.5 text-sm" />
          </div>
          <div className="relative hidden md:block" onMouseEnter={scheduleClose}>
            <button
              type="button"
              aria-label="顾问快速拨号"
              onClick={() => setPhoneOpen((v) => !v)}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full border border-apple-border bg-white text-apple-text transition-colors hover:bg-apple-hover",
                phoneOpen && "bg-apple-hover"
              )}
            >
              <Phone size={16} />
            </button>
            {phoneOpen && (
              <div className="absolute right-0 top-11 w-64 rounded-2xl border border-apple-border bg-white/95 p-2 shadow-dropdownMenu backdrop-blur-2xl">
                <p className="px-3 py-2 text-[11px] font-medium text-apple-subtext">顾问直线 · 点击直拨</p>
                {salesConsultants.map((c) => (
                  <a
                    key={c.id}
                    href={`tel:${c.phone}`}
                    className="flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-apple-hover"
                  >
                    <span className="text-sm font-medium">{c.name}</span>
                    <span className="text-xs tabular-nums text-apple-subtext">{c.displayPhone}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
          <Link
            href="/contact"
            className="hidden items-center gap-1.5 rounded-full bg-apple-blue px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-apple-blueHover md:inline-flex"
          >
            咨询选型
          </Link>
          <button
            type="button"
            aria-label={mobileOpen ? "关闭菜单" : "打开菜单"}
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-apple-border bg-white/70 text-apple-text md:hidden"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {megaOpen && (
        <div
          aria-hidden
          onClick={() => setMegaOpen(false)}
          className="fixed inset-0 z-[-1] bg-black/20 backdrop-blur-md"
        />
      )}

      {megaOpen && (
        <div className="fixed inset-x-0 top-[76px] z-40 hidden justify-center px-4 md:flex" onMouseEnter={openMega}>
          <div className="grid w-full max-w-5xl grid-cols-[1.15fr_1fr_1.1fr] gap-8 rounded-3xl border border-white/60 bg-white/95 p-8 shadow-dropdownMenu backdrop-blur-2xl">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-apple-subtext">选购车型</p>
              <div className="mt-3 space-y-0.5">
                {featuredLinks.map((l) => (
                  <Link
                    key={l.href + l.label}
                    href={l.href}
                    onClick={() => setMegaOpen(false)}
                    className={cn(
                      "block rounded-xl px-3 py-2 font-semibold text-apple-text transition-all hover:translate-x-0.5 hover:bg-apple-hover",
                      l.big ? "text-xl" : "text-base"
                    )}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-apple-subtext">能源与场景专区</p>
              <div className="mt-3 space-y-0.5">
                {zoneLinks.map((l) => (
                  <Link
                    key={l.href + l.label}
                    href={l.href}
                    onClick={() => setMegaOpen(false)}
                    className="block rounded-xl px-3 py-2 text-[15px] font-medium text-neutral-700 transition-all hover:translate-x-0.5 hover:bg-apple-hover"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-apple-subtext">快速决策工具</p>
              <div className="mt-3 space-y-1">
                {toolLinks.map((l) =>
                  l.action === "matcher" ? (
                    <button
                      key={l.label}
                      type="button"
                      onClick={() => {
                        setMegaOpen(false);
                        openTruckMatcher();
                      }}
                      className="flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-apple-hover"
                    >
                      <Sparkles size={16} className="mt-0.5 shrink-0 text-apple-blue" />
                      <span>
                        <span className="block text-[15px] font-semibold">{l.label}</span>
                        <span className="block text-xs text-apple-subtext">{l.desc}</span>
                      </span>
                    </button>
                  ) : (
                    <Link
                      key={l.label}
                      href={l.href ?? "#"}
                      onClick={() => setMegaOpen(false)}
                      className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-apple-hover"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-apple-blue" />
                      <span>
                        <span className="block text-[15px] font-semibold">{l.label}</span>
                        <span className="block text-xs text-apple-subtext">{l.desc}</span>
                      </span>
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
