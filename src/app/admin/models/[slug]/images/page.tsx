import { notFound } from "next/navigation";
import { getModelBySlug } from "@/data/models";
import { getMediaFor } from "@/lib/model-media";
import { requireAdmin } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";
import ImageWorkbench from "@/components/admin/ImageWorkbench";

export const metadata = {
  title: "车型媒体工作台",
  robots: { index: false, follow: false }
};

export const dynamic = "force-dynamic";

interface AdminModelImagesPageProps {
  params: { slug: string };
}

export default function AdminModelImagesPage({ params }: AdminModelImagesPageProps) {
  requireAdmin();

  const model = getModelBySlug(params.slug);
  if (!model) notFound();

  const media = getMediaFor(model.slug);

  return (
    <AdminShell
      title={`媒体工作台 · ${model.name}`}
      description="左栏为系统只读演示资产，右栏管理门店现车实拍图（上传即自动转码、去除 EXIF 并存储为 WebP）。"
    >
      <ImageWorkbench
        slug={model.slug}
        name={model.name}
        demoImages={media.demoImages}
        actualImages={media.actualImages}
      />
    </AdminShell>
  );
}
