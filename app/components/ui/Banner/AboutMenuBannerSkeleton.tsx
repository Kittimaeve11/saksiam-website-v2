"use client";

import { Box } from "@mui/material";

export default function AboutMenuBannerSkeleton() {
  return (
    <Box
      sx={{
        width: "100%",
        py: { xs: 0, md: 0 },
        boxSizing: "border-box",
        overflow: "hidden",
        lineHeight: 0,
      }}
    >
      <Box
        sx={{
          width: "100%",
          aspectRatio: {
            xs: "678 / 1032",
            md: "16 / 9",
          },
          minHeight: { xs: 0, md: 0 },
          borderRadius: { xs: "18px", md: "28px" },
          background:
            "linear-gradient(90deg, var(--gray-50) 0%, var(--gray-100) 45%, var(--gray-50) 100%)",
          backgroundSize: "220% 100%",
          animation: "aboutBannerPulse 1.4s ease-in-out infinite",
          "@keyframes aboutBannerPulse": {
            "0%": { backgroundPosition: "100% 0" },
            "100%": { backgroundPosition: "-100% 0" },
          },
        }}
      />
    </Box>
  );
}
