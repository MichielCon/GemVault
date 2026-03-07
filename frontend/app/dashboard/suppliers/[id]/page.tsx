import { notFound } from "next/navigation";
import Link from "next/link";
import { suppliersApi } from "@/lib/api";
import { ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Pencil, ShoppingCart } from "lucide-react";
import { DeleteSupplierButton } from "@/components/suppliers/delete-supplier-button";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SupplierDetailPage({ params }: Props) {
  const { id } = await params;

  let supplier;
  try {
    supplier = await suppliersApi.get(id);
  } catch (e) {
    if (e instanceof ApiError && (e.status === 404 || e.status === 403)) {
      notFound();
    }
    throw e;
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit">
        <Link href="/dashboard/suppliers">
          <ArrowLeft size={16} />
          All suppliers
        </Link>
      </Button>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{supplier.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {supplier.orderCount} order{supplier.orderCount !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button asChild variant="outline" size="sm">
            <Link href={`/dashboard/suppliers/${supplier.id}/edit`}>
              <Pencil size={14} />
              Edit
            </Link>
          </Button>
          <DeleteSupplierButton id={supplier.id} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <Detail label="Email" value={supplier.email} />
              <Detail label="Phone" value={supplier.phone} />
              <Detail label="Address" value={supplier.address} />
            </dl>
            {supplier.notes && (
              <p className="mt-3 text-sm text-muted-foreground">{supplier.notes}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Info</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <Detail label="Orders" value={String(supplier.orderCount)} />
              <Detail label="Added" value={new Date(supplier.createdAt).toLocaleDateString()} />
            </dl>
          </CardContent>
        </Card>
      </div>

      {/* Orders link */}
      <div className="flex items-center gap-2">
        <ShoppingCart size={16} className="text-muted-foreground" />
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/orders">View all orders</Link>
        </Button>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </>
  );
}
