import Sidebar from "@/components/dashboard/sidebar";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { EmailVerifyBanner } from "@/components/dashboard/email-verify-banner";
import { getEmailConfirmed } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const emailConfirmed = await getEmailConfirmed();

  return (
    <div className="gem-bg-pattern relative flex h-screen overflow-hidden" style={{ backgroundColor: "var(--background)" }}>
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -right-60 -top-60 h-[700px] w-[700px] rounded-full bg-violet-500/[0.055] blur-3xl" />
        <div className="absolute -bottom-40 left-40 h-[500px] w-[500px] rounded-full bg-indigo-400/[0.04] blur-3xl" />
      </div>
      {/* Desktop sidebar — hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      {/* Mobile nav — hidden on desktop */}
      <MobileNav sidebar={<Sidebar />} />
      <div className="relative flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {!emailConfirmed && <EmailVerifyBanner />}
        <main className="flex-1 h-full overflow-y-auto overflow-x-hidden p-5">
          {children}
        </main>
      </div>
    </div>
  );
}
