import type { NextConfig } from "next";

const stage = process.env.NEXT_PUBLIC_STAGE || process.env.NODE_ENV;

const redirectInProd = (...routes: string[]) =>
  stage === "production"
    ? routes.map((r) => ({
        source: "/addCard",
        destination: "/",
        permanent: true,
      }))
    : [];

const nextConfig: NextConfig = {
  redirects: async () => [...redirectInProd("/addCard", "/api//addCard")],
  output: "standalone",
  reactStrictMode: true,
};

export default nextConfig;
