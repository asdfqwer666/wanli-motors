"use client";

import { useEffect, useRef, type RefObject } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { navLinks } from "@/lib/nav-links";
import { openTruckMatcher } from "@/components/common/TruckMatcher";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  triggerRef: RefObject<HTMLButtonElement>;
}

export default function MobileMenu({ open, onClose, triggerRef }: MobileMenuProps) {
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;
    firstLinkRef.current?.focus({ preventScroll: true });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        triggerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, triggerRef]);

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="关闭导航菜单"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 z-40 cursor-default bg-black/20 backdrop-blur-[2px] lg:hidden"
          />
          <motion.div
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="移动端导航菜单"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-[max(0.75rem,env(safe-area-inset-right))] top-[calc(3.5rem+max(0.75rem,env(safe-area-inset-top)))] z-[60] w-[calc(100vw-3rem)] max-w-sm max-h-[calc(100dvh-4.75rem-env(safe-area-inset-bottom))] overflow-y-auto overscroll-contain rounded-2xl border border-white/70 bg-white/95 p-3 shadow-appleHover backdrop-blur-2xl lg:hidden"
          >
            <nav className="flex flex-col" aria-label="移动端主导航">
              {navLinks.map((link, index) => (
                <Link
                  ref={index === 0 ? firstLinkRef : undefined}
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="flex min-h-11 items-center rounded-xl px-4 py-3 text-[15px] text-apple-text outline-none transition-colors hover:bg-apple-hover focus-visible:ring-2 focus-visible:ring-apple-blue"
                >
                  {link.label}
                </Link>
              ))}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setTimeout(openTruckMatcher, 200);
                }}
                className="mt-1 flex min-h-11 items-center gap-2 rounded-xl px-4 py-3 text-[15px] font-medium text-apple-blue outline-none transition-colors hover:bg-apple-hover focus-visible:ring-2 focus-visible:ring-apple-blue"
              >
                <Sparkles size={15} />
                智能帮我选车
              </button>
              <Link
                href="/contact"
                onClick={onClose}
                className="mt-2 flex min-h-11 items-center justify-center rounded-xl bg-apple-blue px-4 py-3 text-center text-[15px] font-medium text-white outline-none focus-visible:ring-2 focus-visible:ring-apple-blue focus-visible:ring-offset-2"
              >
                咨询选型
              </Link>
            </nav>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
