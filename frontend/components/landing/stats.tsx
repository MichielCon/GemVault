"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { NumberTicker } from "@/components/magicui/number-ticker";

const stats = [
  { value: 29, suffix: "+", label: "Gem species supported" },
  { value: 75, suffix: "+", label: "Variety types" },
  { value: 12, suffix: "", label: "Gemological fields tracked" },
  { value: 100, suffix: "+", label: "Countries mapped" },
];

export function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="py-16 bg-white border-y border-zinc-100">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center text-center"
            >
              <div className="flex items-baseline gap-0.5 mb-1">
                {isInView && (
                  <NumberTicker
                    value={stat.value}
                    className="text-4xl font-bold text-zinc-900"
                    delay={i * 0.1}
                  />
                )}
                <span className="text-3xl font-bold text-violet-600">{stat.suffix}</span>
              </div>
              <p className="text-sm text-zinc-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
