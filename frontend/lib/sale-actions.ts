"use server";

import { redirect } from "next/navigation";
import { ApiError } from "./api";
import { baseUrl, authHeader, parseApiError } from "./server-utils";

export async function createSale(
  _prev: { error: string | null; id: string | null },
  formData: FormData
): Promise<{ error: string | null; id: string | null }> {
  // Items are serialized as parallel arrays of hidden inputs
  const gemIds = formData.getAll("item_gemId") as string[];
  const parcelIds = formData.getAll("item_parcelId") as string[];
  const quantities = formData.getAll("item_qty") as string[];
  const salePrices = formData.getAll("item_price") as string[];

  const items = gemIds.map((gemId, i) => ({
    gemId: gemId || null,
    gemParcelId: parcelIds[i] || null,
    quantity: Number(quantities[i]) || 1,
    salePrice: Number(salePrices[i]) || 0,
  }));

  const raw = {
    saleDate: formData.get("saleDate") as string,
    buyerName: (formData.get("buyerName") as string) || null,
    buyerEmail: (formData.get("buyerEmail") as string) || null,
    buyerPhone: (formData.get("buyerPhone") as string) || null,
    notes: (formData.get("notes") as string) || null,
    items,
  };

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(await authHeader()),
    };
    const res = await fetch(`${baseUrl()}/api/v1/sales`, {
      method: "POST",
      headers,
      body: JSON.stringify(raw),
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new ApiError(res.status, text);
    }
    const sale = (await res.json()) as { id: string };
    return { error: null, id: sale.id };
  } catch (e) {
    return { error: parseApiError(e), id: null };
  }
}

export async function updateSale(
  _prev: { error: string | null; id: string | null },
  formData: FormData
): Promise<{ error: string | null; id: string | null }> {
  const id = formData.get("id") as string;
  const raw = {
    saleDate: formData.get("saleDate") as string,
    buyerName: (formData.get("buyerName") as string) || null,
    buyerEmail: (formData.get("buyerEmail") as string) || null,
    buyerPhone: (formData.get("buyerPhone") as string) || null,
    notes: (formData.get("notes") as string) || null,
  };
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(await authHeader()),
    };
    const res = await fetch(`${baseUrl()}/api/v1/sales/${id}`, {
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

export async function deleteSale(
  _prev: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const id = formData.get("id") as string;

  try {
    const headers: Record<string, string> = {
      ...(await authHeader()),
    };
    const res = await fetch(`${baseUrl()}/api/v1/sales/${id}`, {
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

  redirect("/dashboard/sales");
}
