"use server";

import { redirect } from "next/navigation";
import { ApiError, originsApi } from "./api";
import { baseUrl, authHeader, parseApiError } from "./server-utils";

export async function createOrigin(
  _prev: { error: string | null; id: string | null },
  formData: FormData
): Promise<{ error: string | null; id: string | null }> {
  const raw = {
    country: formData.get("country") as string,
    locality: (formData.get("locality") as string) || null,
  };

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(await authHeader()),
    };
    const res = await fetch(`${baseUrl()}/api/v1/origins`, {
      method: "POST",
      headers,
      body: JSON.stringify(raw),
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new ApiError(res.status, text);
    }
    const origin = (await res.json()) as { id: string };
    return { id: origin.id, error: null };
  } catch (e) {
    return { error: parseApiError(e), id: null };
  }
}

export async function updateOrigin(
  _prev: { error: string | null; id: string | null },
  formData: FormData
): Promise<{ error: string | null; id: string | null }> {
  const id = formData.get("id") as string;
  const raw = {
    country: formData.get("country") as string,
    locality: (formData.get("locality") as string) || null,
  };

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(await authHeader()),
    };
    const res = await fetch(`${baseUrl()}/api/v1/origins/${id}`, {
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

export async function deleteOrigin(
  _prev: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const id = formData.get("id") as string;

  try {
    const headers: Record<string, string> = {
      ...(await authHeader()),
    };
    const res = await fetch(`${baseUrl()}/api/v1/origins/${id}`, {
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

  redirect("/dashboard/origins");
}

export async function findOrCreateOrigin(
  country: string,
  locality: string | null
): Promise<{ id: string | null; error: string | null }> {
  try {
    const result = await originsApi.findOrCreate({ country, locality });
    return { id: result.id, error: null };
  } catch (e) {
    return { id: null, error: parseApiError(e) };
  }
}
