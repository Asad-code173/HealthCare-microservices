import type { NextConfig } from "next";

const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
         hostname: "healthcaredatadoctors-us.s3.us-east-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
