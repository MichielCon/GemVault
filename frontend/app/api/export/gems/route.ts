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

  const res = await fetch(`${apiUrl()}/api/v1/gems/export`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    return new NextResponse("Export failed", { status: res.status });
  }

  const csv = await res.text();
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="gems-export.csv"',
    },
  });
}
