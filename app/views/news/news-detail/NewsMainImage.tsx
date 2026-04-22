"use client";

/* ====================================================== */
import Image from "next/image";
import { Box } from "@mui/material";

/* ====================================================== */
type Props = {
  src: string;
  title?: string;
};

/* ====================================================== */
export default function NewsMainImage({ src, title }: Props) {
  if (!src) return null;

  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: "30px",
        overflow: "hidden",
        position: "relative",
        aspectRatio: "16/9", // 🔥 ตัวหลัก
      }}
    >
      <Image
        src={src}
        alt={title || "news image"}
        fill // 🔥 ต้องใช้ fill
        priority
        sizes="(max-width: 768px) 100vw, 1200px"
        style={{
          objectFit: "cover", // 🔥 กันรูปยืด
        }}
      />
    </Box>
  );
}