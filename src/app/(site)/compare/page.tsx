import type { Metadata } from "next";
import { models } from "@/data/models";
import CompareWorkbench from "@/components/models/CompareWorkbench";

export const metadata: Metadata = {
  title: "车型对比",
  description: "同时对比 2-4 款欧曼 / 乘龙车型的品牌、动力、驱动与适用场景，未确认参数如实标注。"
};

interface ComparePageProps {
  searchParams?: { ids?: string | string[] };
}

export default function ComparePage({ searchParams }: ComparePageProps) {
  const raw = Array.isArray(searchParams?.ids) ? searchParams?.ids?.[0] : searchParams?.ids;
  const validIds = (raw ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((id) => models.some((m) => m.slug === id))
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl px-6 pb-28 pt-32">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">车型横向对比工作台</h1>
        <p className="mt-3 text-apple-subtext">
          从车型中心勾选加入对比，或在本页直接点选；对比结果聚焦已确认的真实参数。
        </p>
      </div>
      <CompareWorkbench allModels={models} initialIds={validIds} />
    </div>
  );
}
