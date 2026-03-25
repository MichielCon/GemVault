"use server";

import { redirect } from "next/navigation";
import { ApiError } from "./api";
import { baseUrl, authHeader, parseApiError } from "./server-utils";

export async function createPurchaseOrder(
  _prev: { error: string | null; id: string | null },
  formData: FormData
): Promise<{ error: string | null; id: string | null }> {
  // Items are serialized as parallel arrays of hidden inputs
  const gemIds = formData.getAll("item_gemId") as string[];
  const parcelIds = formData.getAll("item_parcelId") as string[];
  const costPrices = formData.getAll("item_costPrice") as string[];
  const itemNotes = formData.getAll("item_notes") as string[];

  const items = gemIds.map((gemId, i) => ({
    gemId: gemId || null,
    gemParcelId: parcelIds[i] || null,
    costPrice: Number(costPrices[i]) || 0,
    notes: itemNotes[i] || null,
  }));

  const raw = {
    supplierId: (formData.get("supplierId") as string) || null,
    boughtFrom: (formData.get("boughtFrom") as string) || null,
    reference: (formData.get("reference") as string) || null,
    orderDate: formData.get("orderDate") as string,
    notes: (formData.get("notes") as string) || null,
    items,
  };

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(await authHeader()),
    };
    const res = await fetch(`${baseUrl()}/api/v1/purchase-orders`, {
      method: "POST",
      headers,
      body: JSON.stringify(raw),
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new ApiError(res.status, text);
    }
    const order = (await res.json()) as { id: string };
    return { error: null, id: order.id };
  } catch (e) {
    return { error: parseApiError(e), id: null };
  }
}

export async function updatePurchaseOrder(
  _prev: { error: string | null; id: string | null },
  formData: FormData
): Promise<{ error: string | null; id: string | null }> {
  const id = formData.get("id") as string;
  const raw = {
    supplierId: (formData.get("supplierId") as string) || null,
    boughtFrom: (formData.get("boughtFrom") as string) || null,
    reference: (formData.get("reference") as string) || null,
    orderDate: formData.get("orderDate") as string,
    notes: (formData.get("notes") as string) || null,
  };
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(await authHeader()),
    };
    const res = await fetch(`${baseUrl()}/api/v1/purchase-orders/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(raw),
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new ApiError(res.status, text);
    }
    return { error: null, id };
  } catch (e) {
    return { error: parseApiError(e), id: null };
  }
}

export async function deletePurchaseOrder(
  _prev: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const id = formData.get("id") as string;

  try {
    const headers: Record<string, string> = {
      ...(await authHeader()),
    };
    const res = await fetch(`${baseUrl()}/api/v1/purchase-orders/${id}`, {
      method: "DELETE",
      headers,
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new ApiError(res.status, text);
    }
  } catch (e) {
    return { error: parseApiError(e) };
  }

  redirect("/dashboard/orders");
}
