"use client";

/* ======================================================
   IMPORT
====================================================== */
import { Box, Container } from "@mui/material";
import Breadcrumb from "@/app/components/ui/Breadcrumb/Breadcrumb";
import ContactHero from "../hero/ContactHero";
import { useLocale } from "@/app/providers/LocaleContext";

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
     const { messages } = useLocale();
  
  return (
    <Box sx={{ position: "relative" }}>

      {/* ================= HERO ================= */}
      <ContactHero onErrorChange={onErrorChange} />

      {/* ================= BREADCRUMB ================= */}
      <Container
        maxWidth="xl"
        sx={{
          position: "absolute",
          top: { xs: 12, md: 18 },
          left: 0,
          right: 0,
          zIndex: 20,
          pointerEvents: "none",
          "& > *": {
            pointerEvents: "auto",
          },
        }}
      >
        <Breadcrumb
          colorVariant="light"
          items={[
            { label: messages.common.home, type: "link", href: "/" },
            { label: messages.common.back, type: "back" },
            { label: messages.menu.contact, type: "current" },
          ]}
        />
      </Container>

    </Box>
  );
}
