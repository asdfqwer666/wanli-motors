import { CircleCheck, CircleMinus, Coins, Sparkles } from "lucide-react";
import type { TruckDecisionProfile } from "@/types/model";

interface DecisionCardProps {
  decision: TruckDecisionProfile;
}

export default function DecisionCard({ decision }: DecisionCardProps) {
  return (
    <section className="overflow-hidden rounded-4xl border border-apple-border bg-apple-card shadow-appleCard">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-apple-border px-6 py-4 md:px-8">
        <h2 className="text-base font-semibold md:text-lg">3 秒决策卡 · 这辆车适合我吗？</h2>
        <span className="inline-flex items-center gap-2 rounded-full bg-apple-pill px-3 py-1 text-xs font-medium text-neutral-600">
          推荐指数
          <span className="font-semibold text-apple-text">{decision.recommendScore}</span>
          <span className="h-1.5 w-20 overflow-hidden rounded-full bg-neutral-200">
            <span
              className="block h-full rounded-full bg-apple-blue"
              style={{ width: `${decision.recommendScore}%` }}
            />
          </span>
        </span>
      </div>

      <div className="grid gap-px bg-apple-border md:grid-cols-2">
        <div className="bg-apple-card p-6 md:p-7">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-apple-green">
            <CircleCheck size={16} />
            最适合谁
          </p>
          <p className="mt-2.5 text-sm leading-relaxed text-neutral-700">{decision.targetUser}</p>
        </div>
        <div className="bg-apple-card p-6 md:p-7">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-orange-500">
            <CircleMinus size={16} />
            什么情况不建议
          </p>
          <p className="mt-2.5 text-sm leading-relaxed text-neutral-700">{decision.boundaryCondition}</p>
        </div>
        <div className="bg-apple-card p-6 md:p-7">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-apple-blue">
            <Coins size={16} />
            回本与成本测算
          </p>
          <p className="mt-2.5 text-sm leading-relaxed text-neutral-700">{decision.paybackEstimate}</p>
          <p className="mt-2 text-[11px] text-apple-subtext">以上为估算参考，实际以运营路况、油气电价与货量为准，可用下方测算器自行调整。</p>
        </div>
        <div className="bg-apple-card p-6 md:p-7">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-apple-text">
            <Sparkles size={16} />
            核心亮点
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {decision.killerFeatures.map((f) => (
              <span
                key={f}
                className="rounded-full border border-neutral-200/60 bg-apple-pill px-3 py-1 text-xs font-medium text-neutral-700"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
