import { type NextRequest, NextResponse } from "next/server";

// Internal URL reachable from the frontend container → minio container (Docker network).
const MINIO_INTERNAL = process.env.MINIO_INTERNAL_URL ?? "http://minio:9000";
const MINIO_BUCKET = process.env.MINIO_BUCKET ?? "gemvault-images";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return new NextResponse("Missing url", { status: 400 });

  // Security: replace whatever public hostname is in the URL with the internal MinIO address.
  const internalUrl = url.replace(/^https?:\/\/[^/]+/, MINIO_INTERNAL);

  // Security: only allow objects within the expected bucket — prevent SSRF to other hosts.
  const expectedPrefix = `${MINIO_INTERNAL}/${MINIO_BUCKET}/`;
  if (!internalUrl.startsWith(expectedPrefix)) {
    return new NextResponse("Invalid URL", { status: 400 });
  }

  try {
    const upstream = await fetch(internalUrl);
    if (!upstream.ok) return new NextResponse("Not found", { status: 404 });

    const contentType = upstream.headers.get("content-type") ?? "";
    const mimeType = contentType.split(";")[0].trim();
    if (!ALLOWED_TYPES.has(mimeType)) {
      return new NextResponse("Unsupported media type", { status: 415 });
    }

    return new NextResponse(upstream.body, {
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Failed to fetch", { status: 502 });
  }
}
