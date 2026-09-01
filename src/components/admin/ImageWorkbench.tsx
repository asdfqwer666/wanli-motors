"use client";

import { useState } from "react";
import type { ModelImage } from "@/types/media";
import DemoArchiveViewer from "@/components/admin/DemoArchiveViewer";
import ActualImageUploader from "@/components/admin/ActualImageUploader";

interface ImageWorkbenchProps {
  slug: string;
  name: string;
  demoImages: ModelImage[];
  actualImages: ModelImage[];
  useBlob: boolean;
}

export default function ImageWorkbench({ slug, name, demoImages, actualImages, useBlob }: ImageWorkbenchProps) {
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      {error ? (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-3.5 text-sm leading-relaxed text-red-600">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <DemoArchiveViewer demoImages={demoImages} />
        <ActualImageUploader slug={slug} actualImages={actualImages} useBlob={useBlob} onError={setError} />
      </div>

      <p className="mt-6 text-xs leading-relaxed text-apple-subtext">
        {name}：当该车型的全部实拍图被删除后，前台将自动无缝回退至系统演示图，并重新激活“车型演示图”免责声明。
      </p>
    </div>
  );
}
