import type { NextConfig } from "next";

const stage = process.env.NEXT_PUBLIC_STAGE || process.env.NODE_ENV;

const nextConfig: NextConfig = {
  output: "export",
  distDir: "out",
};

export default nextConfig;
