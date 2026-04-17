import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 85, 90],

    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },

      {
        protocol: "https",
        hostname: "**", // ใช้ได้ทุก domain (สะดวก แต่ระวัง security)
      },
    ],

    formats: ["image/avif", "image/webp"],

    minimumCacheTTL: 60,
  },
};

export default nextConfig;