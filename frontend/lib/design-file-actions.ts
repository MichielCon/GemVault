"use server";

import { cookies } from "next/headers";
import { ApiError } from "./api";
import { baseUrl, authHeader, parseApiError } from "./server-utils";

export async function uploadDesignFile(
  gemId: string,
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

    const res = await fetch(`${baseUrl()}/api/v1/gems/${gemId}/design-files`, {
      method: "POST",
      headers,
      body: apiForm,
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

export async function deleteDesignFile(
  fileId: string
): Promise<{ error: string | null }> {
  try {
    const headers: Record<string, string> = { ...(await authHeader()) };
    const res = await fetch(`${baseUrl()}/api/v1/design-files/${fileId}`, {
      method: "DELETE",
      headers,
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
