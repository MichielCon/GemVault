"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { BorderBeam } from "@/components/magicui/border-beam";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay },
  }),
};

function DashboardMockup() {
  return (
    <div className="relative rounded-2xl border border-zinc-200 shadow-2xl overflow-hidden w-full max-w-[580px]">
      <BorderBeam size={300} duration={12} />
      <div className="flex h-[340px]">
        {/* Sidebar */}
        <div className="w-[140px] shrink-0 bg-zinc-950 flex flex-col p-3 gap-1">
          <div className="flex items-center gap-1.5 px-2 py-2 mb-2">
            <div className="w-3 h-3 rounded-sm bg-violet-500" />
            <span className="text-white text-xs font-semibold tracking-tight">GemVault</span>
          </div>
          {["Dashboard", "Gems", "Parcels", "Origins", "Orders", "Sales"].map((item, i) => (
            <div
              key={item}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-xs ${
                i === 0
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400"
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? "bg-violet-500" : "bg-zinc-600"}`} />
              {item}
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 bg-[#fafaf8] p-4 flex flex-col gap-3">
          {/* KPI row */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Total Gems", value: "248", color: "text-violet-600" },
              { label: "Revenue", value: "$12.4k", color: "text-emerald-600" },
              { label: "Profit", value: "$4.2k", color: "text-blue-600" },
            ].map((kpi) => (
              <div
                key={kpi.label}
                className="bg-white rounded-lg border border-zinc-200/80 p-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
              >
                <div className="text-[9px] text-zinc-400 uppercase tracking-wide font-medium mb-0.5">
                  {kpi.label}
                </div>
                <div className={`text-sm font-bold ${kpi.color}`}>{kpi.value}</div>
              </div>
            ))}
          </div>

          {/* Chart placeholder */}
          <div className="flex-1 bg-white rounded-lg border border-zinc-200/80 p-3 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <div className="text-[9px] text-zinc-400 uppercase tracking-wide font-medium mb-2">
              Revenue this year
            </div>
            <div className="flex items-end gap-1 h-[80px]">
              {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm"
                  style={{
                    height: `${h}%`,
                    background:
                      i === 11
                        ? "rgb(124 58 237)"
                        : `rgba(124, 58, 237, ${0.15 + i * 0.04})`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Recent gems row */}
          <div className="bg-white rounded-lg border border-zinc-200/80 p-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <div className="text-[9px] text-zinc-400 uppercase tracking-wide font-medium mb-1.5">
              Recent gems
            </div>
            <div className="flex flex-col gap-1">
              {[
                { name: "Burma Ruby 3.2ct", tag: "Corundum", dot: "bg-red-400" },
                { name: "Ceylon Sapphire", tag: "Corundum", dot: "bg-blue-400" },
              ].map((gem) => (
                <div key={gem.name} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${gem.dot}`} />
                  <span className="text-[10px] text-zinc-700 flex-1">{gem.name}</span>
                  <span className="text-[9px] text-zinc-400">{gem.tag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background */}
      <DotPattern className="fill-violet-200/25" width={20} height={20} />
      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-violet-400/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-600/8 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6 py-20 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Text side */}
          <div className="flex-1 text-center lg:text-left max-w-xl">
            <motion.div
              initial="hidden"
              animate="visible"
              custom={0}
              variants={fadeUp}
              className="inline-flex mb-5"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/60 bg-violet-50/80 px-4 py-1.5">
                <AnimatedGradientText className="text-sm font-medium">
                  ✦ Gemstone Inventory Management
                </AnimatedGradientText>
              </div>
            </motion.div>

            <motion.h1
              initial="hidden"
              animate="visible"
              custom={0.1}
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-zinc-900 mb-5"
            >
              Your collection,{" "}
              <span className="text-violet-600">finally organized.</span>
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="visible"
              custom={0.2}
              variants={fadeUp}
              className="text-lg text-zinc-500 leading-relaxed mb-8"
            >
              Track every gem from acquisition to sale. Photo galleries, provenance
              maps, purchase orders, and certificates — all in one place for collectors
              and dealers alike.
            </motion.p>

            <motion.div
              initial="hidden"
              animate="visible"
              custom={0.3}
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
            >
              <Link href="/auth/register">
                <ShimmerButton className="h-11 px-7 text-sm font-medium rounded-lg">
                  Start for free
                </ShimmerButton>
              </Link>
              <Button variant="ghost" size="lg" asChild className="text-zinc-600">
                <Link href="/auth/login">Sign in →</Link>
              </Button>
            </motion.div>

            <motion.p
              initial="hidden"
              animate="visible"
              custom={0.4}
              variants={fadeUp}
              className="mt-4 text-xs text-zinc-400"
            >
              No credit card required · Free tier includes 50 gems
            </motion.p>
          </div>

          {/* Mockup side */}
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
            className="flex-1 flex justify-center lg:justify-end w-full"
          >
            <DashboardMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
