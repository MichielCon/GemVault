"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({
  href,
  icon,
  children,
  exact = false,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  exact?: boolean;
}) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={`relative flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${
        isActive
          ? "bg-white/8 text-white font-medium"
          : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
      }`}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-violet-500" />
      )}
      {icon}
      {children}
    </Link>
  );
}
