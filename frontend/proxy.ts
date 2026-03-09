import { NextRequest, NextResponse } from "next/server";

const PROTECTED = ["/dashboard"];
const AUTH_ROUTES = ["/auth/login", "/auth/register"];
const ADMIN_ROUTES = ["/dashboard/admin"];

function decodeJwtRole(token: string): string | null {
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64url").toString("utf8")
    ) as Record<string, unknown>;
    const roleUri =
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
    return (payload[roleUri] ?? payload["role"] ?? null) as string | null;
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("access_token")?.value;

  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  const isAuthRoute = AUTH_ROUTES.some((p) => pathname.startsWith(p));
  const isAdminRoute = ADMIN_ROUTES.some((p) => pathname.startsWith(p));

  if (isProtected && !token) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // Redirect non-admins away from admin routes
  if (isAdminRoute && token) {
    const role = decodeJwtRole(token);
    if (role !== "Admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  // Logged-in users don't need to see auth pages
  if (isAuthRoute && token) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard/gems";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
