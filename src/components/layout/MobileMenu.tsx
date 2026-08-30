"use client";

import Link from "next/link";
import { navLinks } from "@/lib/nav-links";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  if (!open) return null;

  return (
    <div className="mx-auto mt-2 max-w-6xl rounded-2xl border border-white/60 bg-white/90 p-3 shadow-appleHover backdrop-blur-xl md:hidden">
      <nav className="flex flex-col">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className="rounded-xl px-4 py-3 text-[15px] text-apple-text transition-colors hover:bg-apple-hover"
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/contact"
          onClick={onClose}
          className="mt-2 rounded-xl bg-apple-blue px-4 py-3 text-center text-[15px] font-medium text-white"
        >
          咨询选型
        </Link>
      </nav>
    </div>
  );
}
