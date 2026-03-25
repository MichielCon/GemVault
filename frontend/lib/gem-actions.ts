"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ApiError } from "./api";
import { baseUrl, authHeader, parseApiError } from "./server-utils";
import { findOrCreateOrigin } from "./origin-actions";

export async function createGem(
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
    weightCarats: formData.get("weightCarats")
      ? Number(formData.get("weightCarats"))
      : null,
    color: (formData.get("color") as string) || null,
    clarity: (formData.get("clarity") as string) || null,
    cut: (formData.get("cut") as string) || null,
    treatment: (formData.get("treatment") as string) || null,
    shape: (formData.get("shape") as string) || null,
    purchasePrice: formData.get("purchasePrice")
      ? Number(formData.get("purchasePrice"))
      : null,
    acquiredAt: (formData.get("acquiredAt") as string) || null,
    notes: (formData.get("notes") as string) || null,
    status: (formData.get("status") as string) || "Available",
    isPublic: formData.get("isPublic") === "on",
    originId: resolvedOriginId,
  };

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(await authHeader()),
    };
    const res = await fetch(`${baseUrl()}/api/v1/gems`, {
      method: "POST",
      headers,
      body: JSON.stringify(raw),
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new ApiError(res.status, text);
    }
    const gem = (await res.json()) as { id: string };
    return { id: gem.id, error: null };
  } catch (e) {
    return { error: parseApiError(e), id: null };
  }
}

export async function createGemDirect(data: {
  name: string;
  species?: string | null;
  variety?: string | null;
  weightCarats?: number | null;
  color?: string | null;
  treatment?: string | null;
  purchasePrice?: number | null;
  acquiredAt?: string | null;
  originId?: string | null;
  sourceParcelId?: string | null;
  isPublic?: boolean;
}): Promise<{ id: string | null; error: string | null }> {
  const raw = {
    name: data.name,
    species: data.species ?? null,
    variety: data.variety ?? null,
    weightCarats: data.weightCarats ?? null,
    color: data.color ?? null,
    treatment: data.treatment ?? null,
    purchasePrice: data.purchasePrice ?? null,
    acquiredAt: data.acquiredAt ?? null,
    notes: null,
    status: "Available",
    isPublic: data.isPublic ?? false,
    originId: data.originId ?? null,
    sourceParcelId: data.sourceParcelId ?? null,
  };

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(await authHeader()),
    };
    const res = await fetch(`${baseUrl()}/api/v1/gems`, {
      method: "POST",
      headers,
      body: JSON.stringify(raw),
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new ApiError(res.status, text);
    }
    const gem = (await res.json()) as { id: string };
    return { id: gem.id, error: null };
  } catch (e) {
    return { id: null, error: parseApiError(e) };
  }
}

export async function updateGem(
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
    weightCarats: formData.get("weightCarats")
      ? Number(formData.get("weightCarats"))
      : null,
    color: (formData.get("color") as string) || null,
    clarity: (formData.get("clarity") as string) || null,
    cut: (formData.get("cut") as string) || null,
    treatment: (formData.get("treatment") as string) || null,
    shape: (formData.get("shape") as string) || null,
    purchasePrice: formData.get("purchasePrice")
      ? Number(formData.get("purchasePrice"))
      : null,
    acquiredAt: (formData.get("acquiredAt") as string) || null,
    notes: (formData.get("notes") as string) || null,
    status: (formData.get("status") as string) || "Available",
    isPublic: formData.get("isPublic") === "on",
    originId: resolvedOriginId,
  };

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(await authHeader()),
    };
    const res = await fetch(`${baseUrl()}/api/v1/gems/${id}`, {
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

export async function uploadGemPhoto(
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

    const res = await fetch(`${baseUrl()}/api/v1/gems/${id}/photos`, {
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

export async function deleteGemPhoto(
  photoId: string
): Promise<{ error: string | null }> {
  try {
    const headers: Record<string, string> = { ...(await authHeader()) };
    const res = await fetch(`${baseUrl()}/api/v1/gems/photos/${photoId}`, {
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

export async function deleteGem(
  _prev: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const id = formData.get("id") as string;

  try {
    const headers: Record<string, string> = {
      ...(await authHeader()),
    };
    const res = await fetch(`${baseUrl()}/api/v1/gems/${id}`, {
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

  redirect("/dashboard/gems");
}

export async function bulkDeleteGems(ids: string[]): Promise<{ error: string | null }> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(await authHeader()),
    };
    const res = await fetch(`${baseUrl()}/api/v1/gems/bulk`, {
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
