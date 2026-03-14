import Sidebar from "@/components/dashboard/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-screen overflow-hidden" style={{ backgroundColor: "var(--background)" }}>
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -right-60 -top-60 h-[700px] w-[700px] rounded-full bg-violet-500/[0.055] blur-3xl" />
        <div className="absolute -bottom-40 left-40 h-[500px] w-[500px] rounded-full bg-indigo-400/[0.04] blur-3xl" />
      </div>
      <Sidebar />
      <main className="relative flex-1 overflow-y-auto overflow-x-hidden p-5">
        {children}
      </main>
    </div>
  );
}
