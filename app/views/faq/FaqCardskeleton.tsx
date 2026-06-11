"use client";

import { Box, Skeleton } from "@mui/material";

export default function FaqCardSkeleton({ isLast = false }: { isLast?: boolean }) {
  return (
    <Box
      sx={{
        mb: isLast ? 0 : { xs: 1.75, sm: 2.25, md: 3 },
        borderRadius: { xs: "16px", sm: "18px", md: "20px" },
        background: "#fff",
        boxShadow: isLast
          ? "none"
          : {
              xs: "0 8px 18px rgba(16,24,40,0.06)",
              md: "0 12px 30px rgba(0,0,0,0.07)",
            },
        border: "1px solid rgba(216, 218, 220, 0.9)",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          px: { xs: 2, sm: 2.5, md: 4 },
          py: { xs: 2, sm: 2.25, md: 3 },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: { xs: 1.5, sm: 2, md: 3 },
          minHeight: { xs: 72, sm: 82, md: 92 },
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              width: { xs: "82%", sm: "70%", md: "56%" },
              height: { xs: 24, md: 28 },
              bgcolor: "rgba(145, 158, 171, 0.18)",
              transform: "none",
            }}
          />
        </Box>

        <Skeleton
          variant="circular"
          animation="wave"
          sx={{
            width: { xs: 36, sm: 40, md: 42 },
            height: { xs: 36, sm: 40, md: 42 },
            minWidth: { xs: 36, sm: 40, md: 42 },
            bgcolor: "rgba(145, 158, 171, 0.2)",
            transform: "none",
          }}
        />
      </Box>
    </Box>
  );
}
