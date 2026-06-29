import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf-parse", "pdfjs-dist", "@napi-rs/canvas"],
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  turbopack: {
    root: process.cwd(),
  },
  experimental: {
    serverActions: {
      // Resume uploads allow up to 5MB PDFs via uploadResume server action.
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
