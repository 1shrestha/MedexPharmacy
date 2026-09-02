import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function Badge({
  children,
  className,
  variant = "default",
}: {
  children: ReactNode;
  className?: string;
  variant?: "default" | "pink" | "warning" | "danger" | "success" | "outline";
}) {
  const variants = {
    default: "bg-medex-pista text-medex-primary-dark",
    pink: "bg-medex-pink text-medex-pink-dark",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-700",
    success: "bg-green-100 text-green-700",
    outline: "border border-medex-border text-gray-600",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
