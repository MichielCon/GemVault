import Link from "next/link";
import { logout, getSessionRole } from "@/lib/auth";
import { Gem, Package, MapPin, Map, LogOut, Building2, ShoppingCart, TrendingUp, LayoutDashboard, BookOpen, Users, KeyRound, Link2, Image as ImageIcon, UserCircle } from "lucide-react";
import { NavLink } from "@/components/dashboard/nav-link";

export default async function Sidebar() {
  const role = await getSessionRole();

  return (
    <aside className="relative flex h-full w-60 shrink-0 flex-col bg-zinc-950 px-3 py-5">
      {/* Logo */}
      <Link href="/dashboard" className="mb-7 flex items-center gap-2.5 px-3 group">
        <div className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600/20 transition-all group-hover:bg-violet-600/30">
          <Gem size={15} className="text-violet-400" />
          <span className="absolute inset-0 rounded-lg opacity-0 ring-2 ring-violet-500/50 transition-opacity group-hover:opacity-100" />
        </div>
        <span className="text-[15px] font-bold tracking-tight text-white">GemVault</span>
      </Link>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto">
        <NavLink href="/dashboard" icon={<LayoutDashboard size={15} />} exact>
          Dashboard
        </NavLink>

        <p className="mb-1 mt-4 px-3 text-[9px] font-semibold uppercase tracking-widest text-zinc-600">
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
        <NavLink href="/dashboard/map" icon={<Map size={15} />}>
          Provenance Map
        </NavLink>

        {(role === "Business" || role === "Admin") && (
          <>
            <p className="mb-1 mt-4 px-3 text-[9px] font-semibold uppercase tracking-widest text-zinc-600">
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
          </>
        )}

        {role === "Admin" && (
          <>
            <p className="mb-1 mt-4 px-3 text-[9px] font-semibold uppercase tracking-widest text-zinc-600">
              Admin
            </p>
            <NavLink href="/dashboard/admin" icon={<LayoutDashboard size={15} />} exact>
              Overview
            </NavLink>
            <NavLink href="/dashboard/admin/vocabulary" icon={<BookOpen size={15} />}>
              Vocabulary
            </NavLink>
            <NavLink href="/dashboard/admin/users" icon={<Users size={15} />}>
              Users
            </NavLink>
            <NavLink href="/dashboard/admin/sessions" icon={<KeyRound size={15} />}>
              Sessions
            </NavLink>
            <NavLink href="/dashboard/admin/public-tokens" icon={<Link2 size={15} />}>
              Public Tokens
            </NavLink>
            <NavLink href="/dashboard/admin/content" icon={<ImageIcon size={15} />}>
              Content
            </NavLink>
          </>
        )}
      </nav>

      {/* Gradient fade at bottom */}
      <div className="pointer-events-none absolute bottom-16 left-0 h-8 w-60 bg-gradient-to-b from-transparent to-zinc-950/60" />

      {/* Profile + Sign out — always pinned to bottom */}
      <div className="shrink-0 border-t border-zinc-800/60 pt-3 flex flex-col gap-0.5">
        <NavLink href="/profile" icon={<UserCircle size={15} />}>
          Profile
        </NavLink>
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-200"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
