"use client";

import { cn } from "@/lib/utils";
import type { ReactNode, ButtonHTMLAttributes } from "react";

interface ShimmerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
}

export function ShimmerButton({
  children,
  shimmerColor = "#ffffff",
  shimmerSize = "0.1em",
  shimmerDuration = "3s",
  borderRadius = "0.625rem",
  background = "rgba(9, 9, 11, 1)",
  className,
  ...props
}: ShimmerButtonProps) {
  return (
    <button
      className={cn(
        "group relative z-0 flex cursor-pointer items-center justify-center gap-2 overflow-hidden whitespace-nowrap border border-white/10 px-6 py-2.5 text-white [background:var(--bg)] [border-radius:var(--radius)] transition-shadow duration-300 ease-in-out hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] active:scale-[0.98]",
        className
      )}
      style={
        {
          "--bg": background,
          "--radius": borderRadius,
          "--shimmer-color": shimmerColor,
          "--speed": shimmerDuration,
          "--cut": shimmerSize,
        } as React.CSSProperties
      }
      {...props}
    >
      {/* Shimmer layer */}
      <div
        className="absolute inset-0 z-[-1] animate-[shimmer_var(--speed)_infinite] overflow-visible [background-size:200%_100%]"
        style={{
          background: `linear-gradient(120deg, transparent 30%, ${shimmerColor}20 50%, transparent 70%)`,
          backgroundSize: "200% 100%",
          animation: `shimmer ${shimmerDuration} infinite`,
        }}
      />
      {/* Content */}
      <span className="relative z-10 font-medium text-sm">{children}</span>
    </button>
  );
}
