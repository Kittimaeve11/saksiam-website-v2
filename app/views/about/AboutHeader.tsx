"use client";

/* ======================================================
   IMPORT
====================================================== */
import { Box, Typography } from "@mui/material";
import Banner from "@/app/components/ui/Banner/Banner";
import Breadcrumb from "@/app/components/ui/Breadcrumb/Breadcrumb";

/* ======================================================
   COMPONENT
====================================================== */
export default function AboutHeader() {
  return (
    <Box sx={{ position: "relative" }}>
      
      {/* ================= BANNER ================= */}
      <Banner src="/Banner/PicturePC_About.jpg" />

      {/* ================= OVERLAY TITLE ================= */}
      <Box
        sx={{
          position: "absolute",
          bottom: { xs: 20, md: 40 },
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: "lg",
          px: 2,
        }}
      >
        <Typography
          sx={{
            color: "#fff",
            fontSize: { xs: "24px", md: "36px" },
            fontWeight: 700,
          }}
        >
          เกี่ยวกับเรา
        </Typography>

        {/* 🔥 เส้นเหลือง corporate */}
        <Box
          sx={{
            width: "120px",
            height: "4px",
            background: "var(--color-secondary)",
            mt: 1,
            borderRadius: "2px",
          }}
        />
      </Box>

      {/* ================= BREADCRUMB ================= */}
      <Box sx={{ maxWidth: "lg", mx: "auto", mt: 2, px: 2 }}>
        <Breadcrumb
          items={[
            { label: "หน้าหลัก", type: "link", href: "/" },
            { label: "ย้อนกลับ", type: "back" },
            { label: "เกี่ยวกับเรา", type: "current" },
          ]}
        />
      </Box>

    </Box>
  );
}