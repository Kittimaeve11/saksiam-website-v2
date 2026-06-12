"use client";

/* ======================================================
   IMPORT
====================================================== */

import Image from "next/image";
import { Box, Card, Typography } from "@mui/material";
import { useLocale } from "@/app/providers/LocaleContext";
import TextButton from "@/app/components/ui/Button/TextButton";
import { loanItem } from "@/app/Utils/type";

const BASE_URL = process.env.NEXT_PUBLIC_API_PHOTO!;

/* ======================================================
   TYPES
====================================================== */

type ServiceCardProps = {
  image: string;
  title: string;
  description: string;
  route: string;
  item: loanItem;
  handleClick: (item: loanItem) => Promise<void>;
};

/* ======================================================
   COMPONENT
====================================================== */

export default function ServiceCard({
  image,
  title,
  description,
  item,
  handleClick,
}: ServiceCardProps) {
  const { messages } = useLocale();

    return (
      <Card
        variant="outlined"
        sx={{
        borderRadius: 7,
        display: "flex",
        flexDirection: "column",

        width: "100%",
        maxWidth: "355px",
        mx: "auto",

        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",

        transition:
          "transform 0.25s ease, box-shadow 0.25s ease",

        border: "transparent",
        gap: 1,

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
          src={`${BASE_URL}/${image}`}
          alt={title}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, 33vw"
          style={{
            objectFit: "cover",
            transition: "transform 0.4s ease",
          }}
        />
      </Box>

      {/* ================= CONTENT ================= */}

      <Box
        sx={{
          mx: 4,
          my: 1,
          flexGrow: 1,
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Typography
            sx={{
              color: "var(--color-primary)",
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              color: "rgba(0,0,0,0.6)",
            }}
          >
            {description}
          </Typography>
        </Box>

        <TextButton
          onClick={() => handleClick(item)}
          sx={{
            width: "100%",
            textAlign: "center",
            borderRadius: 8,
            mb: 1,
            color: "#fff",
          }}
        >
          {messages.home.view_detail}
        </TextButton>
      </Box>
    </Card>
  );
}
