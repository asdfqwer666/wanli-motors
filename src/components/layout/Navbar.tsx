"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone, Truck, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { navLinks } from "@/lib/nav-links";
import MobileMenu from "@/components/layout/MobileMenu";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between rounded-2xl border border-white/60 bg-white/80 px-4 shadow-sm backdrop-blur-xl md:px-5">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
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
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
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
          <Link
            href="/contact"
            className="hidden items-center gap-1.5 rounded-full bg-apple-blue px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-apple-blueHover md:inline-flex"
          >
            <Phone size={14} />
            咨询选型
          </Link>
          <button
            type="button"
            aria-label={open ? "关闭菜单" : "打开菜单"}
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-apple-border bg-white/70 text-apple-text md:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </header>
  );
}
