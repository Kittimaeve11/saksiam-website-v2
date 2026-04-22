"use client";

/* ====================================================== */
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Box, IconButton } from "@mui/material";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import DotSlider from "@/app/components/ui/DotSlider/DotSlider";

/* ====================================================== */
type SliderProps = {
  banners: string[];
  ratio: string;
  isMobile: boolean;
};

/* ====================================================== */
const bannersPC: string[] = [
  "/Banner/SAKHomebanber/SAKHomebanber1.jpg",
  "/Banner/SAKHomebanber/SAKHomebanber2.jpg",
  "/Banner/SAKHomebanber/SAKHomebanber3.jpg",
  "/Banner/SAKHomebanber/SAKHomebanber4.jpg",
  "/Banner/SAKHomebanber/SAKHomebanber5.jpg",
  "/Banner/SAKHomebanber/SAKHomebanber6.jpg",
  "/Banner/SAKHomebanber/SAKHomebanber7.jpg",
  "/Banner/SAKHomebanber/SAKHomebanber8.jpg",
  "/Banner/SAKHomebanber/SAKHomebanber9.jpg",
];

const bannersMobile: string[] = [
  "/Banner/SAKHomebanber/Mobile/2024-06-28BannerAgri0767_rp.jpg",
  "/Banner/SAKHomebanber/Mobile/2024-06-28BannerDrone0767_rp.jpg",
  "/Banner/SAKHomebanber/Mobile/2024-06-28BannerLand0767_rp.jpg",
  "/Banner/SAKHomebanber/Mobile/2024-06-28BannerNano0767_rp.jpg",
  "/Banner/SAKHomebanber/Mobile/2024-06-28BannerPer0767_rp.jpg",
  "/Banner/SAKHomebanber/Mobile/2024-06-28bannerSolarcrooftop0767_rp.jpg",
  "/Banner/SAKHomebanber/Mobile/2025-12-25banner251268_01_rp.jpg",
  "/Banner/SAKHomebanber/Mobile/2025-12-25banner251268_02_rp.jpg",
];

/* ====================================================== */
function FadeSlider({ banners, ratio }: SliderProps) {
  const [index, setIndex] = useState(0);
  const isAnimating = useRef(false);

  const startX = useRef(0);
  const isDragging = useRef(false);

  /* ======================================================
      PRELOAD (กันขาว)
  ====================================================== */
  useEffect(() => {
    banners.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, [banners]);

  /* ====================================================== */
  const next = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    setIndex((prev) => (prev + 1) % banners.length);

    setTimeout(() => (isAnimating.current = false), 400);
  };

  const prev = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    setIndex((prev) =>
      prev === 0 ? banners.length - 1 : prev - 1
    );

    setTimeout(() => (isAnimating.current = false), 400);
  };

  /* ====================================================== */
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!isDragging.current) return;

      const diff = startX.current - e.clientX;

      if (diff > 60) {
        next();
        isDragging.current = false;
      }
      if (diff < -60) {
        prev();
        isDragging.current = false;
      }
    };

    const handleUp = () => {
      isDragging.current = false;
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [index]);

  const handleMouseDown = (e: React.MouseEvent) => {
    startX.current = e.clientX;
    isDragging.current = true;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = startX.current - e.changedTouches[0].clientX;

    if (diff > 50) next();
    if (diff < -50) prev();
  };

  return (
    <Box
      sx={{
        width: "100%",
        position: "relative",
        aspectRatio: ratio,
        overflow: "hidden",
        touchAction: "pan-y",
        userSelect: "none",
        WebkitUserSelect: "none",
        backgroundColor: "#000",
      }}
      onMouseDown={handleMouseDown}
      onMouseLeave={() => (isDragging.current = false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {banners.map((src, i) => (
        <Box
          key={i}
          sx={{
            position: "absolute",
            inset: 0,
            opacity: i === index ? 1 : 0,
            transition: "opacity 0.4s ease",
            zIndex: i === index ? 2 : 1,
          }}
        >
          <Image
            src={src}
            alt={`banner-${i}`}
            fill
            priority
            quality={75}
            sizes="(max-width: 900px) 100vw, 100vw" //  FIX warning
            draggable={false}
            style={
              {
                objectFit: "cover",
                pointerEvents: "none",
                userSelect: "none",
                WebkitUserDrag: "none",
              } as React.CSSProperties
            }
          />
        </Box>
      ))}

      <IconButton onClick={prev} sx={arrowLeft}>
        <IoIosArrowBack />
      </IconButton>

      <IconButton onClick={next} sx={arrowRight}>
        <IoIosArrowForward />
      </IconButton>

      <Box sx={dotWrap}>
        <DotSlider
          total={banners.length}
          activeIndex={index}
          onClick={(i) => setIndex(i)}
        />
      </Box>
    </Box>
  );
}

/* ====================================================== */
const arrowLeft = {
  position: "absolute",
  top: "50%",
  left: 12,
  transform: "translateY(-50%)",
  bgcolor: "rgba(0,0,0,0.4)",
  color: "#fff",
  zIndex: 10,
};

const arrowRight = {
  position: "absolute",
  top: "50%",
  right: 12,
  transform: "translateY(-50%)",
  bgcolor: "rgba(0,0,0,0.4)",
  color: "#fff",
  zIndex: 10,
};

const dotWrap = {
  position: "absolute",
  bottom: 16,
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 10,
};

/* ====================================================== */
export default function HomeBanner() {
  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <FadeSlider banners={bannersPC} ratio="3840 / 1191" isMobile={false} />
      </Box>

      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <FadeSlider banners={bannersMobile} ratio="768 / 1032" isMobile />
      </Box>
    </Box>
  );
}