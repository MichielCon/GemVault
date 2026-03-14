"use client";

import { cn } from "@/lib/utils";

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
}

export function BorderBeam({
  className,
  size = 200,
  duration = 15,
  delay = 0,
  colorFrom = "#7c3aed",
  colorTo = "#a78bfa",
}: BorderBeamProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] [border:1px_solid_transparent]",
        "[mask-clip:padding-box,border-box] [mask-composite:intersect]",
        "[mask-image:linear-gradient(transparent,transparent),linear-gradient(white,white)]",
        "after:absolute after:aspect-square after:animate-[border-beam_var(--duration)_infinite_linear] after:[offset-path:rect(0_auto_auto_0_round_var(--radius-lg))]",
        "after:[background:conic-gradient(from_180deg,transparent,var(--color-from),var(--color-to),transparent)]",
        "after:[animation-delay:var(--delay)]",
        className
      )}
      style={
        {
          "--size": size,
          "--duration": `${duration}s`,
          "--delay": `${delay}s`,
          "--color-from": colorFrom,
          "--color-to": colorTo,
        } as React.CSSProperties
      }
    />
  );
}
