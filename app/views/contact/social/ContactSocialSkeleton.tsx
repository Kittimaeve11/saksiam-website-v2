"use client";

import { Box, Skeleton } from "@mui/material";

export default function ContactSocialSkeleton() {
  return (
    <Box
      sx={{
        mt: 6,
        py: 10,
        textAlign: "center",
        background: "#1C3563",
        color: "#fff",
      }}
    >
      <Skeleton
        variant="text"
        sx={{
          width: { xs: 220, md: 320 },
          mx: "auto",
          mb: 4,
          fontSize: "38px",
          bgcolor: "rgba(255,255,255,0.22)",
        }}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 4,
          flexWrap: "wrap",
        }}
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton
            key={index}
            variant="rounded"
            sx={{
              width: 60,
              height: 60,
              borderRadius: "14px",
              bgcolor: "rgba(255,255,255,0.22)",
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
