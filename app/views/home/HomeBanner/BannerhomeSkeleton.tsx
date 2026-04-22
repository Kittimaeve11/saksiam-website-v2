"use client";

/* ====================================================== */
import { Box, Skeleton } from "@mui/material";

/* ====================================================== */
type Props = {
  ratio?: string;
};

/* ====================================================== */
export default function BannerhomeSkeleton({
  ratio = "3840 / 1191",
}: Props) {
  return (
    <Box
      sx={{
        width: "100%",
        position: "relative",
        aspectRatio: ratio,
        overflow: "hidden",
      }}
    >
      {/* ======================================================
         MAIN IMAGE SKELETON
      ====================================================== */}
      <Skeleton
        variant="rectangular"
        animation="wave"
        sx={{
          width: "100%",
          height: "100%",
          borderRadius: 0,
        }}
      />
    </Box>
  );
}