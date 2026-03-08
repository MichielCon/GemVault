import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      // Local dev: MinIO on localhost
      { protocol: "http", hostname: "localhost", port: "9000" },
      // Docker compose: MinIO container hostname
      { protocol: "http", hostname: "minio", port: "9000" },
      // Production: any HTTPS host (MinIO behind CDN/proxy)
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
