import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

// Internal URL for MinIO — set this in docker-compose (frontend env) or .env for local dev.
// In Docker: http://minio:9000 (container-to-container).
// In local dev: http://localhost:9000 (MinIO mapped port).
const MINIO_INTERNAL = process.env.MINIO_INTERNAL_URL ?? "http://minio:9000";
const MINIO_BUCKET = process.env.MINIO_BUCKET ?? "gemvault";

const ALLOWED_CONTENT_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
]);

export async function GET(req: NextRequest) {
  // C-01: Require authentication — only authenticated users may use this proxy.
  const store = await cookies();
  const accessToken = store.get("access_token")?.value;
  if (!accessToken) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const url = req.nextUrl.searchParams.get("url");
  if (!url) return new NextResponse("Missing url", { status: 400 });

  // Replace whatever public hostname is in the URL with the internal MinIO address.
  const internalUrl = url.replace(/^https?:\/\/[^/]+/, MINIO_INTERNAL);

  // L-01: Validate the resulting URL is within the expected MinIO bucket.
  const expectedPrefix = `${MINIO_INTERNAL}/${MINIO_BUCKET}/`;
  if (!internalUrl.startsWith(expectedPrefix)) {
    return new NextResponse("Invalid URL", { status: 400 });
  }

  try {
    const upstream = await fetch(internalUrl);
    if (!upstream.ok) return new NextResponse("Not found", { status: 404 });

    // L-01: Allowlist Content-Type — reject unexpected response types.
    const contentType = upstream.headers.get("content-type") ?? "";
    // Strip parameters (e.g. "image/jpeg; charset=utf-8") before checking.
    const mimeType = contentType.split(";")[0].trim();
    if (!ALLOWED_CONTENT_TYPES.has(mimeType)) {
      return new NextResponse("Unsupported media type", { status: 415 });
    }

    return new NextResponse(upstream.body, {
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=31536000, immutable",
        // Open PDFs inline in the browser instead of forcing a download
        ...(mimeType === "application/pdf" && { "Content-Disposition": "inline" }),
      },
    });
  } catch {
    return new NextResponse("Failed to fetch image", { status: 502 });
  }
}
