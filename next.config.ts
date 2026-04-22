import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /* ======================================================
       🔥 คุณภาพรูป
    ====================================================== */
    qualities: [75, 85, 90],

    /* ======================================================
       🔥 อนุญาตโหลดรูปจากภายนอก
    ====================================================== */
    remotePatterns: [
      /* ===== LOCAL API (สำคัญสุดของมึง) ===== */
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/**",
      },

      /* ===== YOUTUBE ===== */
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/**",
      },
    ],

    /* ======================================================
       🔥 format ที่รองรับ
    ====================================================== */
    formats: ["image/avif", "image/webp"],

    /* ======================================================
       🔥 cache
    ====================================================== */
    minimumCacheTTL: 60,
  },
};

export default nextConfig;