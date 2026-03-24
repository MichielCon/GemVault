"use server";

import { revalidatePath } from "next/cache";
import { adminApi } from "./api";
import type { AdminPublicTokenDto } from "./types";

export async function changeUserRole(
  _prev: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const userId = formData.get("userId") as string;
  const role = formData.get("role") as string;
  try {
    await adminApi.changeRole(userId, role);
    return { error: null };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Failed to change role." };
  }
}

export async function deactivateUser(
  _prev: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const userId = formData.get("userId") as string;
  try {
    await adminApi.deactivateUser(userId);
    return { error: null };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Failed to deactivate user." };
  }
}

export async function reactivateUser(
  _prev: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const userId = formData.get("userId") as string;
  try {
    await adminApi.reactivateUser(userId);
    return { error: null };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Failed to reactivate user." };
  }
}

export async function revokeUserSessions(
  _prev: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const userId = formData.get("userId") as string;
  try {
    await adminApi.revokeUserSessions(userId);
    revalidatePath("/dashboard/admin/sessions");
    return { error: null };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Failed to revoke sessions." };
  }
}

export async function revokeSession(
  _prev: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const sessionId = formData.get("sessionId") as string;
  try {
    await adminApi.revokeSession(sessionId);
    revalidatePath("/dashboard/admin/sessions");
    return { error: null };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Failed to revoke session." };
  }
}

export async function revokeSessionById(sessionId: string): Promise<{ error: string | null }> {
  try {
    await adminApi.revokeSession(sessionId);
    revalidatePath("/dashboard/admin/sessions");
    return { error: null };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Failed to revoke session." };
  }
}

export async function revokeUserSessionsById(userId: string): Promise<{ error: string | null }> {
  try {
    await adminApi.revokeUserSessions(userId);
    revalidatePath("/dashboard/admin/sessions");
    return { error: null };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Failed to revoke sessions." };
  }
}

export async function togglePublicToken(
  _prev: { token: AdminPublicTokenDto | null; error: string | null },
  formData: FormData
): Promise<{ token: AdminPublicTokenDto | null; error: string | null }> {
  const tokenId = formData.get("tokenId") as string;
  try {
    const token = await adminApi.togglePublicToken(tokenId);
    return { token, error: null };
  } catch (e: unknown) {
    return { token: null, error: e instanceof Error ? e.message : "Failed to toggle token." };
  }
}

export async function adminDeletePhoto(
  _prev: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const photoId = formData.get("photoId") as string;
  try {
    await adminApi.deletePhoto(photoId);
    return { error: null };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Failed to delete photo." };
  }
}

export async function adminDeleteCertificate(
  _prev: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const certId = formData.get("certId") as string;
  try {
    await adminApi.deleteCertificate(certId);
    return { error: null };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Failed to delete certificate." };
  }
}
