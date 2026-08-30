"use client";

import { useRef, useState } from "react";
import { ArrowDown, ArrowUp, Loader2, Star, Trash2, Upload } from "lucide-react";
import type { ModelImage } from "@/types/media";
import ImageFallback from "@/components/common/ImageFallback";
import { cn } from "@/lib/utils";

interface ActualImageUploaderProps {
  slug: string;
  actualImages: ModelImage[];
  onError: (message: string | null) => void;
}

export default function ActualImageUploader({ slug, actualImages, onError }: ActualImageUploaderProps) {
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const sorted = [...actualImages].sort((a, b) => a.sortOrder - b.sortOrder);

  const request = async (init: RequestInit): Promise<boolean> => {
    setBusy(true);
    onError(null);
    try {
      const res = await fetch(`/api/admin/models/${slug}/images`, init);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        onError(data?.error ?? "操作失败，请重试。");
        return false;
      }
      window.location.reload();
      return true;
    } catch {
      onError("网络异常，请重试。");
      return false;
    } finally {
      setBusy(false);
    }
  };

  const uploadFiles = async (files: FileList | File[]) => {
    const list = Array.from(files).filter((f) => f.size > 0);
    if (list.length === 0) return;
    const fd = new FormData();
    list.forEach((f) => fd.append("files", f));
    await request({ method: "POST", body: fd });
  };

  const patch = (body: Record<string, unknown>) =>
    request({
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

  const remove = async (img: ModelImage) => {
    if (!window.confirm("确认删除这张实拍图？删除全部实拍后，前台将自动回退至系统演示图。")) return;
    await request({
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: img.id })
    });
  };

  const move = (index: number, dir: -1 | 1) => {
    const ids = sorted.map((i) => i.id);
    const target = index + dir;
    if (target < 0 || target >= ids.length) return;
    [ids[index], ids[target]] = [ids[target], ids[index]];
    patch({ order: ids });
  };

  return (
    <section className="rounded-3xl border border-apple-border bg-apple-card p-6 shadow-appleCard">
      <header>
        <h2 className="text-base font-semibold">Actual Vehicle Gallery</h2>
        <p className="mt-0.5 text-xs text-apple-subtext">门店现车实拍图库 · 可上传 / 排序 / 设封面 / 删除</p>
      </header>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (!busy) uploadFiles(e.dataTransfer.files);
        }}
        onClick={() => !busy && inputRef.current?.click()}
        className={cn(
          "mt-5 cursor-pointer rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors",
          dragOver ? "border-apple-blue bg-apple-blue/5" : "border-apple-border bg-apple-bg hover:bg-apple-hover",
          busy && "pointer-events-none opacity-60"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="hidden"
          onChange={(e) => {
            if (e.target.files) uploadFiles(e.target.files);
            e.target.value = "";
          }}
        />
        {busy ? (
          <span className="inline-flex items-center gap-2 text-sm text-apple-subtext">
            <Loader2 size={16} className="animate-spin" />
            正在处理上传…
          </span>
        ) : (
          <>
            <Upload size={22} className="mx-auto text-apple-subtext" strokeWidth={1.8} />
            <p className="mt-2 text-sm font-medium">拖拽实拍照片到此处，或点击选择文件</p>
            <p className="mt-1 text-xs text-apple-subtext">
              支持 JPEG / PNG / WebP / AVIF · 单张 ≤ 10MB · 单次 ≤ 10 张 · 自动校正方向并转码 WebP（去除 EXIF）
            </p>
          </>
        )}
      </div>

      {sorted.length === 0 ? (
        <p className="mt-5 rounded-2xl bg-apple-bg px-4 py-3 text-xs leading-relaxed text-apple-subtext">
          当前车型暂无实拍档案，前台正在使用系统演示图并展示免责声明。上传第一张实拍后，前台将自动切换为实拍图。
        </p>
      ) : (
        <ul className="mt-5 space-y-4">
          {sorted.map((img, index) => (
            <li key={img.id} className="rounded-2xl border border-apple-border bg-apple-bg p-3">
              <div className="flex gap-3">
                <div className="h-20 w-32 shrink-0 overflow-hidden rounded-xl bg-white">
                  <ImageFallback src={img.src} alt={img.alt} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {img.isCover ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-apple-blue px-2 py-0.5 text-[10px] font-medium text-white">
                        <Star size={9} />
                        当前封面
                      </span>
                    ) : null}
                    <span className="rounded-full border border-neutral-200/60 bg-white px-2 py-0.5 text-[10px] text-neutral-500">
                      {img.width && img.height ? `${img.width}×${img.height}` : "WebP"}
                    </span>
                  </div>
                  <input
                    type="text"
                    defaultValue={img.alt}
                    onBlur={(e) => {
                      const next = e.target.value.trim();
                      if (next && next !== img.alt) patch({ id: img.id, alt: next });
                    }}
                    placeholder="图片描述（失焦自动保存）"
                    className="mt-2 w-full rounded-lg border border-apple-border bg-white px-2.5 py-1.5 text-xs outline-none focus:border-apple-blue"
                  />
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {!img.isCover && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => patch({ id: img.id, isCover: true })}
                    className="inline-flex items-center gap-1 rounded-full bg-apple-blue px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-apple-blueHover disabled:opacity-50"
                  >
                    <Star size={11} />
                    设为封面
                  </button>
                )}
                <button
                  type="button"
                  disabled={busy || index === 0}
                  onClick={() => move(index, -1)}
                  aria-label="上移"
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-apple-border bg-white text-apple-subtext transition-colors hover:bg-apple-hover disabled:opacity-40"
                >
                  <ArrowUp size={12} />
                </button>
                <button
                  type="button"
                  disabled={busy || index === sorted.length - 1}
                  onClick={() => move(index, 1)}
                  aria-label="下移"
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-apple-border bg-white text-apple-subtext transition-colors hover:bg-apple-hover disabled:opacity-40"
                >
                  <ArrowDown size={12} />
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => remove(img)}
                  className="ml-auto inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
                >
                  <Trash2 size={11} />
                  删除
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
