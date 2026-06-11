"use client";

import { Box, Skeleton } from "@mui/material";

type Props = {
  errorCount?: number;
};

export default function ContactInfoSkeleton({ errorCount = 0 }: Props) {
  return (
    <Box
      sx={{
        maxWidth: "1200px",
        mx: "auto",
        px: 2,
        mt: { xs: 4, md: `calc(-96px + ${errorCount * 44}px)` },
        position: "relative",
        zIndex: 2,
        transition: "margin-top 0.25s ease",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: 3,
        }}
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <Box
            key={index}
            sx={{
              background: "#fff",
              p: 3,
              borderRadius: "20px",
              textAlign: "center",
              boxShadow:
                index === 1
                  ? "0 25px 60px rgba(28,53,99,0.25)"
                  : "0 15px 35px rgba(28,53,99,0.15)",
              transform: {
                xs: "none",
                md: index === 1 ? "translateY(-10px)" : "none",
              },
            }}
          >
            <Skeleton
              variant="circular"
              sx={{
                width: 70,
                height: 70,
                mx: "auto",
                mb: 2,
                bgcolor: "rgba(28,53,99,0.16)",
              }}
            />
            <Skeleton
              variant="text"
              sx={{
                width: "42%",
                mx: "auto",
                mb: 1,
                fontSize: "22px",
                bgcolor: "rgba(28,53,99,0.14)",
              }}
            />
            <Skeleton
              variant="text"
              sx={{
                width: "72%",
                mx: "auto",
                fontSize: "16px",
                bgcolor: "rgba(28,53,99,0.10)",
              }}
            />
            <Skeleton
              variant="text"
              sx={{
                width: "62%",
                mx: "auto",
                fontSize: "16px",
                bgcolor: "rgba(28,53,99,0.10)",
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
