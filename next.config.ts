import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Render deploy: build standalone server output for faster cold starts
  output: "standalone",
};

export default nextConfig;
