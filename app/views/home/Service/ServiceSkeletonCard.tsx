"use client";

/* ======================================================
   IMPORT
====================================================== */
import { Box, Card, Skeleton } from "@mui/material";

/* ======================================================
   COMPONENT
====================================================== */
export default function ServiceSkeletonCard() {
  return (
    <Card
      sx={{
        borderRadius: 7,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
        gap: 1,
      }}
    >
      {/* ================= IMAGE ================= */}
      <Box
        sx={{
          width: "100%",
          aspectRatio: "4 / 3",
        }}
      >
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
        />
      </Box>

      {/* ================= CONTENT ================= */}
      <Box sx={{ px: 4, py: 2 }}>
        {/* TITLE */}
        <Skeleton
          variant="text"
          width="70%"
          height={30}
          sx={{ mb: 1 }}
        />

        {/* DESCRIPTION */}

        <Skeleton
          variant="text"
          width="90%"
          height={20}
          sx={{ mb: 2 }}
        />

        {/* BUTTON */}
        <Skeleton
          variant="rectangular"
          width="100%"
          height={40}
          sx={{ borderRadius: 8 }}
        />
      </Box>
    </Card>
  );
}