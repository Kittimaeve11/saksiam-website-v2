"use client";

/* ====================================================== */
import { Box } from "@mui/material";
import Gallery from "./gallery";

/* ====================================================== */
type Props = {
  images: string[];
};

/* ====================================================== */
export default function NewsGallery({ images = [] }: Props) {
  if (!images || images.length <= 1) return null;

  // ตัดรูปแรกออก (ใช้เป็น main image)
  const galleryImages = images.slice(1);

  return (
    <Box sx={{ mt: 4 }}>
      <Gallery images={galleryImages} />
    </Box>
  );
}