"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";

interface ImageFallbackProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ImageFallback({ src, alt, className }: ImageFallbackProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex h-full w-full flex-col items-center justify-center gap-2 text-apple-subtext ${className ?? ""}`}
        role="img"
        aria-label={alt}
      >
        <ImageOff size={28} strokeWidth={1.5} />
        <span className="text-xs">图像暂不可用</span>
      </div>
    );
  }

  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className={className} />;
}
