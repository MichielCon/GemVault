"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ApiError } from "./api";
import { baseUrl, authHeader, parseApiError } from "./server-utils";
import { findOrCreateOrigin } from "./origin-actions";

export async function createParcel(
  _prev: { error: string | null; id: string | null },
  formData: FormData
): Promise<{ error: string | null; id: string | null }> {
  const originId = formData.get("originId") as string;
  const originCountry = formData.get("originCountry") as string;
  const originLocality = formData.get("originLocality") as string;

  let resolvedOriginId: string | null = originId || null;
  if (!resolvedOriginId && originCountry) {
    const result = await findOrCreateOrigin(originCountry, originLocality || null);
    if (result.error) return { error: result.error, id: null };
    resolvedOriginId = result.id;
  }

  const raw = {
    name: formData.get("name") as string,
    species: (formData.get("species") as string) || null,
    variety: (formData.get("variety") as string) || null,
    quantity: Number(formData.get("quantity") || 1),
    totalWeightCarats: formData.get("totalWeightCarats")
      ? Number(formData.get("totalWeightCarats"))
      : null,
    color: (formData.get("color") as string) || null,
    treatment: (formData.get("treatment") as string) || null,
    purchasePrice: formData.get("purchasePrice")
      ? Number(formData.get("purchasePrice"))
      : null,
    acquiredAt: (formData.get("acquiredAt") as string) || null,
    notes: (formData.get("notes") as string) || null,
    isPublic: formData.get("isPublic") === "on",
    originId: resolvedOriginId,
  };

  let parcel: { id: string };
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(await authHeader()),
    };
    const res = await fetch(`${baseUrl()}/api/v1/gem-parcels`, {
      method: "POST",
      headers,
      body: JSON.stringify(raw),
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new ApiError(res.status, text);
    }
    parcel = (await res.json()) as { id: string };
  } catch (e) {
    return { error: parseApiError(e), id: null };
  }

  return { id: parcel.id, error: null };
}

export async function updateParcel(
  _prev: { error: string | null; id: string | null },
  formData: FormData
): Promise<{ error: string | null; id: string | null }> {
  const id = formData.get("id") as string;

  const originId = formData.get("originId") as string;
  const originCountry = formData.get("originCountry") as string;
  const originLocality = formData.get("originLocality") as string;

  let resolvedOriginId: string | null = originId || null;
  if (!resolvedOriginId && originCountry) {
    const result = await findOrCreateOrigin(originCountry, originLocality || null);
    if (result.error) return { error: result.error, id: null };
    resolvedOriginId = result.id;
  }

  const raw = {
    name: formData.get("name") as string,
    species: (formData.get("species") as string) || null,
    variety: (formData.get("variety") as string) || null,
    quantity: Number(formData.get("quantity") || 1),
    totalWeightCarats: formData.get("totalWeightCarats")
      ? Number(formData.get("totalWeightCarats"))
      : null,
    color: (formData.get("color") as string) || null,
    treatment: (formData.get("treatment") as string) || null,
    purchasePrice: formData.get("purchasePrice")
      ? Number(formData.get("purchasePrice"))
      : null,
    acquiredAt: (formData.get("acquiredAt") as string) || null,
    notes: (formData.get("notes") as string) || null,
    isPublic: formData.get("isPublic") === "on",
    originId: resolvedOriginId,
  };

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(await authHeader()),
    };
    const res = await fetch(`${baseUrl()}/api/v1/gem-parcels/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(raw),
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new ApiError(res.status, text);
    }
  } catch (e) {
    return { error: parseApiError(e), id: null };
  }

  return { id, error: null };
}

export async function uploadParcelPhoto(
  id: string,
  _prev: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) return { error: "Please select a file." };

  const apiForm = new FormData();
  apiForm.append("file", file, file.name);

  try {
    const store = await cookies();
    const token = store.get("access_token")?.value;
    const headers: Record<string, string> = token
      ? { Authorization: `Bearer ${token}` }
      : {};

    const res = await fetch(`${baseUrl()}/api/v1/gem-parcels/${id}/photos`, {
      method: "POST",
      headers,
      body: apiForm,
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new ApiError(res.status, text);
    }
  } catch (e) {
    return { error: parseApiError(e) };
  }

  return { error: null };
}

export async function deleteParcelPhoto(
  photoId: string
): Promise<{ error: string | null }> {
  try {
    const headers: Record<string, string> = { ...(await authHeader()) };
    const res = await fetch(`${baseUrl()}/api/v1/gem-parcels/photos/${photoId}`, {
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
  return { error: null };
}

export async function deleteParcel(
  _prev: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const id = formData.get("id") as string;

  try {
    const headers: Record<string, string> = {
      ...(await authHeader()),
    };
    const res = await fetch(`${baseUrl()}/api/v1/gem-parcels/${id}`, {
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

  redirect("/dashboard/parcels");
}

export async function bulkDeleteParcels(ids: string[]): Promise<{ error: string | null }> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(await authHeader()),
    };
    const res = await fetch(`${baseUrl()}/api/v1/gem-parcels/bulk`, {
      method: "DELETE",
      headers,
      body: JSON.stringify({ ids }),
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new ApiError(res.status, text);
    }
    return { error: null };
  } catch (e) {
    return { error: parseApiError(e) };
  }
}
