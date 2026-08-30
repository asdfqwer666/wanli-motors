"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Compass, Copy, ExternalLink, MapPin, Navigation, X } from "lucide-react";
import { companyInfo } from "@/data/company-info";
import { buildNavigationLinks } from "@/lib/navigation";
import { cn } from "@/lib/utils";

interface NavigationSheetProps {
  label?: string;
  variant?: "primary" | "ghost" | "light";
  className?: string;
}

const providerIcons: Record<string, React.ReactNode> = {
  高德地图: <MapPin size={15} />,
  百度地图: <Navigation size={15} />,
  腾讯地图: <Compass size={15} />,
  "Apple 地图": <MapPin size={15} />
};

export default function NavigationSheet({ label = "一键导航到店", variant = "ghost", className }: NavigationSheetProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const links = buildNavigationLinks();

  // Portal 到 body：避免任何毛玻璃/变换容器把 fixed 弹层锚定在局部导致越界
  useEffect(() => {
    setMounted(true);
  }, []);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(companyInfo.primaryAddress);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = companyInfo.primaryAddress;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors",
          variant === "primary" && "bg-apple-blue text-white hover:bg-apple-blueHover",
          variant === "ghost" && "border border-apple-border bg-white text-apple-text hover:bg-apple-hover",
          variant === "light" && "bg-white text-apple-text hover:opacity-90",
          className
        )}
      >
        <MapPin size={14} />
        {label}
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setOpen(false)}
                className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-4 backdrop-blur-md sm:items-center"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/80 bg-apple-bg p-6 shadow-dropdownMenu"
                >
                  <button
                    type="button"
                    aria-label="关闭"
                    onClick={() => setOpen(false)}
                    className="absolute right-5 top-5 rounded-full bg-black/[0.05] p-1.5 text-apple-text transition-colors hover:bg-black/[0.1]"
                  >
                    <X size={15} />
                  </button>

                  <div className="mb-1">
                    <span className="rounded-full bg-apple-blue/10 px-2 py-0.5 text-[10px] font-semibold text-apple-blue">
                      颍东核心展厅
                    </span>
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-apple-text">前往门店看车与试乘试驾</h3>
                  <p className="mt-1 text-xs text-apple-subtext">选择您常用的地图 App，一键开启精准导航路线</p>

                  <div className="my-5 flex items-center justify-between rounded-2xl border border-black/[0.04] bg-white p-3.5">
                    <div className="flex items-start gap-2.5 pr-2">
                      <MapPin size={15} className="mt-0.5 shrink-0 text-apple-blue" />
                      <div>
                        <div className="text-xs font-semibold text-apple-text">{companyInfo.primaryAddress}</div>
                        <div className="mt-0.5 text-[10px] text-apple-subtext">颍东区东湖路与朝阳大道交叉口</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={copyAddress}
                      className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-apple-pill px-2.5 py-1.5 text-xs font-medium text-apple-text transition-colors hover:bg-apple-hover"
                    >
                      {copied ? <Check size={13} className="text-apple-green" /> : <Copy size={13} />}
                      <span>{copied ? "已复制" : "复制"}</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {links.map((link) => (
                      <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between rounded-2xl border border-black/[0.04] bg-white p-3 transition-all hover:border-apple-blue/30 hover:bg-white/90"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-apple-pill text-apple-text transition-colors group-hover:text-apple-blue">
                            {providerIcons[link.name]}
                          </span>
                          <span>
                            <span className="block text-xs font-semibold text-apple-text transition-colors group-hover:text-apple-blue">
                              {link.name}
                            </span>
                            <span className="block text-[10px] text-apple-subtext">{link.description}</span>
                          </span>
                        </div>
                        <ExternalLink size={14} className="text-apple-subtext transition-colors group-hover:text-apple-blue" />
                      </a>
                    ))}
                  </div>

                  <p className="mt-5 text-center text-[11px] text-apple-subtext">
                    到店前欢迎致电顾问，提前安排专人接待 · 营业时间 {companyInfo.businessHours}
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
