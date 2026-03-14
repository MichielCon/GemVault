"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { profileApi, ApiError } from "./api";
import { revalidatePath } from "next/cache";
import { authApi } from "./api";

const ACCESS_TOKEN_COOKIE = "access_token";
const REFRESH_TOKEN_COOKIE = "refresh_token";

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

  if (e.status === 401) return "Current password is incorrect.";
  if (e.status === 403) return "You do not have permission to do that.";
  if (e.status === 409) return "That email is already in use.";
  if (e.status === 422) return "Invalid data. Please check your inputs.";
  return "Something went wrong. Please try again.";
}

async function clearSession() {
  const store = await cookies();
  await authApi.logout().catch(() => {});
  store.delete(ACCESS_TOKEN_COOKIE);
  store.delete(REFRESH_TOKEN_COOKIE);
}

export async function updateDisplayName(
  _prev: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const displayName = formData.get("displayName") as string | null;
  try {
    await profileApi.updateDisplayName(displayName || null);
    revalidatePath("/profile");
    return { error: null };
  } catch (e: unknown) {
    return { error: parseApiError(e) };
  }
}

export async function changeEmail(
  _prev: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const currentPassword = formData.get("currentPassword") as string;
  const newEmail = formData.get("newEmail") as string;
  try {
    await profileApi.changeEmail(currentPassword, newEmail);
    await clearSession();
  } catch (e: unknown) {
    return { error: parseApiError(e) };
  }
  redirect("/auth/login");
}

export async function changePassword(
  _prev: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  try {
    await profileApi.changePassword(currentPassword, newPassword);
    return { error: null };
  } catch (e: unknown) {
    return { error: parseApiError(e) };
  }
}

export async function revokeMySession(id: string): Promise<{ error: string | null }> {
  try {
    await profileApi.revokeSession(id);
    revalidatePath("/profile");
    return { error: null };
  } catch (e: unknown) {
    return { error: parseApiError(e) };
  }
}

export async function deleteAccount(
  _prev: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const currentPassword = formData.get("currentPassword") as string;
  try {
    await profileApi.deleteAccount(currentPassword);
    await clearSession();
  } catch (e: unknown) {
    return { error: parseApiError(e) };
  }
  redirect("/auth/login");
}
