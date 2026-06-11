"use client";

/* ====================================================== */
import { Card, Skeleton, Box } from "@mui/material";

/* ====================================================== */
type Props = {
  type?: "main" | "preview";
};

/* ====================================================== */
export default function VideoCardSkeleton({
  type = "main",
}: Props) {
  const isPreview = type === "preview";

  return (
    <Card
      elevation={0}
      sx={{
        width: isPreview ? { xs: 180, lg: 380 } : "100%",
        maxWidth: isPreview ? undefined : 530,

        position: "relative",
        borderRadius: "20px",
        overflow: "hidden",

        /* ======================================================
           FIXED 16:9 RATIO
        ====================================================== */
        aspectRatio: "16 / 9",

        /* ======================================================
           SHADOW
        ====================================================== */
        boxShadow: "0 18px 45px rgba(0,0,0,0.18)",

        ...(isPreview && {
          transform: "scale(0.9)",
        }),
      }}
    >
      {/* ======================================================
          THUMBNAIL SKELETON
      ====================================================== */}
      <Skeleton
        variant="rectangular"
        animation="wave"
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          borderRadius: 0,
        }}
      />

      {/* ======================================================
          PLAY BUTTON SKELETON
      ====================================================== */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 2,
        }}
      >
        <Skeleton
          variant="rounded"
          animation="wave"
          width={60}
          height={40}
          sx={{
            borderRadius: "10px",
          }}
        />
      </Box>
    </Card>
  );
}