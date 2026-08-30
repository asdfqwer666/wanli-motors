"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Compass, Copy, MapPin, X } from "lucide-react";
import { companyInfo } from "@/data/company-info";
import { buildNavigationLinks } from "@/lib/navigation";
import { cn } from "@/lib/utils";

interface NavigationSheetProps {
  label?: string;
  variant?: "primary" | "ghost" | "light";
  className?: string;
}

export default function NavigationSheet({ label = "一键导航到店", variant = "ghost", className }: NavigationSheetProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const links = buildNavigationLinks();

  // Portal 到 body：避免顶栏 backdrop-blur 把 fixed 弹层锚定在导航条内导致越界
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
                className="fixed inset-0 z-[60] flex items-end justify-center bg-black/30 backdrop-blur-sm sm:items-center"
              >
            <motion.div
              initial={{ y: 48, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 48, opacity: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-t-4xl border border-white/60 bg-white/95 p-6 shadow-dropdownMenu backdrop-blur-2xl sm:rounded-4xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">前往颍东展厅</h3>
                  <p className="mt-1 text-xs leading-relaxed text-apple-subtext">{companyInfo.primaryAddress}</p>
                </div>
                <button
                  type="button"
                  aria-label="关闭"
                  onClick={() => setOpen(false)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-apple-pill text-apple-subtext transition-colors hover:bg-apple-hover"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {links.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-2xl border border-apple-border bg-apple-bg px-4 py-3.5 transition-colors hover:bg-apple-hover"
                  >
                    <span className="flex items-center gap-1.5 text-sm font-medium">
                      <Compass size={14} className="text-apple-blue" />
                      {link.name}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-apple-subtext">{link.description}</span>
                  </a>
                ))}
              </div>

              <button
                type="button"
                onClick={copyAddress}
                className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-full border border-apple-border bg-white py-2.5 text-sm font-medium text-apple-text transition-colors hover:bg-apple-hover"
              >
                {copied ? <Check size={14} className="text-apple-green" /> : <Copy size={14} />}
                {copied ? "地址已复制" : "复制门店地址"}
              </button>

              <p className="mt-3 text-center text-[11px] text-apple-subtext">
                售后/停放区域：{companyInfo.storeSceneAddress} · 到店前建议电话确认
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
