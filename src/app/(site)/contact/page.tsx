import type { Metadata } from "next";
import { Clock, MapPin, Navigation } from "lucide-react";
import { companyInfo } from "@/data/company-info";
import { salesConsultants } from "@/data/sales-consultants";
import { ConsultantCard } from "@/components/home/SalesTeamSection";
import NavigationSheet from "@/components/common/NavigationSheet";

export const metadata: Metadata = {
  title: "联系我们",
  description: "阜阳市万里汽车销售服务有限公司联系方式：颍东区展厅地址、营业时间与 4 位销售顾问直线电话。"
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-28 pt-32">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">联系我们</h1>
        <p className="mt-4 leading-relaxed text-apple-subtext">
          欢迎到店咨询或直接致电销售顾问；购车、分期、置换与售后问题均可一对一沟通。
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-apple-border bg-apple-card p-6 shadow-appleCard md:col-span-2">
          <h2 className="flex items-center gap-2 text-base font-semibold">
            <MapPin size={17} className="text-apple-blue" />
            公司统一登记信息
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-apple-subtext">展厅地址</dt>
              <dd className="mt-1 font-medium">{companyInfo.primaryAddress}</dd>
            </div>
            <div>
              <dt className="text-apple-subtext">售后/停放区域</dt>
              <dd className="mt-1 font-medium">{companyInfo.storeSceneAddress}</dd>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-apple-subtext" />
              <dd className="font-medium">营业时间：{companyInfo.businessHours}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-3xl bg-apple-text p-6 text-white shadow-appleCard">
          <h2 className="flex items-center gap-2 text-base font-semibold">
            <Navigation size={17} />
            地图导航
          </h2>
          <p className="mt-3 text-sm text-white/70">一键调起高德、百度、腾讯或 Apple 地图，直达颍东展厅。</p>
          <div className="mt-4">
            <NavigationSheet
              label="选择地图导航"
              variant="light"
              className="w-full py-2.5"
            />
          </div>
        </div>
      </div>

      <section id="consultants" className="mt-16 scroll-mt-28">
        <h2 className="text-2xl font-semibold tracking-tight">销售顾问名录</h2>
        <p className="mt-3 text-apple-subtext">四位顾问直线电话，点击卡片按钮即可一键拨打（手机端生效）。</p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {salesConsultants.map((consultant) => (
            <ConsultantCard key={consultant.id} consultant={consultant} />
          ))}
        </div>
      </section>
    </div>
  );
}
