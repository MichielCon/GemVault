import Link from "next/link";
import { logout } from "@/lib/auth";
import { Gem, Package, MapPin, LogOut, Building2, ShoppingCart, TrendingUp, LayoutDashboard } from "lucide-react";
import { NavLink } from "@/components/dashboard/nav-link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="flex w-56 shrink-0 flex-col bg-slate-900 px-3 py-5">
        {/* Logo */}
        <Link href="/dashboard" className="mb-7 flex items-center gap-2 px-3">
          <Gem size={18} className="text-violet-400" />
          <span className="text-[15px] font-bold tracking-tight text-white">GemVault</span>
        </Link>

        <nav className="flex flex-1 flex-col gap-0.5">
          <NavLink href="/dashboard" icon={<LayoutDashboard size={15} />} exact>
            Dashboard
          </NavLink>

          <p className="mb-1 mt-4 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            Inventory
          </p>
          <NavLink href="/dashboard/gems" icon={<Gem size={15} />}>
            Gems
          </NavLink>
          <NavLink href="/dashboard/parcels" icon={<Package size={15} />}>
            Parcels
          </NavLink>
          <NavLink href="/dashboard/origins" icon={<MapPin size={15} />}>
            Origins
          </NavLink>

          <p className="mb-1 mt-4 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            Business
          </p>
          <NavLink href="/dashboard/suppliers" icon={<Building2 size={15} />}>
            Suppliers
          </NavLink>
          <NavLink href="/dashboard/orders" icon={<ShoppingCart size={15} />}>
            Orders
          </NavLink>
          <NavLink href="/dashboard/sales" icon={<TrendingUp size={15} />}>
            Sales
          </NavLink>
        </nav>

        {/* Sign out */}
        <div className="border-t border-slate-800 pt-3">
          <form action={logout}>
            <button
              type="submit"
              className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-200"
            >
              <LogOut size={15} />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
