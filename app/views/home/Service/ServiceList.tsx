"use client";

/* ======================================================
   IMPORT
====================================================== */

import Image from "next/image";
import { Box, Typography } from "@mui/material";

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
  return (
    <Box
      sx={{
        borderRadius: "20px",
        overflow: "hidden",
        background: "#fff",
        boxShadow: "0 15px 30px rgba(0,0,0,0.08)",
        transition: "all .3s ease",
        display: "flex",
        flexDirection: "column",

        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 25px 50px rgba(0,0,0,0.12)",
        },
      }}
    >
      {/* ================= IMAGE ================= */}
      <Box sx={{ position: "relative", height: 180 }}>
        <Image src={image} alt={title} fill style={{ objectFit: "cover" }} />
      </Box>

      {/* ================= CONTENT ================= */}
      <Box sx={{ p: 2, flexGrow: 1 }}>
        <Typography
          sx={{
            fontSize: 15,
            fontWeight: 600,
            color: "var(--color-primary)",
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            fontSize: 13,
            mt: 0.5,
            color: "rgba(0,0,0,0.6)",
          }}
        >
          {description}
        </Typography>
      </Box>

      {/* ================= BUTTON ================= */}
      <Box sx={{ px: 2, pb: 2 }}>
        <Box
          sx={{
            textAlign: "center",
            py: 1.2,
            borderRadius: "999px",
            background: "var(--color-primary)",
            color: "#fff",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all .25s",

            "&:hover": {
              background: "var(--color-primary-hover)",
            },
          }}
        >
          ดูรายละเอียด
        </Box>
      </Box>
    </Box>
  );
}