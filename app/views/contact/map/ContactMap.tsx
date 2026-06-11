"use client";

/* ====================================================== */
import dynamic from "next/dynamic";
import { Box } from "@mui/material";

/* ====================================================== */
// 🔥 ปิด SSR ถูกต้อง
const MapLeaflet = dynamic(() => import("./MapLeaflet"), {
  ssr: false,
});

/* ====================================================== */
export default function ContactMap() {
  return (
    <Box
      sx={{
        width: "100%",
        height: "400px",
        overflow: "hidden",
      }}
    >
      <MapLeaflet />
    </Box>
  );
}