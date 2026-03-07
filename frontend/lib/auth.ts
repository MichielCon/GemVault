"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authApi, ApiError } from "./api";

const ACCESS_TOKEN_COOKIE = "access_token";
const REFRESH_TOKEN_COOKIE = "refresh_token";

// Cookie options — httpOnly prevents JS access; Secure in production.
function cookieOpts(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
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
    store.set(ACCESS_TOKEN_COOKIE, data.accessToken, cookieOpts(60 * 60)); // 1 h
    store.set(REFRESH_TOKEN_COOKIE, data.refreshToken, cookieOpts(60 * 60 * 24 * 30)); // 30 d
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) {
      return { error: "Invalid email or password." };
    }
    return { error: "Something went wrong. Please try again." };
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
    if (e instanceof ApiError && e.status === 409) {
      return { error: "An account with that email already exists." };
    }
    if (e instanceof ApiError && e.status === 400) {
      return { error: "Please check your details and try again." };
    }
    return { error: "Something went wrong. Please try again." };
  }
  redirect("/dashboard/gems");
}

export async function logout() {
  const store = await cookies();
  const token = store.get(ACCESS_TOKEN_COOKIE)?.value;
  if (token) await authApi.logout().catch(() => {});
  store.delete(ACCESS_TOKEN_COOKIE);
  store.delete(REFRESH_TOKEN_COOKIE);
  redirect("/auth/login");
}

export async function getSession() {
  const store = await cookies();
  const token = store.get(ACCESS_TOKEN_COOKIE)?.value;
  return token ? { token } : null;
}
