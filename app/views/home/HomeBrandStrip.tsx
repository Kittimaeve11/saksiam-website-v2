"use client";

import { Box, Typography } from "@mui/material";
import { useLocale } from "@/app/providers/LocaleContext";

export default function HomeBrandStrip() {
  const { messages } = useLocale();

  return (
    <Box
      sx={{
        width: "100%",
        background: "linear-gradient(135deg, #243865 10%, #4871CB 100%)",
        display: "flex",
        justifyContent: "center",
        mt: "-1px",
      }}
    >
      <Box sx={{ textAlign: "center", color: "#fff", my: 2 }}>
        <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
          {messages?.brand?.name}
        </Typography>

        <Typography sx={{ opacity: 0.9 }}>
          &ldquo;{messages?.brand?.slogan}&rdquo;
        </Typography>
      </Box>
    </Box>
  );
}
