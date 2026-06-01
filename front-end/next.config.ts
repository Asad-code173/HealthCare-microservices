import type { NextConfig } from "next";

const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "healthcaredatadoctors.s3.ap-south-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
