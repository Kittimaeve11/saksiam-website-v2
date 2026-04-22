"use client";

/* ====================================================== */
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Box, IconButton, Skeleton } from "@mui/material";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import DotSlider from "@/app/components/ui/DotSlider/DotSlider";

/* ====================================================== */
type SliderProps = {
  banners: string[];
  ratio: string;
  isMobile?: boolean;
};

/* ======================================================
   SKELETON
====================================================== */
function BannerhomeSkeleton({ ratio }: { ratio: string }) {
  return (
    <Box
      sx={{
        width: "100%",
        aspectRatio: ratio,
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
  );
}

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

/* ======================================================
   SLIDER
====================================================== */
function FadeSlider({ banners, ratio, isMobile = false }: SliderProps) {
  const [index, setIndex] = useState(0);

  const isAnimating = useRef(false);
  const isDragging = useRef(false);
  const startX = useRef(0);

  const isInteracting = useRef(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ======================================================
     PRELOAD
  ====================================================== */
  useEffect(() => {
    banners.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });

    return () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
      if (animationTimer.current) clearTimeout(animationTimer.current);
    };
  }, [banners]);

  /* ======================================================
     AUTO CONTROL
  ====================================================== */
  const pauseAuto = () => {
    isInteracting.current = true;

    if (resumeTimer.current) {
      clearTimeout(resumeTimer.current);
    }

    resumeTimer.current = setTimeout(() => {
      isInteracting.current = false;
    }, 3000);
  };

  /* ======================================================
     NAVIGATION
  ====================================================== */
  const next = () => {
    pauseAuto();

    if (isAnimating.current) return;
    isAnimating.current = true;

    setIndex((prev) => (prev + 1) % banners.length);

    if (animationTimer.current) {
      clearTimeout(animationTimer.current);
    }

    animationTimer.current = setTimeout(() => {
      isAnimating.current = false;
    }, 400);
  };

  const prev = () => {
    pauseAuto();

    if (isAnimating.current) return;
    isAnimating.current = true;

    setIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));

    if (animationTimer.current) {
      clearTimeout(animationTimer.current);
    }

    animationTimer.current = setTimeout(() => {
      isAnimating.current = false;
    }, 400);
  };

  /* ======================================================
     AUTOPLAY + DRAG
  ====================================================== */
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isInteracting.current && !isDragging.current && !isAnimating.current) {
        isAnimating.current = true;

        setIndex((prev) => (prev + 1) % banners.length);

        if (animationTimer.current) {
          clearTimeout(animationTimer.current);
        }

        animationTimer.current = setTimeout(() => {
          isAnimating.current = false;
        }, 400);
      }
    }, 5000);

    const handleMove = (e: MouseEvent) => {
      if (!isDragging.current) return;

      const diff = startX.current - e.clientX;

      if (diff > 40) {
        next();
        isDragging.current = false;
      }

      if (diff < -40) {
        prev();
        isDragging.current = false;
      }
    };

    const handleUp = () => {
      isDragging.current = false;
      pauseAuto();
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);

    return () => {
      clearInterval(interval);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [banners]);

  /* ======================================================
     HANDLERS
  ====================================================== */
  const handleMouseDown = (e: React.MouseEvent) => {
    pauseAuto();
    startX.current = e.clientX;
    isDragging.current = true;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    pauseAuto();
    startX.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = startX.current - e.changedTouches[0].clientX;

    if (diff > 40) next();
    if (diff < -40) prev();

    isDragging.current = false;
    pauseAuto();
  };

  /* ======================================================
     UI
  ====================================================== */
  return (
    <Box
      sx={{
        width: "100%",
        position: "relative",
        aspectRatio: ratio,
        overflow: "hidden",
        userSelect: "none",
        touchAction: "pan-y",
        backgroundColor: "transparent",
      }}
      onMouseDown={handleMouseDown}
      onMouseLeave={() => {
        isDragging.current = false;
      }}
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
            transition: "opacity 0.4s ease-in-out",
            zIndex: i === index ? 2 : 1,
            backgroundColor: "#f5f5f5",
          }}
        >
          <Image
            src={src}
            alt={`banner-${i + 1}`}
            fill
            priority={i < 2}
            quality={75}
            sizes={
              isMobile
                ? "(max-width: 899px) 100vw, 0px"
                : "(min-width: 900px) 100vw, 0px"
            }
            draggable={false}
            style={{
              objectFit: "cover",
              pointerEvents: "none",
            }}
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
          onClick={(i) => {
            pauseAuto();
            setIndex(i);
          }}
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
  zIndex: 999,
};

/* ======================================================
   MAIN COMPONENT
====================================================== */
export default function HomeBanner() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        {loading ? (
          <BannerhomeSkeleton ratio="3840 / 1191" />
        ) : (
          <Box className="fade-in">
            <FadeSlider
              banners={bannersPC}
              ratio="3840 / 1191"
              isMobile={false}
            />
          </Box>
        )}
      </Box>

      <Box sx={{ display: { xs: "block", md: "none" } }}>
        {loading ? (
          <BannerhomeSkeleton ratio="768 / 1032" />
        ) : (
          <Box className="fade-in">
            <FadeSlider
              banners={bannersMobile}
              ratio="768 / 1032"
              isMobile
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}