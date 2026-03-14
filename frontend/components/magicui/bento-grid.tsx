import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-3 sm:grid-cols-12",
        className
      )}
    >
      {children}
    </div>
  );
}

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  colSpan?: number;
  rowSpan?: number;
}

export function BentoCard({ children, className, colSpan, rowSpan }: BentoCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]",
        colSpan && `sm:col-span-${colSpan}`,
        rowSpan && `sm:row-span-${rowSpan}`,
        className
      )}
    >
      {children}
    </div>
  );
}
