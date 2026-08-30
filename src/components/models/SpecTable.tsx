import type { TruckModel } from "@/types/model";

interface SpecTableProps {
  model: TruckModel;
}

const UNKNOWN = "— 咨询门店";

export default function SpecTable({ model }: SpecTableProps) {
  const rows: { label: string; value: string }[] = [
    { label: "品牌系列", value: model.brandFull },
    { label: "车型类别", value: model.categoryLabel },
    { label: "能源类型", value: model.energyLabel },
    { label: "驱动形式", value: model.drive },
    { label: "马力 / 功率", value: model.power.display },
    { label: "推荐运输工况", value: model.scenario },
    { label: "发动机型号", value: model.specs.engineModel ?? UNKNOWN },
    { label: "变速箱档位", value: model.specs.gearbox ?? UNKNOWN },
    { label: "后桥速比", value: model.specs.axleRatio ?? UNKNOWN },
    { label: "整车尺寸", value: model.specs.dimensions ?? UNKNOWN },
    { label: "整备质量", value: model.specs.curbWeight ?? UNKNOWN }
  ];

  return (
    <div className="overflow-hidden rounded-3xl border border-apple-border bg-apple-card shadow-appleCard">
      <div className="border-b border-apple-border px-6 py-4">
        <h3 className="text-base font-semibold">技术规格</h3>
        <p className="mt-1 text-xs text-apple-subtext">
          仅展示经确认的信息；标注“咨询门店”的参数请以门店核实结果为准。
        </p>
      </div>
      <dl className="divide-y divide-apple-border">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-6 px-6 py-3.5">
            <dt className="text-sm text-apple-subtext">{row.label}</dt>
            <dd
              className={
                row.value === UNKNOWN
                  ? "text-right text-sm text-apple-subtext"
                  : "text-right text-sm font-medium"
              }
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
