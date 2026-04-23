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

/* ====================================================== */
function BannerhomeSkeleton({ ratio }: { ratio: string }) {
  return (
    <Box sx={{ width: "100%", aspectRatio: ratio }}>
      <Skeleton variant="rectangular" animation="wave" sx={{ width: "100%", height: "100%" }} />
    </Box>
  );
}

/* ====================================================== */
const bannersPC = [
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

const bannersMobile = [
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
   🔥 LOOP SLIDER + RESET AUTOPLAY
====================================================== */
function FadeSlider({ banners, ratio, isMobile = false }: SliderProps) {
  const slides = [banners[banners.length - 1], ...banners, banners[0]];

  const [index, setIndex] = useState(1);
  const [enableTransition, setEnableTransition] = useState(true);

  const startX = useRef(0);
  const isDragging = useRef(false);

  const isSliding = useRef(false);
  const autoTimer = useRef<NodeJS.Timeout | null>(null);

  /* ======================================================
     🔥 RESET AUTOPLAY (หัวใจหลัก)
  ====================================================== */
  const resetAutoplay = () => {
    if (autoTimer.current) clearTimeout(autoTimer.current);

    autoTimer.current = setTimeout(() => {
      if (!isSliding.current) {
        isSliding.current = true;
        setIndex((prev) => prev + 1);
      }
    }, 5000);
  };

  /* ======================================================
     START AUTOPLAY
  ====================================================== */
  useEffect(() => {
    resetAutoplay();
    return () => {
      if (autoTimer.current) clearTimeout(autoTimer.current);
    };
  }, []);

  /* ======================================================
     RESET LOOP
  ====================================================== */
  const handleTransitionEnd = () => {
    isSliding.current = false;

    if (index === slides.length - 1) {
      setEnableTransition(false);
      setIndex(1);
    }

    if (index === 0) {
      setEnableTransition(false);
      setIndex(slides.length - 2);
    }

    // 🔥 เริ่ม autoplay ใหม่หลัง slide เสร็จ
    resetAutoplay();
  };

  useEffect(() => {
    if (!enableTransition) {
      requestAnimationFrame(() => {
        setEnableTransition(true);
      });
    }
  }, [enableTransition]);

  /* ======================================================
     CHANGE SLIDE
  ====================================================== */
  const goNext = () => {
    isSliding.current = true;
    setIndex((prev) => prev + 1);
    resetAutoplay();
  };

  const goPrev = () => {
    isSliding.current = true;
    setIndex((prev) => prev - 1);
    resetAutoplay();
  };

  /* ======================================================
     DRAG
  ====================================================== */
  const handleStart = (x: number) => {
    startX.current = x;
    isDragging.current = true;

    if (autoTimer.current) clearTimeout(autoTimer.current); // 🔥 หยุดทันที
  };

  const handleEnd = (x: number) => {
    if (!isDragging.current) return;

    const diff = startX.current - x;

    if (diff > 50) {
      isSliding.current = true;
      setIndex((prev) => prev + 1);
    }

    if (diff < -50) {
      isSliding.current = true;
      setIndex((prev) => prev - 1);
    }

    isDragging.current = false;

    // 🔥 เริ่ม autoplay ใหม่
    resetAutoplay();
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
      }}
      onMouseDown={(e) => handleStart(e.clientX)}
      onMouseUp={(e) => handleEnd(e.clientX)}
      onTouchStart={(e) => handleStart(e.touches[0].clientX)}
      onTouchEnd={(e) => handleEnd(e.changedTouches[0].clientX)}
    >
      {/* TRACK */}
      <Box
        onTransitionEnd={handleTransitionEnd}
        sx={{
          display: "flex",
          height: "100%",
          transform: `translateX(-${index * 100}%)`,
          transition: enableTransition ? "transform 0.5s ease" : "none",
        }}
      >
        {slides.map((src, i) => (
          <Box key={i} sx={{ flex: "0 0 100%" }}>
            <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
              <Image
                src={src}
                alt={`banner-${i}`}
                fill
                priority={i < 3}
                sizes={
                  isMobile
                    ? "(max-width: 899px) 100vw"
                    : "(min-width: 900px) 100vw"
                }
                draggable={false}
                style={{ objectFit: "cover" }}
              />
            </Box>
          </Box>
        ))}
      </Box>

      {/* ARROW */}
      <IconButton onClick={goPrev} sx={arrowLeft}>
        <IoIosArrowBack />
      </IconButton>

      <IconButton onClick={goNext} sx={arrowRight}>
        <IoIosArrowForward />
      </IconButton>

      {/* DOT */}
      <Box sx={dotWrap}>
        <DotSlider
          total={banners.length}
          activeIndex={(index - 1 + banners.length) % banners.length}
          onClick={(i) => {
            isSliding.current = true;
            setIndex(i + 1);
            resetAutoplay();
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

/* ====================================================== */
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
            <FadeSlider banners={bannersPC} ratio="3840 / 1191" />
          </Box>
        )}
      </Box>

      <Box sx={{ display: { xs: "block", md: "none" } }}>
        {loading ? (
          <BannerhomeSkeleton ratio="768 / 1032" />
        ) : (
          <Box className="fade-in">
            <FadeSlider banners={bannersMobile} ratio="768 / 1032" isMobile />
          </Box>
        )}
      </Box>
    </Box>
  );
}