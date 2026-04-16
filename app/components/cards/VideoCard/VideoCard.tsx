"use client";

/* ====================================================== */
import { Box } from "@mui/material";
import Image from "next/image";

/* ====================================================== */
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

  return (
    <Box
      onClick={onClick}
      sx={{
        width: isPreview ? { xs: 180, md: 380 } : "100%",
        maxWidth: isPreview ? undefined : 530,
        position: "relative",
        borderRadius: "20px",
        overflow: "hidden",
        cursor: isPreview ? "pointer" : "default",

        /*  ใช้ padding-top แทน aspectRatio (เสถียรกว่า) */
        pt: "56.25%", // 16:9

        ...(isPreview && {
          transform: "scale(0.9)",
          filter: "brightness(0.5)",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "scale(1)",
            filter: "brightness(1)",
          },
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
            sizes="(max-width: 768px) 180px, 380px"
            style={{
              objectFit: "cover",
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
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: 0,
          }}
        />
      )}
    </Box>
  );
}