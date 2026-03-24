"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import type { PurchaseOrderSummaryDto } from "@/lib/types";

export function OrderTableRow({ order }: { order: PurchaseOrderSummaryDto }) {
  const router = useRouter();
  return (
    <tr
      className="hover:bg-zinc-50 transition-colors cursor-pointer"
      onClick={() => router.push(`/dashboard/orders/${order.id}`)}
    >
      <td className="px-4 py-3 font-medium">
        <Link
          href={`/dashboard/orders/${order.id}`}
          className="hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {order.reference ?? <span className="text-muted-foreground">—</span>}
        </Link>
      </td>
      <td className="px-4 py-3 text-muted-foreground">{order.supplierName}</td>
      <td className="px-4 py-3 text-muted-foreground">{new Date(order.orderDate).toLocaleDateString()}</td>
      <td className="px-4 py-3 text-muted-foreground">{order.itemCount}</td>
      <td className="px-4 py-3 font-medium">
        {order.totalCost.toLocaleString("en-US", { style: "currency", currency: "USD" })}
      </td>
    </tr>
  );
}
