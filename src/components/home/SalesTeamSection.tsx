"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { salesConsultants } from "@/data/sales-consultants";
import type { SalesConsultant } from "@/types/sales";
import PhoneCallButton from "@/components/common/PhoneCallButton";

export function ConsultantCard({ consultant }: { consultant: SalesConsultant }) {
  const [copied, setCopied] = useState(false);

  const copyPhone = async () => {
    try {
      await navigator.clipboard.writeText(consultant.phone);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = consultant.phone;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="relative flex flex-col items-center rounded-3xl border border-apple-border bg-apple-card p-6 text-center shadow-appleCard transition-shadow hover:shadow-appleHover">
      <span className="absolute right-4 top-4 rounded-full bg-apple-pill px-2 py-0.5 text-[10px] font-medium text-neutral-600">
        {consultant.badge}
      </span>
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-apple-text text-xl font-semibold text-white">
        {consultant.avatarPlaceholderText}
      </span>
      <h3 className="mt-4 text-base font-semibold">{consultant.name}</h3>
      <p className="mt-0.5 text-xs text-apple-subtext">{consultant.role}</p>
      <button
        type="button"
        onClick={copyPhone}
        title="点击复制电话号码"
        className="mt-3 inline-flex items-center gap-1.5 text-xl font-semibold tracking-tight tabular-nums transition-colors hover:text-apple-blue"
      >
        {consultant.displayPhone}
        {copied ? <Check size={14} className="text-apple-green" /> : <Copy size={13} className="text-apple-subtext" />}
      </button>
      <PhoneCallButton
        phone={consultant.phone}
        displayPhone={consultant.displayPhone}
        label="一键直拨"
        className="mt-4 w-full"
      />
      <div className="mt-4 flex flex-wrap justify-center gap-1.5">
        {consultant.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-neutral-200/60 bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-600"
          >
            {tag}
          </span>
        ))}
      </div>

      {copied && (
        <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 rounded-full bg-apple-text px-4 py-1.5 text-xs font-medium text-white shadow-lg">
          已复制顾问电话，欢迎随时垂询
        </div>
      )}
    </article>
  );
}

export default function SalesTeamSection() {
  return (
    <section id="consultants" className="mx-auto max-w-6xl scroll-mt-28 px-6 py-24">
      <div className="text-center">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">专属销售顾问团队</h2>
        <p className="mt-3 text-apple-subtext">四位资深顾问 · 一对一选型建议 · 点击号码可复制，按钮一键直拨</p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {salesConsultants.map((consultant) => (
          <ConsultantCard key={consultant.id} consultant={consultant} />
        ))}
      </div>
    </section>
  );
}
