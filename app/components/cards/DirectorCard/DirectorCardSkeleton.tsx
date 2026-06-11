"use client";

import { Box, Grid, Skeleton } from "@mui/material";

type Props = {
  featured?: boolean;
};

export default function DirectorCardSkeleton({
  featured = false,
}: Props) {
  const radius = featured
    ? { xs: "46px", md: "58px" }
    : { xs: "34px", md: "44px" };

  return (
    <Grid
      container
      sx={{
        width: "87%",
        maxWidth: featured ? 428 : 342,
        mx: "auto",
        textAlign: "center",
      }}
    >
      <Grid
        size={12}
        sx={{
          position: "relative",
          width: "100%",
          mb: featured ? { xs: 5.25, md: 5.75 } : { xs: 4.25, md: 4.75 },
          overflow: "visible",
        }}
      >
        {/* ====================================================== */}
        {/* CARD */}
        {/* ====================================================== */}

        <Box
          sx={{
            position: "relative",
            width: "100%",
            aspectRatio: "428 / 643",
          }}
        >
          <Skeleton
            variant="rounded"
            animation="wave"
            sx={{
              width: "100%",
              height: "100%",
              borderRadius: radius,
              bgcolor: "rgba(210,215,225,.85)",
            }}
          />

          {/* กรอบบน/ข้าง */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              borderRadius: radius,
              boxShadow: "0 0 0 8px rgba(86,101,161,.22)",
              pointerEvents: "none",
            }}
          />

          {/* ซ่อนขอบล่าง */}
          <Box
            sx={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: -8,
              height: "72px",
              zIndex: 5,
            }}
          />
        </Box>

        {/* ====================================================== */}
        {/* TAG */}
        {/* ====================================================== */}

        <Box
          sx={{
            position: "absolute",
            left: "50%",
            bottom: featured ? { xs: -30, md: -34 } : { xs: -22, md: -26 },
            width: featured
              ? { xs: "118%", md: "140%" }
              : { xs: "114%", md: "140%" },
            aspectRatio: "865 / 188",
            transform: "translateX(-50%)",
            zIndex: 20,
          }}
        >
          {/* เงาซ้าย */}
          <Box
            sx={{
              position: "absolute",
              left: "8%",
              top: "6%",
              width: "72%",
              height: "88%",
              borderRadius: "18px",
              bgcolor: "#aebed3",
              transform: "skewX(-12deg)",
            }}
          />

          {/* เงาขวา */}
          <Box
            sx={{
              position: "absolute",
              right: "8%",
              top: "6%",
              width: "72%",
              height: "88%",
              borderRadius: "18px",
              bgcolor: "#bcc9da",
              transform: "skewX(-12deg)",
            }}
          />

          {/* ป้ายหลัก */}
          <Box
            sx={{
              position: "absolute",
              left: "16%",
              right: "16%",
              top: "8%",
              bottom: "8%",
              borderRadius: "18px",
              bgcolor: "#0b4a95",
              transform: "skewX(-12deg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <Skeleton
              variant="rounded"
              animation="wave"
              sx={{
                width: featured ? "58%" : "52%",
                height: featured ? 16 : 12,
                borderRadius: "999px",
                bgcolor: "#c9d2df",
                transform: "skewX(12deg)",
              }}
            />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}