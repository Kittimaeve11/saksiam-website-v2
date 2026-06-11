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
};

export type HomeBannerItem = {
  id: number;
  pc: string;
  mobile: string;
  link?: string;
};

const isRemoteImage = (src: string) =>
  src.startsWith("http://") || src.startsWith("https://");

/* ====================================================== */
function FadeSlider({ banners, ratio }: SliderProps) {
  const slides = [banners[banners.length - 1], ...banners, banners[0]];

  const [index, setIndex] = useState(1);
  const [enableTransition, setEnableTransition] = useState(true);

  const startX = useRef(0);
  const isDragging = useRef(false);

  const isSliding = useRef(false);
  const isAnimating = useRef(false);

  const autoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ====================================================== */
  const resetAutoplay = () => {
    if (autoTimer.current) clearTimeout(autoTimer.current);

    autoTimer.current = setTimeout(() => {
      if (!isSliding.current) {
        isSliding.current = true;
        setIndex((prev) => prev + 1);
      }
    }, 5000);
  };

  useEffect(() => {
    resetAutoplay();
    return () => {
      if (autoTimer.current) clearTimeout(autoTimer.current);
    };
  }, []);

  /* ======================================================
     🔥 FIX LOOP + NO WHITE SCREEN
  ====================================================== */
  const handleTransitionEnd = () => {
    isSliding.current = false;
    isAnimating.current = false;

    if (index === slides.length - 1) {
      setEnableTransition(false);
      requestAnimationFrame(() => setIndex(1));
      return;
    }

    if (index === 0) {
      setEnableTransition(false);
      requestAnimationFrame(() =>
        setIndex(slides.length - 2)
      );
      return;
    }

    resetAutoplay();
  };

  useEffect(() => {
    if (!enableTransition) {
      requestAnimationFrame(() => {
        setEnableTransition(true);
      });
    }
  }, [enableTransition]);

  /* ====================================================== */
  const goNext = () => {
    if (isAnimating.current) return;

    isAnimating.current = true;
    isSliding.current = true;

    setIndex((prev) => prev + 1);
    resetAutoplay();
  };

  const goPrev = () => {
    if (isAnimating.current) return;

    isAnimating.current = true;
    isSliding.current = true;

    setIndex((prev) => prev - 1);
    resetAutoplay();
  };

  /* ======================================================
     🔥 FIX SWIPE FREEZE
  ====================================================== */
  const handleStart = (x: number) => {
    startX.current = x;
    isDragging.current = true;

    if (autoTimer.current) clearTimeout(autoTimer.current);
  };

  const handleEnd = (x: number) => {
    if (!isDragging.current) return;

    const diff = startX.current - x;

    if (Math.abs(diff) > 50 && !isAnimating.current) {
      isAnimating.current = true;
      isSliding.current = true;

      setIndex((prev) => (diff > 0 ? prev + 1 : prev - 1));
    }

    isDragging.current = false;
    resetAutoplay();
  };

  /* ====================================================== */
  return (
    <Box
      sx={{
        width: "100%",
        position: "relative",
        aspectRatio: ratio,
        overflow: "hidden",
        backgroundColor: "#243865",

        userSelect: "none",
        WebkitUserSelect: "none",
      }}
      onMouseDown={(e) => handleStart(e.clientX)}
      onMouseUp={(e) => handleEnd(e.clientX)}
      onTouchStart={(e) => handleStart(e.touches[0].clientX)}
      onTouchEnd={(e) => handleEnd(e.changedTouches[0].clientX)}
    >
      <Box
        onTransitionEnd={handleTransitionEnd}
        sx={{
          display: "flex",
          height: "100%",
          transform: `translateX(-${index * 100}%)`,
          transition: enableTransition ? "transform 0.5s ease" : "none",
          willChange: "transform", // 🔥 GPU FIX
        }}
      >
        {slides.map((src, i) => (
          <Box key={i} sx={{ flex: "0 0 100%", backgroundColor: "#243865" }}>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: "calc(100% + 2px)",
                mt: "-1px",
                backgroundColor: "#243865",
              }}
            >
              <Image
                src={src}
                alt=""
                fill
                unoptimized={isRemoteImage(src)}

                priority
                loading="eager"

                sizes="(max-width: 768px) 100vw, 1200px"

                draggable={false}
                style={{
                  objectFit: "cover",
                  backfaceVisibility: "hidden",
                  transform: "translateZ(0)",
                }}
              />

            </Box>
          </Box>
        ))}
      </Box>

      <Box onClick={goPrev} sx={clickLeft} />
      <Box onClick={goNext} sx={clickRight} />

      <IconButton onClick={goPrev} sx={arrowLeft}>
        <IoIosArrowBack />
      </IconButton>

      <IconButton onClick={goNext} sx={arrowRight}>
        <IoIosArrowForward />
      </IconButton>

      <Box sx={dotWrap}>
        <DotSlider
          total={banners.length}
          activeIndex={(index - 1 + banners.length) % banners.length}
          onClick={(i) => {
            if (isAnimating.current) return;

            const current = (index - 1 + banners.length) % banners.length;

            isAnimating.current = true;
            isSliding.current = true;

            // 🔥 ถ้ากด “ย้อนหลัง” → ให้วิ่งไปข้างหน้าแทน
            if (i < current) {
              setIndex((prev) => prev + (banners.length - (current - i)));
            } else {
              setIndex((prev) => prev + (i - current));
            }

            resetAutoplay();
          }}
        />
      </Box>
    </Box>
  );
}

/* ====================================================== */


const clickLeft = {
  position: "absolute",
  left: 0,
  top: 0,

  width: "180px",
  height: "100%",

  zIndex: 5,
  cursor: "pointer",

  display: { xs: "none", md: "block" },

  opacity: 0,

  transform: "scaleX(0.33)",
  transformOrigin: "left center",

  background:
    "linear-gradient(to right, rgba(0,0,0,0.25), transparent)",

  transition:
    "transform 0.45s cubic-bezier(0.22,1,0.36,1), opacity 0.45s ease",

  "&:hover": {
    opacity: 1,
    transform: "scaleX(1)",
  },
};

const clickRight = {
  position: "absolute",
  right: 0,
  top: 0,

  width: "180px",
  height: "100%",

  zIndex: 5,
  cursor: "pointer",

  display: { xs: "none", md: "block" },

  opacity: 0,

  transform: "scaleX(0.33)",
  transformOrigin: "right center",

  background:
    "linear-gradient(to left, rgba(0,0,0,0.25), transparent)",

  transition:
    "transform 0.45s cubic-bezier(0.22,1,0.36,1), opacity 0.45s ease",

  "&:hover": {
    opacity: 1,
    transform: "scaleX(1)",
  },
};

const arrowLeft = {
  position: "absolute",
  top: "50%",
  left: 25,
  transform: "translateY(-50%)",
  color: "#ffffffb4",
  zIndex: 10,
};

const arrowRight = {
  position: "absolute",
  top: "50%",
  right: 25,
  transform: "translateY(-50%)",
  color: "#ffffffb4",
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
export default function HomeBanner({ banners }: { banners: HomeBannerItem[] }) {
  const pcBanners = banners.map((item) => item.pc).filter(Boolean);
  const mobileApiBanners = banners.map((item) => item.mobile || item.pc).filter(Boolean);

  if (!pcBanners.length && !mobileApiBanners.length) return null;

  return (
    <Box sx={{ width: "100%", overflow: "hidden", backgroundColor: "#243865" }}>
      {!!pcBanners.length && (
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <Box className="fade-in">
            <FadeSlider banners={pcBanners} ratio="3840 / 1191" />
          </Box>
        </Box>
      )}

      {!!mobileApiBanners.length && (
        <Box sx={{ display: { xs: "block", md: "none" } }}>
          <Box className="fade-in">
            <FadeSlider banners={mobileApiBanners} ratio="678 / 1032" />
          </Box>
        </Box>
      )}
    </Box>
  );
}
