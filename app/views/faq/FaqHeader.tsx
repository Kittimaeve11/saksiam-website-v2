"use client";

/* ======================================================
   IMPORT
====================================================== */
import { Box } from "@mui/material";
import Banner from "@/app/components/ui/Banner/Banner";
import Breadcrumb from "@/app/components/ui/Breadcrumb/Breadcrumb";
import { useLocale } from "@/app/providers/LocaleContext";


/* ======================================================
   COMPONENT
====================================================== */
export default function FaqHeader() {
   const { messages } = useLocale();
  return (
    <Box sx={{ position: "relative" }}>
      
      {/* ================= BANNER ================= */}
      <Banner src="/Banner/BennerFAQPC.jpg" />

      {/* ================= BREADCRUMB ================= */}
      <Box sx={{ mx: "auto" }}>
        <Breadcrumb
          items={[
            { label: messages.common.home, type: "link", href: "/" },
            { label: messages.common.back, type: "back" },
            { label: messages.faq.title, type: "current" },
          ]}
        />
      </Box>

    </Box>
  );
}