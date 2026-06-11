"use client";

import { Box, Container, Skeleton } from "@mui/material";

export default function NewsBannerSkeleton() {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: {
          xs: "calc(100svh - 86px)",
          sm: 680,
          md: 420,
          lg: 520,
        },
        overflow: "hidden",
        background:
          "linear-gradient(120deg, rgba(31, 55, 99, 0.95), rgba(219, 230, 244, 0.86))",
      }}
    >
      <Skeleton
        variant="rectangular"
        animation="wave"
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          transform: "none",
          opacity: 0.22,
        }}
      />

      <Container
        maxWidth="xl"
        sx={{
          position: "relative",
          zIndex: 1,
          height: "100%",
          minHeight: "inherit",
          display: "grid",
          alignItems: "center",
          px: { xs: 3, md: 6 },
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 0.88fr" },
            gap: { xs: 3, md: 6 },
            alignItems: "center",
            width: "100%",
          }}
        >
          <Box>
            <Skeleton
              variant="rounded"
              width={130}
              height={36}
              animation="wave"
              sx={{
                borderRadius: "10px",
                bgcolor: "rgba(255,255,255,0.34)",
                mb: 3,
              }}
            />
            <Skeleton
              variant="rounded"
              width="88%"
              height={38}
              animation="wave"
              sx={{ bgcolor: "rgba(255,255,255,0.38)", mb: 1.5 }}
            />
            <Skeleton
              variant="rounded"
              width="72%"
              height={38}
              animation="wave"
              sx={{ bgcolor: "rgba(255,255,255,0.32)", mb: 3 }}
            />
            <Skeleton
              variant="rounded"
              width="94%"
              height={18}
              animation="wave"
              sx={{ bgcolor: "rgba(255,255,255,0.25)", mb: 1 }}
            />
            <Skeleton
              variant="rounded"
              width="76%"
              height={18}
              animation="wave"
              sx={{ bgcolor: "rgba(255,255,255,0.22)", mb: 3 }}
            />
            <Skeleton
              variant="rounded"
              width={150}
              height={44}
              animation="wave"
              sx={{
                borderRadius: "10px",
                bgcolor: "rgba(255,255,255,0.3)",
              }}
            />
          </Box>

          <Skeleton
            variant="rounded"
            animation="wave"
            sx={{
              width: "100%",
              aspectRatio: "16 / 9",
              borderRadius: { xs: "18px", md: "24px" },
              bgcolor: "rgba(255,255,255,0.34)",
              transform: "none",
            }}
          />
        </Box>

        <Box
          sx={{
            position: "absolute",
            left: "50%",
            bottom: { xs: 30, md: 34 },
            transform: "translateX(-50%)",
            display: "flex",
            gap: 1,
            alignItems: "center",
          }}
        >
          <Skeleton
            variant="rounded"
            width={50}
            height={10}
            sx={{ borderRadius: "999px", bgcolor: "var(--yellow-500)" }}
          />
          {[0, 1, 2, 3].map((item) => (
            <Skeleton
              key={item}
              variant="circular"
              width={10}
              height={10}
              sx={{ bgcolor: "rgba(255,255,255,0.35)" }}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
}
