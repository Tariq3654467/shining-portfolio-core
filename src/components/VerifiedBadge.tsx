import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type VerifiedBadgeProps = {
  verified: boolean;
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md";
};

export function VerifiedBadge({ verified, className, showLabel = true, size = "sm" }: VerifiedBadgeProps) {
  if (!verified) return null;

  const iconClass = size === "md" ? "h-6 w-6" : "h-4 w-4";
  const textClass = size === "md" ? "text-xs" : "text-[10px]";

  if (!showLabel) {
    return (
      <CheckCircle2
        className={cn(iconClass, "text-green-600 fill-green-500/10 shrink-0", className)}
        aria-label="Verified member"
      />
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-500/10 text-green-700 font-bold uppercase tracking-wider",
        textClass,
        className
      )}
    >
      <CheckCircle2 className={cn(iconClass, "shrink-0")} aria-hidden />
      Verified
    </span>
  );
}
