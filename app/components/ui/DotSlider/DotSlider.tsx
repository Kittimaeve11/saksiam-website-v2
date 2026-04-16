"use client";

/* ======================================================
   TYPES
====================================================== */

type DotSliderProps = {
  total: number;
  activeIndex: number;
  onClick: (index: number) => void;
};

/* ======================================================
   IMPORT
====================================================== */

import { Box } from "@mui/material";

/* ======================================================
   COMPONENT
====================================================== */

export default function DotSlider({
  total,
  activeIndex,
  onClick,
}: DotSliderProps) {
  /* ======================================================
     GUARD (กัน error / render เกิน)
  ====================================================== */

  if (!total || total <= 1) return null;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        gap: "10px",

        /* ❗ สำคัญ: กัน layout ขยับ */
        height: "14px",
      }}
    >
      {Array.from({ length: total }).map((_, index) => {
        const isActive = activeIndex === index;

        return (
          <Box
            key={index}
            role="button"
            aria-label={`go to slide ${index + 1}`}
            onClick={() => {
              if (index !== activeIndex) {
                onClick(index);
              }
            }}
            sx={{
              /* ======================================================
                 SIZE
              ====================================================== */
              width: isActive ? "50px" : "10px",
              height: "10px",
              borderRadius: "999px",

              /* ======================================================
                 COLOR (แก้ให้มองเห็นชัด)
              ====================================================== */
              background: isActive
                ? "linear-gradient(90deg, #FFD10D, #F4C430)"
                : "#97a4bda9",

              opacity: isActive ? 1 : 0.85,

              /* ======================================================
                 BORDER (ช่วยให้ไม่กลืนพื้นหลัง)
              ====================================================== */
              /* ======================================================
                 EFFECT
              ====================================================== */
              /* ======================================================
                 ANIMATION
              ====================================================== */
              transition: "all .3s ease",

              cursor: "pointer",

              /* ======================================================
                 INTERACTION
              ====================================================== */
              "&:hover": {
                opacity: 1,
                transform: "scale(1.1)",
              },

              "&:active": {
                transform: "scale(0.95)",
              },
            }}
          />
        );
      })}
    </Box>
  );
}