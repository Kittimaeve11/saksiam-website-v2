"use client";

/* ======================================================
   IMPORT
====================================================== */
import { Card, Box, Skeleton } from "@mui/material";

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
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
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
          animation="wave"
          sx={{ width: "100%", height: "100%" }}
        />
      </Box>

      {/* ================= CONTENT ================= */}
      <Box sx={{ px: 4, py: 2 }}>
        {/* TITLE */}
        <Skeleton
          variant="text"
          width="80%"
          height={28}
          sx={{ mb: 1 }}
        />

        {/* DESCRIPTION */}
        <Skeleton variant="text" width="100%" height={18} />
        <Skeleton variant="text" width="90%" height={18} />

        {/* BUTTON */}
        <Skeleton
          variant="rounded"
          height={40}
          sx={{
            mt: 2,
            borderRadius: "999px",
          }}
        />
      </Box>
    </Card>
  );
}