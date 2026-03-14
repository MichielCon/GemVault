"use client";

import { useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import type { ReactNode, MouseEvent } from "react";

interface MagicCardProps {
  children: ReactNode;
  className?: string;
  gradientSize?: number;
  gradientColor?: string;
  gradientOpacity?: number;
}

export function MagicCard({
  children,
  className,
  gradientSize = 200,
  gradientColor = "#7c3aed",
  gradientOpacity = 0.08,
}: MagicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty("--mouse-x", `-${gradientSize}px`);
    cardRef.current.style.setProperty("--mouse-y", `-${gradientSize}px`);
  }, [gradientSize]);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("group relative overflow-hidden", className)}
      style={
        {
          "--gradient-size": `${gradientSize}px`,
          "--gradient-color": gradientColor,
          "--gradient-opacity": gradientOpacity,
          "--mouse-x": `-${gradientSize}px`,
          "--mouse-y": `-${gradientSize}px`,
        } as React.CSSProperties
      }
    >
      {/* Gradient overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        style={{
          background: `radial-gradient(var(--gradient-size) circle at var(--mouse-x) var(--mouse-y), ${gradientColor}${Math.round(gradientOpacity * 255).toString(16).padStart(2, "0")}, transparent 70%)`,
        }}
      />
      {children}
    </div>
  );
}
