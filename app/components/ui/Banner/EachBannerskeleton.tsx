"use client";

/* ====================================================== */
import { Box, Skeleton } from "@mui/material";

/* ====================================================== */
const EachBannerSkeleton = () => {
  /* ====================================================== */
  return (
    <Box
      sx={{
        width: "100%",
        position: "relative",
        background: "#fff",
        overflow: "hidden",
        lineHeight: 0,
      }}
    >
      {/* ======================================================
          MOBILE SKELETON
      ====================================================== */}
      <Box
        sx={{
          display: {
            xs: "block",
            md: "none",
          },
        }}
      >
        <Skeleton
          variant="rectangular"
          animation="wave"
          width="100%"
          sx={{
            width: "100%",
            height: "auto",
            aspectRatio: "678 / 1032",

            borderRadius: 0,
            transform: "none",
            display: "block",
          }}
        />
      </Box>

      {/* ======================================================
          PC SKELETON
      ====================================================== */}
      <Box
        sx={{
          display: {
            xs: "none",
            md: "block",
          },
        }}
      >
        <Skeleton
          variant="rectangular"
          animation="wave"
          width="100%"
          sx={{
            width: "100%",
            height: "auto",
            aspectRatio: "3840 / 1191",

            borderRadius: 0,
            transform: "none",
            display: "block",
          }}
        />
      </Box>
    </Box>
  );
};

export default EachBannerSkeleton;
