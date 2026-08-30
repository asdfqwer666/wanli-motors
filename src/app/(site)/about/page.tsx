import type { Metadata } from "next";
import { Building2, Clock, MapPin, Warehouse } from "lucide-react";
import { companyInfo } from "@/data/company-info";
import StoreGallery from "@/components/home/StoreGallery";
import NavigationSheet from "@/components/common/NavigationSheet";

export const metadata: Metadata = {
  title: "门店与企业形象",
  description: "阜阳市万里汽车销售服务有限公司 —— 位于颍东区的欧曼/乘龙授权展厅、标准化停放区与交付服务。"
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-28 pt-32">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">门店与企业形象</h1>
        <p className="mt-4 leading-relaxed text-apple-subtext">
          {companyInfo.name}（简称“{companyInfo.shortName}”）扎根 {companyInfo.serviceRegion}
          ，是欧曼与乘龙两大商用车品牌的授权经销服务商，面向物流公司与个体车主提供整车销售、新能源重卡推广、车队选型定制、分期金融咨询与售后维保服务。
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-apple-border bg-apple-card p-6 shadow-appleCard">
          <h2 className="flex items-center gap-2 text-base font-semibold">
            <Building2 size={17} className="text-apple-blue" />
            企业档案
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-6">
              <dt className="text-apple-subtext">企业全称</dt>
              <dd className="text-right font-medium">{companyInfo.name}</dd>
            </div>
            <div className="flex justify-between gap-6">
              <dt className="text-apple-subtext">服务区域</dt>
              <dd className="text-right font-medium">{companyInfo.serviceRegion}</dd>
            </div>
            <div className="flex justify-between gap-6">
              <dt className="text-apple-subtext">授权品牌</dt>
              <dd className="text-right font-medium">{companyInfo.authorizedBrands.join("、")}</dd>
            </div>
            <div className="flex justify-between gap-6">
              <dt className="text-apple-subtext">营业时间</dt>
              <dd className="text-right font-medium">{companyInfo.businessHours}</dd>
            </div>
          </dl>
          <div className="mt-5 border-t border-apple-border pt-4">
            <p className="text-xs font-medium text-apple-subtext">经营范围</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {companyInfo.businessScope.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-neutral-200/60 bg-neutral-100 px-2.5 py-1 text-xs text-neutral-600"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-apple-border bg-apple-card p-6 shadow-appleCard">
            <h2 className="flex items-center gap-2 text-base font-semibold">
              <MapPin size={17} className="text-apple-blue" />
              公司主展厅
            </h2>
            <p className="mt-3 text-sm leading-relaxed">{companyInfo.primaryAddress}</p>
            <div className="mt-4">
              <NavigationSheet label="一键导航到展厅" variant="primary" className="w-full py-2.5" />
            </div>
          </div>

          <div className="rounded-3xl border border-apple-border bg-apple-card p-6 shadow-appleCard">
            <h2 className="flex items-center gap-2 text-base font-semibold">
              <Warehouse size={17} className="text-apple-blue" />
              售后与停放区域
            </h2>
            <p className="mt-3 text-sm leading-relaxed">{companyInfo.storeSceneAddress}</p>
            <p className="mt-3 flex items-center gap-2 text-xs text-apple-subtext">
              <Clock size={13} />
              营业时间：{companyInfo.businessHours}
            </p>
          </div>

          <div className="rounded-3xl bg-apple-bg p-6">
            <h2 className="text-sm font-semibold">到店路线提示</h2>
            <p className="mt-2 text-sm leading-relaxed text-apple-subtext">
              使用导航搜索“{companyInfo.name}”或上述地址即可抵达展厅；售后与车辆停放区域位于袁寨镇朝阳大道，到店前建议先与顾问电话确认车辆位置。
            </p>
          </div>
        </div>
      </div>

      <StoreGallery />
    </div>
  );
}
