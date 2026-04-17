"use client";

/* ======================================================
   IMPORT
====================================================== */

import Image from "next/image";
import { Box, Card, CardMedia, Typography } from "@mui/material";
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
  const { messages } = useLocale(); // 🔥 ใช้ตรงนี้

  return (
    <Card
      // sx={{
      //   borderRadius: "30px",
      //   overflow: "hidden",
      //   background: "#fff",
      //   boxShadow: "0 15px 30px rgba(0,0,0,0.08)",
      //   transition: "all .3s ease",
      //   display: "flex",
      //   flexDirection: "column",

      //   "&:hover": {
      //     boxShadow: "0 25px 50px rgba(0,0,0,0.12)",
      //   },
      // }}
      variant="outlined"
      sx={{
        borderRadius: 7,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s',
        border:'transparent',
        gap: 1,
        width: '100%',
        position: 'relative',
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-8px)",
          border: '1px solid transparent',
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
          overflow: "hidden"
        }}
      >
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          priority={false}
          loading="lazy"
          style={{
            objectFit: "cover",
            transition: "transform 0.4s ease",
          }}
        />
      </Box>
      {/* ================= CONTENT ================= */}
      <Box sx={{ mx: 4, my: 1, flexGrow: 1 }}>
        <Box sx={{ mb: 2 }} >
          <Typography fontWeight={600} color="var(--color-primary)" sx={{fontSize:18}}>
            {title}
          </Typography>

          <Typography variant="caption" mt={0.5} color="rgba(0,0,0,0.6)">
            {description}
          </Typography>
        </Box>
        <TextButton
          sx={{
            width: '100%',
            textAlign: "center",
            borderRadius:8,
            mb: 1
          }}
        >
          {messages.home.view_detail}
        </TextButton>
      </Box>
    </Card>
  );
}