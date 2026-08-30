"use client";

import { Lock } from "lucide-react";
import type { ModelImage } from "@/types/media";
import ImageFallback from "@/components/common/ImageFallback";

interface DemoArchiveViewerProps {
  demoImages: ModelImage[];
}

export default function DemoArchiveViewer({ demoImages }: DemoArchiveViewerProps) {
  return (
    <section className="rounded-3xl border border-apple-border bg-apple-card p-6 shadow-appleCard">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">Demo Archive</h2>
          <p className="mt-0.5 text-xs text-apple-subtext">系统内置演示资产 · 只读</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200/60 bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-600">
          <Lock size={11} />
          只读锁定
        </span>
      </header>

      <ul className="mt-5 space-y-4">
        {demoImages.map((img) => (
          <li key={img.id} className="rounded-2xl border border-apple-border bg-apple-bg p-3">
            <div className="flex gap-3">
              <div className="h-20 w-32 shrink-0 overflow-hidden rounded-xl bg-gradient-to-b from-[#F5F5F7] to-[#ECECED]">
                <ImageFallback src={img.src} alt={img.alt} className="h-full w-full object-contain" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="rounded-full bg-apple-text px-2 py-0.5 text-[10px] font-medium text-white">
                    matchLevel: {img.matchLevel}
                  </span>
                  <span className="rounded-full border border-neutral-200/60 bg-white px-2 py-0.5 text-[10px] text-neutral-500">
                    kind: {img.kind}
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-[10px] text-apple-subtext">
                    <Lock size={9} />
                    禁止删除 / 禁止提升为实拍
                  </span>
                </div>
                <p className="mt-2 truncate font-mono text-[11px] text-apple-subtext">
                  sourceId: {img.sourceId ?? img.id}
                </p>
                <p className="mt-1 truncate text-xs text-apple-subtext">{img.alt}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-xs leading-relaxed text-apple-subtext">
        内置演示图仅表达车型类别，不代表实车外观；该资产不可被后台操作修改或删除，用于在实拍缺失时兜底展示。
      </p>
    </section>
  );
}
