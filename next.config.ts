import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Render deploy: build standalone server output for faster cold starts
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
