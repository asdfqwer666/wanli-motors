"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Phone, Sparkles, X } from "lucide-react";
import { matcherQuestions, recommendTrucks, type MatchResult } from "@/lib/truck-matcher";
import { salesConsultants } from "@/data/sales-consultants";
import { cn } from "@/lib/utils";

const OPEN_EVENT = "open-truck-matcher";

export function openTruckMatcher() {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT));
}

export default function TruckMatcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const hidden = pathname.startsWith("/compare");

  useEffect(() => {
    const handler = () => {
      setStep(0);
      setAnswers({});
      setOpen(true);
    };
    window.addEventListener(OPEN_EVENT, handler);
    return () => window.removeEventListener(OPEN_EVENT, handler);
  }, []);

  if (hidden) return null;

  const question = matcherQuestions[step];
  const allAnswered = matcherQuestions.every((q) => answers[q.key]);
  const results: MatchResult[] =
    allAnswered
      ? recommendTrucks(answers.scenario ?? "", answers.distance ?? "", answers.energy ?? "").results
      : [];
  const note =
    allAnswered
      ? recommendTrucks(answers.scenario ?? "", answers.distance ?? "", answers.energy ?? "").note
      : null;
  const topConsultant = salesConsultants[0];

  const pick = (value: string) => {
    setAnswers((prev) => ({ ...prev, [question.key]: value }));
    if (step < matcherQuestions.length) {
      setTimeout(() => setStep((s) => s + 1), 180);
    }
  };

  return (
    <>
      <motion.button
        type="button"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: "spring", damping: 18 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-apple-blue px-5 py-3 text-sm font-medium text-white shadow-appleHover transition-colors hover:bg-apple-blueHover"
      >
        <Sparkles size={16} />
        智能帮我选车
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[70] flex items-end justify-center bg-black/30 backdrop-blur-sm sm:items-center"
          >
            <motion.div
              initial={{ y: 56, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 56, opacity: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[86vh] w-full max-w-lg overflow-y-auto rounded-t-4xl border border-white/60 bg-white/95 p-6 shadow-dropdownMenu backdrop-blur-2xl sm:rounded-4xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {matcherQuestions.map((q, i) => (
                    <span
                      key={q.key}
                      className={cn(
                        "h-1.5 rounded-full transition-all",
                        i < step ? "w-6 bg-apple-green" : i === step ? "w-10 bg-apple-blue" : "w-6 bg-neutral-200"
                      )}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  aria-label="关闭"
                  onClick={() => setOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-apple-pill text-apple-subtext transition-colors hover:bg-apple-hover"
                >
                  <X size={15} />
                </button>
              </div>

              {step < matcherQuestions.length ? (
                <div className="mt-6">
                  <p className="text-xs font-medium text-apple-blue">第 {step + 1} / 3 步</p>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight">{question.title}</h3>
                  <div className="mt-5 space-y-3">
                    {question.options.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => pick(opt.id)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-left text-sm font-medium transition-all",
                          answers[question.key] === opt.id
                            ? "border-apple-blue bg-apple-blue/5 text-apple-text"
                            : "border-apple-border bg-white text-neutral-700 hover:border-apple-blue/50 hover:bg-apple-bg"
                        )}
                      >
                        {opt.label}
                        <ArrowRight size={15} className="shrink-0 text-apple-subtext" />
                      </button>
                    ))}
                  </div>
                  {step > 0 && (
                    <button
                      type="button"
                      onClick={() => setStep((s) => s - 1)}
                      className="mt-4 inline-flex items-center gap-1 text-xs text-apple-subtext transition-colors hover:text-apple-text"
                    >
                      <ArrowLeft size={12} />
                      上一步
                    </button>
                  )}
                </div>
              ) : (
                <div className="mt-6">
                  <p className="text-xs font-medium text-apple-green">匹配完成</p>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight">为您推荐以下车型</h3>
                  {note ? (
                    <p className="mt-2 rounded-xl bg-amber-50 px-3.5 py-2.5 text-xs leading-relaxed text-amber-700">{note}</p>
                  ) : null}

                  <div className="mt-4 space-y-3">
                    {results.map(({ model, reason }) => (
                      <div
                        key={model.slug}
                        className="rounded-2xl border border-apple-border bg-apple-bg p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold">{model.name}</p>
                          <span className="shrink-0 rounded-full bg-apple-pill px-2 py-0.5 text-[10px] font-medium text-neutral-600">
                            推荐 {model.decision.recommendScore} 分
                          </span>
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-apple-subtext">{reason}</p>
                        <p className="mt-1.5 text-xs text-apple-subtext">
                          {model.power.display} · {model.drive} · {model.energyShort}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                    {results[0] && (
                      <button
                        type="button"
                        onClick={() => {
                          setOpen(false);
                          router.push(`/models/${results[0].model.slug}`);
                        }}
                        className="rounded-full bg-apple-blue py-2.5 text-sm font-medium text-white transition-colors hover:bg-apple-blueHover"
                      >
                        查看推荐车型
                      </button>
                    )}
                    {results.length >= 2 && (
                      <button
                        type="button"
                        onClick={() => {
                          setOpen(false);
                          router.push(`/compare?ids=${results.map((r) => r.model.slug).join(",")}`);
                        }}
                        className="rounded-full border border-apple-border bg-white py-2.5 text-sm font-medium text-apple-text transition-colors hover:bg-apple-hover"
                      >
                        两款横向对比
                      </button>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between rounded-2xl bg-apple-bg px-4 py-3">
                    <p className="text-xs text-apple-subtext">
                      想要底价？直接联系 <span className="font-medium text-apple-text">{topConsultant.name}</span>（{topConsultant.badge}）
                    </p>
                    <a
                      href={`tel:${topConsultant.phone}`}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-apple-text px-4 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90"
                    >
                      <Phone size={12} />
                      一键拨打
                    </a>
                  </div>

                  <Link
                    href="/models"
                    onClick={() => setOpen(false)}
                    className="mt-4 block text-center text-xs text-apple-subtext underline-offset-2 hover:text-apple-text hover:underline"
                  >
                    或浏览全部 12 款车型 →
                  </Link>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
