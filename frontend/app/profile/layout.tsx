import Sidebar from "@/components/dashboard/sidebar";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-auto p-5">{children}</main>
    </div>
  );
}
