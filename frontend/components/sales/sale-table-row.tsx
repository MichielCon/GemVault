"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import type { SaleSummaryDto } from "@/lib/types";

export function SaleTableRow({ sale }: { sale: SaleSummaryDto }) {
  const router = useRouter();
  return (
    <tr
      className="hover:bg-zinc-50 transition-colors cursor-pointer"
      onClick={() => router.push(`/dashboard/sales/${sale.id}`)}
    >
      <td className="px-4 py-3 font-medium">
        <Link
          href={`/dashboard/sales/${sale.id}`}
          className="hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {new Date(sale.saleDate).toLocaleDateString()}
        </Link>
      </td>
      <td className="px-4 py-3 text-muted-foreground">{sale.buyerName ?? "—"}</td>
      <td className="px-4 py-3 text-muted-foreground">{sale.itemCount}</td>
      <td className="px-4 py-3 font-medium">
        {sale.totalSaleValue.toLocaleString("en-US", { style: "currency", currency: "USD" })}
      </td>
    </tr>
  );
}
