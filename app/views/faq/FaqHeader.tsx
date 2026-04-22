"use client";

/* ======================================================
   IMPORT
====================================================== */
import { Box } from "@mui/material";
import Banner from "@/app/components/ui/Banner/Banner";
import Breadcrumb from "@/app/components/ui/Breadcrumb/Breadcrumb";

/* ======================================================
   COMPONENT
====================================================== */
export default function FaqHeader() {
  return (
    <Box sx={{ position: "relative" }}>
      
      {/* ================= BANNER ================= */}
      <Banner src="/Banner/BennerFAQPC.jpg" />

      {/* ================= BREADCRUMB ================= */}
      <Box sx={{ mx: "auto" }}>
        <Breadcrumb
          items={[
            { label: "หน้าหลัก", type: "link", href: "/" },
            { label: "ย้อนกลับ", type: "back" },
            { label: "คำถามที่พบบ่อย", type: "current" },
          ]}
        />
      </Box>

    </Box>
  );
}