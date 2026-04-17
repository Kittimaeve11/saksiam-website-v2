"use client";

/* ======================================================
   IMPORT
====================================================== */

import { Box, Skeleton } from "@mui/material";

/* ======================================================
   COMPONENT
====================================================== */

export default function BannerHomeSkeleton() {
  return (
    <Box
      sx={{
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)",
        overflow: "hidden",
        position: "relative",
        backgroundColor: "var(--main-blue-500)",
      }}
    >
      {/* ======================================================
          BANNER IMAGE SKELETON
      ====================================================== */}

      <Box
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: "3840 / 1191",
        }}
      >
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          animation="wave"
          sx={{
            bgcolor: "rgba(255,255,255,0.1)",
          }}
        />

       
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton
            key={index}
            variant="rounded"
            animation="wave"
            sx={{
              width: index === 0 ? 30 : 12,
              height: 12,
              borderRadius: "999px",
              bgcolor: "rgba(255,255,255,0.4)",
            }}
          />
        ))}
      </Box>
    </Box>
  );
}