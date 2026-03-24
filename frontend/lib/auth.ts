"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authApi, ApiError } from "./api";

const ACCESS_TOKEN_COOKIE = "access_token";
const REFRESH_TOKEN_COOKIE = "refresh_token";

function cookieOpts(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge,
  };
}

/** Parse the error body returned by ExceptionHandlingMiddleware and return
 *  a human-readable string of all validation messages. */
function parseApiError(e: unknown): string {
  if (!(e instanceof ApiError)) return "Something went wrong. Please try again.";

  // Try to parse the JSON body stored in e.message
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
    // body wasn't JSON (e.g. plain text from a 401)
  }

  if (e.status === 401) return "Invalid email or password.";
  if (e.status === 409) return "An account with that email already exists.";
  return "Something went wrong. Please try again.";
}

export async function login(
  _prev: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const data = await authApi.login(email, password);
    const store = await cookies();
    store.set(ACCESS_TOKEN_COOKIE, data.accessToken, cookieOpts(60 * 60));
    store.set(REFRESH_TOKEN_COOKIE, data.refreshToken, cookieOpts(60 * 60 * 24 * 30));
  } catch (e) {
    return { error: parseApiError(e) };
  }
  redirect("/dashboard/gems");
}

export async function register(
  _prev: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  try {
    const data = await authApi.register(email, password, role);
    const store = await cookies();
    store.set(ACCESS_TOKEN_COOKIE, data.accessToken, cookieOpts(60 * 60));
    store.set(REFRESH_TOKEN_COOKIE, data.refreshToken, cookieOpts(60 * 60 * 24 * 30));
  } catch (e) {
    return { error: parseApiError(e) };
  }
  redirect("/dashboard/gems");
}

export async function logout() {
  const store = await cookies();
  await authApi.logout().catch((err) => { console.error("Failed to revoke refresh token on logout:", err); });
  store.delete(ACCESS_TOKEN_COOKIE);
  store.delete(REFRESH_TOKEN_COOKIE);
  redirect("/auth/login");
}

export async function getSession() {
  const store = await cookies();
  const token = store.get(ACCESS_TOKEN_COOKIE)?.value;
  return token ? { token } : null;
}

/** Decode the JWT payload (server-side only) and return the user's role.
 *  No signature verification — backend enforces real auth. */
export async function getSessionRole(): Promise<"Admin" | "Business" | "Collector" | null> {
  const store = await cookies();
  const token = store.get(ACCESS_TOKEN_COOKIE)?.value;
  if (!token) return null;
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64url").toString("utf8")
    ) as Record<string, unknown>;
    const roleUri =
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
    const role = (payload[roleUri] ?? payload["role"]) as string | undefined;
    if (role === "Admin" || role === "Business" || role === "Collector") return role;
    return null;
  } catch {
    return null;
  }
}
