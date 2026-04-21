"use client";

/* ======================================================
   IMPORT
====================================================== */

import Image from "next/image";
import { Box, Card, Typography } from "@mui/material";
import { useLocale } from "@/app/providers/LocaleContext";
import TextButton from "@/app/components/ui/Button/TextButton";

/* ======================================================
   TYPES
====================================================== */

type ServiceCardProps = {
  image: string;
  title: string;
  description: string;
};

/* ======================================================
   COMPONENT
====================================================== */

export default function ServiceCard({
  image,
  title,
  description,
}: ServiceCardProps) {
  const { messages } = useLocale();

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 7,
        display: "flex",
        flexDirection: "column",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s",
        border: "transparent",
        gap: 1,
        width: "100%",
        position: "relative",
        cursor: "pointer",

        "&:hover": {
          transform: "translateY(-8px)",
        },

        "&:hover img": {
          transform: "scale(1.08)",
        },
      }}
    >
      {/* ================= IMAGE ================= */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: "4 / 3",
          overflow: "hidden",
        }}
      >
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          loading="lazy"
          style={{
            objectFit: "cover",
            transition: "transform 0.4s ease",
          }}
        />
      </Box>

      {/* ================= CONTENT ================= */}
      <Box sx={{ px: 4, py: 2, flexGrow: 1 }}>
        <Box sx={{ mb: 2 }}>
          
          {/* 🔥 FIX: ใช้ sx เท่านั้น กันโดน override */}
          <Typography
            sx={{
              fontWeight: 700, // 🔥 ใช้ 700 แทน 600 (รองรับแน่นอน)
              color: "var(--color-primary)",
              fontSize: 18,
              lineHeight: 1.4,
            }}
          >
            {title}
          </Typography>

          {/* 🔥 FIX: color + font ใส่ใน sx */}
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              color: "rgba(0,0,0,0.6)",
              display: "block",
              fontWeight: 400,
              lineHeight: 1.6,
              fontSize: 14,
            }}
          >
            {description}
          </Typography>
        </Box>

        <TextButton
          sx={{
            width: "100%",
            textAlign: "center",
            borderRadius: 8,
            mb: 1,
          }}
        >
          {messages.home.view_detail}
        </TextButton>
      </Box>
    </Card>
  );
}