"use client";

/* ====================================================== */
import { Card, Box, Skeleton } from "@mui/material";

/* ====================================================== */
export default function ServiceSkeletonCard() {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 7,
        display: "flex",
        flexDirection: "column",

        width: "100%",
        maxWidth: "355px",
        mx: "auto",

        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        border: "transparent",
        gap: 1,
      }}
    >
      {/* ======================================================
          IMAGE
      ====================================================== */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: "4 / 3",
          overflow: "hidden",
        }}
      >
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            width: "100%",
            height: "100%",
          }}
        />
      </Box>

      {/* ======================================================
          CONTENT
      ====================================================== */}
      <Box
        sx={{
          mx: 4,
          my: 1,
          flexGrow: 1,
        }}
      >
        {/* Title */}
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            width: "75%",
            height: 36,
            mb: 1,
          }}
        />



        {/* Description line 2 */}
        <Skeleton
          variant="text"
          animation="wave"
          sx={{
            width: "85%",
            height: 22,
            mb: 3,
          }}
        />

        {/* Button */}
        <Skeleton
          variant="rounded"
          animation="wave"
          sx={{
            width: "100%",
            height: 44,
            borderRadius: 8,
            mb: 1,
          }}
        />
      </Box>
    </Card>
  );
}