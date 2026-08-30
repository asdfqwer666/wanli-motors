import { CreditCard, FileCheck2, RefreshCcw, Wrench } from "lucide-react";

const capabilities = [
  {
    icon: CreditCard,
    title: "金融分期方案",
    desc: "联合金融机构提供多种分期方案咨询，缓解购车资金压力。"
  },
  {
    icon: RefreshCcw,
    title: "旧车置换评估",
    desc: "提供旧车置换评估服务，协助顺畅完成车辆更新换代。"
  },
  {
    icon: FileCheck2,
    title: "上牌营运协助",
    desc: "协助办理上牌与营运相关手续，缩短从购车到运营的周期。"
  },
  {
    icon: Wrench,
    title: "原厂配件保障",
    desc: "依托品牌售后体系提供原厂配件与维修保养服务支持。"
  }
];

export default function TrustSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="text-center">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">全生命周期服务能力</h2>
        <p className="mt-3 text-apple-subtext">从选型、金融到交付与售后，陪伴运营的每一个环节</p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {capabilities.map(({ icon: Icon, title, desc }) => (
          <article
            key={title}
            className="rounded-3xl border border-apple-border bg-apple-card p-6 shadow-appleCard transition-shadow hover:shadow-appleHover"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-apple-bg text-apple-blue">
              <Icon size={20} strokeWidth={1.8} />
            </span>
            <h3 className="mt-4 text-base font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-apple-subtext">{desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
