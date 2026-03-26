"use server";

import { ApiError } from "./api";
import { baseUrl, authHeader, parseApiError } from "./server-utils";

export async function addCuttingSession(
  gemId: string,
  sessionDate: string,
  stage: string,
  hoursSpent: number | null,
  notes: string | null
): Promise<{ error: string | null }> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(await authHeader()),
    };
    const res = await fetch(`${baseUrl()}/api/v1/gems/${gemId}/cutting-sessions`, {
      method: "POST",
      headers,
      body: JSON.stringify({ sessionDate, stage, hoursSpent, notes }),
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

export async function deleteCuttingSession(
  sessionId: string
): Promise<{ error: string | null }> {
  try {
    const headers: Record<string, string> = { ...(await authHeader()) };
    const res = await fetch(`${baseUrl()}/api/v1/cutting-sessions/${sessionId}`, {
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
