import { Info } from "lucide-react";
import { DEMO_DISCLAIMER_TEXT } from "@/lib/demo-text";
import { cn } from "@/lib/utils";

interface DisclaimerBadgeProps {
  text?: string;
  className?: string;
}

export default function DisclaimerBadge({ text = DEMO_DISCLAIMER_TEXT, className }: DisclaimerBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-neutral-200/60 bg-white/85 px-2.5 py-1 text-[11px] leading-snug text-neutral-500 backdrop-blur-sm",
        className
      )}
    >
      <Info size={12} className="shrink-0" />
      <span>{text}</span>
    </span>
  );
}
