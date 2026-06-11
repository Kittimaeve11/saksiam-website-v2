"use client";

/* ====================================================== */
import { Box, Card } from "@mui/material";
import Image from "next/image";
import VideoCardSkeleton from "./VideoCardskeleton";

type Props = {
  videoId?: string;
  videoUrl?: string;
  type?: "main" | "preview";
  onClick?: () => void;
};

/* ====================================================== */
export default function VideoCard({
  videoId,
  videoUrl,
  type = "main",
  onClick,
}: Props) {
  const isPreview = type === "preview";

  /* ======================================================
     LOADING STATE
  ====================================================== */
  const isLoading =
    (isPreview && !videoId?.trim()) ||
    (!isPreview && !videoUrl?.trim());

  if (isLoading) {
    return <VideoCardSkeleton type={type} />;
  }

  // const isLoading = true;

  // if (isLoading) {
  //   return <VideoCardSkeleton type={type} />;
  // }  


  return (
    <Card
      onClick={onClick}
      elevation={0}
      sx={{
        width: isPreview ? { xs: 180, lg: 380 } : "100%",
        maxWidth: isPreview ? undefined : 530,

        position: "relative",
        borderRadius: "20px",
        overflow: "hidden",

        aspectRatio: "16 / 9",

        bgcolor: "#000",

        boxShadow: "0 18px 45px rgba(0,0,0,0.18)",

        ...(isPreview && {
          filter: "brightness(0.5)",
          transition: "all .3s ease",
        }),
      }}
    >

      {/* ================= PREVIEW ================= */}
      {isPreview && videoId && (
        <>
          <Image
            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
            alt="thumbnail"
            fill
            draggable={false}
            sizes="(max-width: 768px) 180px, 380px"
            style={{
              objectFit: "cover",
              userSelect: "none",
            }}
            priority={false}
          />

          {/* ▶ PLAY BUTTON */}
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 60,
              height: 40,
              borderRadius: "10px",
              background: "#FF0000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2,
              boxShadow: "0 8px 18px rgba(0,0,0,0.2)",
            }}
          >
            <Box
              sx={{
                width: 0,
                height: 0,
                borderTop: "8px solid transparent",
                borderBottom: "8px solid transparent",
                borderLeft: "14px solid white",
                ml: "2px",
              }}
            />
          </Box>
        </>
      )}

      {/* ================= MAIN VIDEO ================= */}
      {!isPreview && videoUrl && (
        <Box
          component="iframe"
          src={videoUrl}
          title="video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          sx={{
            position: "absolute",
            inset: "-2px",
            width: "calc(100% + 4px)",
            height: "calc(100% + 4px)",
            border: 0,
            display: "block",
          }}
        />
      )}
    </Card>
  );
}
