"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ApiError } from "./api";
import { findOrCreateOrigin } from "./origin-actions";

function baseUrl() {
  return (
    process.env.INTERNAL_API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:5000"
  );
}

async function authHeader(): Promise<Record<string, string>> {
  const store = await cookies();
  const token = store.get("access_token")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function parseApiError(e: unknown): string {
  if (!(e instanceof ApiError)) return "Something went wrong. Please try again.";

  try {
    const body = JSON.parse(e.message) as {
      title?: string;
      errors?: Record<string, string[]>;
    };
    if (body.errors) {
      const messages = Object.values(body.errors).flat();
      if (messages.length > 0) return messages.join(" ");
    }
    if (body.title) return body.title;
  } catch {
    // plain text body
  }

  if (e.status === 401) return "You must be logged in to do that.";
  if (e.status === 403) return "You do not have permission to do that.";
  if (e.status === 422) return "Invalid data. Please check your inputs.";
  return "Something went wrong. Please try again.";
}

export async function createGem(
  _prev: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const originId = formData.get("originId") as string;
  const originCountry = formData.get("originCountry") as string;
  const originLocality = formData.get("originLocality") as string;

  let resolvedOriginId: string | null = originId || null;
  if (!resolvedOriginId && originCountry) {
    const result = await findOrCreateOrigin(originCountry, originLocality || null);
    if (result.error) return { error: result.error };
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

  let gem: { id: string };
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
    gem = (await res.json()) as { id: string };
  } catch (e) {
    return { error: parseApiError(e) };
  }

  redirect(`/dashboard/gems/${gem.id}`);
}

export async function updateGem(
  _prev: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const id = formData.get("id") as string;

  const originId = formData.get("originId") as string;
  const originCountry = formData.get("originCountry") as string;
  const originLocality = formData.get("originLocality") as string;

  let resolvedOriginId: string | null = originId || null;
  if (!resolvedOriginId && originCountry) {
    const result = await findOrCreateOrigin(originCountry, originLocality || null);
    if (result.error) return { error: result.error };
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
  } catch (e) {
    return { error: parseApiError(e) };
  }

  redirect(`/dashboard/gems/${id}`);
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
