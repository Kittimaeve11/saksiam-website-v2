"use client";

/* ======================================================
   IMPORT
====================================================== */
import { Box } from "@mui/material";
import Breadcrumb from "@/app/components/ui/Breadcrumb/Breadcrumb";
import ContactHero from "./ContactHero";

/* ======================================================
   TYPE
====================================================== */
type Props = {
  onErrorChange: (count: number) => void;
};

/* ======================================================
   COMPONENT
====================================================== */
export default function ContactHeader({ onErrorChange }: Props) {
  return (
    <Box sx={{ position: "relative" }}>

      {/* ================= HERO ================= */}
      <ContactHero onErrorChange={onErrorChange} />

      {/* ================= BREADCRUMB ================= */}
      <Box
        sx={{
          position: "absolute",
          top: { xs: 16, md: 24 },
          left: 0,
          width: "100%",
          zIndex: 10,
        }}
      >
        <Box sx={{ mx: "auto" }}>
          <Breadcrumb
            items={[
              { label: "หน้าหลัก", type: "link", href: "/" },
              { label: "ย้อนกลับ", type: "back" },
              { label: "ติดต่อเรา", type: "current" },
            ]}
          />
        </Box>
      </Box>

    </Box>
  );
}