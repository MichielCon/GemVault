import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface AnimatedGradientTextProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedGradientText({ children, className }: AnimatedGradientTextProps) {
  return (
    <span
      className={cn(
        "inline-block animate-[shimmer_8s_infinite] bg-gradient-to-r from-violet-600 via-violet-400 to-violet-600 bg-[length:200%_auto] bg-clip-text text-transparent",
        className
      )}
    >
      {children}
    </span>
  );
}
