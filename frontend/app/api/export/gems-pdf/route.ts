import { cookies } from "next/headers";
import { NextResponse } from "next/server";

function apiUrl() {
  return process.env.INTERNAL_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
}

export async function GET() {
  const store = await cookies();
  const token = store.get("access_token")?.value;
  if (!token) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const res = await fetch(`${apiUrl()}/api/v1/gems/export?format=pdf`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    return new NextResponse("Export failed", { status: res.status });
  }

  const buffer = await res.arrayBuffer();
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="gems-export.pdf"',
    },
  });
}
