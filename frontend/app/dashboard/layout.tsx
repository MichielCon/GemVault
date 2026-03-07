import Link from "next/link";
import { logout } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Gem, Package, MapPin, LogOut, Building2, ShoppingCart, TrendingUp, LayoutDashboard } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="flex w-60 flex-col border-r bg-card px-3 py-4">
        <div className="mb-6 px-3">
          <span className="text-lg font-bold tracking-tight">GemVault</span>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          <NavLink href="/dashboard" icon={<LayoutDashboard size={16} />}>
            Dashboard
          </NavLink>
          <NavLink href="/dashboard/gems" icon={<Gem size={16} />}>
            Gems
          </NavLink>
          <NavLink href="/dashboard/parcels" icon={<Package size={16} />}>
            Parcels
          </NavLink>
          <NavLink href="/dashboard/origins" icon={<MapPin size={16} />}>
            Origins
          </NavLink>
          <NavLink href="/dashboard/suppliers" icon={<Building2 size={16} />}>
            Suppliers
          </NavLink>
          <NavLink href="/dashboard/orders" icon={<ShoppingCart size={16} />}>
            Orders
          </NavLink>
          <NavLink href="/dashboard/sales" icon={<TrendingUp size={16} />}>
            Sales
          </NavLink>
        </nav>

        <form action={logout}>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2" type="submit">
            <LogOut size={16} />
            Sign out
          </Button>
        </form>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}

function NavLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      {icon}
      {children}
    </Link>
  );
}
