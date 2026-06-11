"use client";

import { Box, Skeleton } from "@mui/material";

type TabsSkeletonProps = {
  count?: number;
  gap?: number;
};

export default function TabsSkeleton({
  count = 3,
  gap = 6,
}: TabsSkeletonProps) {
  return (
    <>
      <Box
        sx={{
          display: { xs: "flex", sm: "none" },
          justifyContent: "flex-start",
          width: "100%",
          mb: 5,
          px: 2,
        }}
      >
        <Skeleton
          variant="rounded"
          animation="wave"
          sx={{
            width: "min(100%, 280px)",
            height: 42,
            borderRadius: "999px",
            bgcolor: "rgba(145, 158, 171, 0.16)",
            transform: "none",
          }}
        />
      </Box>

      <Box
        sx={{
          display: { xs: "none", sm: "flex" },
          justifyContent: "center",
          width: "100%",
          mb: 5,
          px: { sm: 2, md: 0 },
          overflowX: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: `${gap}px`,
            borderRadius: "999px",
            border: "1px solid var(--gray-100)",
            background: "#fff",
            width: "fit-content",
            maxWidth: "100%",
            flexShrink: 0,
            p: `${gap}px`,
          }}
        >
          {Array.from({ length: count }).map((_, index) => (
            <Box
              key={index}
              sx={{
                px: { sm: 4, md: 5 },
                py: { sm: 1.25, md: 1.5 },
                minWidth: "max-content",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "999px",
                bgcolor:
                  index === 0
                    ? "rgba(240, 246, 255, 0.9)"
                    : "transparent",
              }}
            >
              <Skeleton
                variant="rounded"
                animation="wave"
                sx={{
                  width: index === count - 1
                    ? { sm: 80, md: 120 }
                    : { sm: 58, md: 78 },
                  height: 20,
                  borderRadius: "999px",
                  bgcolor:
                    index === 0
                      ? "rgba(145, 158, 171, 0.22)"
                      : "rgba(145, 158, 171, 0.16)",
                  transform: "none",
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
}
