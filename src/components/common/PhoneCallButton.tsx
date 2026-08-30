import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";

interface PhoneCallButtonProps {
  phone: string;
  displayPhone?: string;
  label?: string;
  variant?: "primary" | "ghost";
  className?: string;
}

export default function PhoneCallButton({
  phone,
  displayPhone,
  label,
  variant = "primary",
  className
}: PhoneCallButtonProps) {
  return (
    <a
      href={`tel:${phone}`}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors",
        variant === "primary"
          ? "bg-apple-blue text-white hover:bg-apple-blueHover"
          : "border border-apple-border bg-white text-apple-text hover:bg-apple-hover",
        className
      )}
    >
      <Phone size={14} />
      {label ?? (displayPhone ? `拨打 ${displayPhone}` : "立即拨打")}
    </a>
  );
}
