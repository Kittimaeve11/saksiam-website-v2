"use client";

/* ======================================================
   IMPORT
====================================================== */
import { Box } from "@mui/material";

/* ======================================================
   TYPE
====================================================== */
type Props = {
  src: string;
  alt?: string;
  children?: React.ReactNode; // 🔥 เผื่อใช้ overlay (เช่น breadcrumb)
};

/* ======================================================
   COMPONENT
====================================================== */
export default function Banner({ src, alt = "banner", children }: Props) {
  return (
    <Box
      sx={{
        width: "100%",
        position: "relative",
        background: "#fff",
      }}
    >
      {/* ======================================================
         🔥 IMAGE (ไม่โดนตัด / เต็มจอ)
      ====================================================== */}
      <Box
        component="img"
        src={src}
        alt={alt}
        sx={{
          width: "100%",
          height: "auto",   // ✅ รักษาสัดส่วน 3840x1191
          display: "block",
        }}
      />

      {/* ======================================================
         🔥 SLOT (เผื่อใส่อะไรทับ เช่น breadcrumb)
      ====================================================== */}
      {children && (
        <Box
          sx={{
            position: "absolute",
            top: { xs: 10, md: 20 },
            left: 0,
            width: "100%",
            zIndex: 10,
          }}
        >
          <Box sx={{ maxWidth: "lg", mx: "auto", px: 2 }}>
            {children}
          </Box>
        </Box>
      )}
    </Box>
  );
}