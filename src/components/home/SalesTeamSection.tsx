import { salesConsultants } from "@/data/sales-consultants";
import PhoneCallButton from "@/components/common/PhoneCallButton";

export function ConsultantCard({ consultant }: { consultant: (typeof salesConsultants)[number] }) {
  return (
    <article className="flex flex-col items-center rounded-3xl border border-apple-border bg-apple-card p-6 text-center shadow-appleCard transition-shadow hover:shadow-appleHover">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-apple-text text-xl font-semibold text-white">
        {consultant.avatarPlaceholderText}
      </span>
      <h3 className="mt-4 text-base font-semibold">{consultant.name}</h3>
      <p className="mt-0.5 text-xs text-apple-subtext">{consultant.role}</p>
      <p className="mt-3 text-xl font-semibold tracking-tight tabular-nums">{consultant.displayPhone}</p>
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
    </article>
  );
}

export default function SalesTeamSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="text-center">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">专属销售顾问团队</h2>
        <p className="mt-3 text-apple-subtext">四位资深顾问 · 一对一选型建议 · 点击即可直接拨号咨询</p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {salesConsultants.map((consultant) => (
          <ConsultantCard key={consultant.id} consultant={consultant} />
        ))}
      </div>
    </section>
  );
}
