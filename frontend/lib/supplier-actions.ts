"use server";

import { redirect } from "next/navigation";
import { ApiError } from "./api";
import { baseUrl, authHeader, parseApiError } from "./server-utils";

export async function createSupplier(
  _prev: { error: string | null; id: string | null },
  formData: FormData
): Promise<{ error: string | null; id: string | null }> {
  const raw = {
    name: formData.get("name") as string,
    email: (formData.get("email") as string) || null,
    phone: (formData.get("phone") as string) || null,
    website: (formData.get("website") as string) || null,
    address: (formData.get("address") as string) || null,
    notes: (formData.get("notes") as string) || null,
  };

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(await authHeader()),
    };
    const res = await fetch(`${baseUrl()}/api/v1/suppliers`, {
      method: "POST",
      headers,
      body: JSON.stringify(raw),
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new ApiError(res.status, text);
    }
    const supplier = (await res.json()) as { id: string };
    return { id: supplier.id, error: null };
  } catch (e) {
    return { error: parseApiError(e), id: null };
  }
}

export async function createSupplierInline(
  formData: FormData
): Promise<{ supplier: { id: string; name: string } | null; error: string | null }> {
  const raw = {
    name: formData.get("name") as string,
    email: (formData.get("email") as string) || null,
    phone: null,
    address: null,
    notes: null,
  };

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(await authHeader()),
    };
    const res = await fetch(`${baseUrl()}/api/v1/suppliers`, {
      method: "POST",
      headers,
      body: JSON.stringify(raw),
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new ApiError(res.status, text);
    }
    const supplier = (await res.json()) as { id: string; name: string };
    return { supplier, error: null };
  } catch (e) {
    return { supplier: null, error: parseApiError(e) };
  }
}

export async function updateSupplier(
  _prev: { error: string | null; id: string | null },
  formData: FormData
): Promise<{ error: string | null; id: string | null }> {
  const id = formData.get("id") as string;
  const raw = {
    name: formData.get("name") as string,
    email: (formData.get("email") as string) || null,
    phone: (formData.get("phone") as string) || null,
    website: (formData.get("website") as string) || null,
    address: (formData.get("address") as string) || null,
    notes: (formData.get("notes") as string) || null,
  };

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(await authHeader()),
    };
    const res = await fetch(`${baseUrl()}/api/v1/suppliers/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(raw),
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new ApiError(res.status, text);
    }
    return { id, error: null };
  } catch (e) {
    return { error: parseApiError(e), id: null };
  }
}

export async function deleteSupplier(
  _prev: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const id = formData.get("id") as string;

  try {
    const headers: Record<string, string> = {
      ...(await authHeader()),
    };
    const res = await fetch(`${baseUrl()}/api/v1/suppliers/${id}`, {
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

  redirect("/dashboard/suppliers");
}
