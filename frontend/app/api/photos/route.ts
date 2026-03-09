import { type NextRequest, NextResponse } from "next/server";

// Internal URL for MinIO — set this in docker-compose (frontend env) or .env for local dev.
// In Docker: http://minio:9000 (container-to-container).
// In local dev: http://localhost:9000 (MinIO mapped port).
const MINIO_INTERNAL = process.env.MINIO_INTERNAL_URL ?? "http://minio:9000";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return new NextResponse("Missing url", { status: 400 });

  // Replace whatever public hostname is in the URL with the internal MinIO address.
  const internalUrl = url.replace(/^https?:\/\/[^/]+/, MINIO_INTERNAL);

  try {
    const res = await fetch(internalUrl);
    if (!res.ok) return new NextResponse("Not found", { status: 404 });

    const contentType = res.headers.get("Content-Type") ?? "application/octet-stream";
    return new NextResponse(res.body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        // Open PDFs inline in the browser instead of forcing a download
        ...(contentType === "application/pdf" && { "Content-Disposition": "inline" }),
      },
    });
  } catch {
    return new NextResponse("Failed to fetch image", { status: 502 });
  }
}
