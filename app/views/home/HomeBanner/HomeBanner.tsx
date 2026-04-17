"use client";

/* ======================================================
   IMPORT
====================================================== */
import { useState, useRef, useEffect } from "react";
import type { Swiper as SwiperType } from "swiper";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

import Image from "next/image";
import { Box } from "@mui/material";

import DotSlider from "@/app/components/ui/DotSlider/DotSlider";

/* ======================================================
   DESKTOP BANNER
====================================================== */
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

/* ======================================================
   MOBILE BANNER
====================================================== */
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
   COMPONENT
====================================================== */
export default function HomeBanner() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "var(--main-blue-500)",
      }}
    >
      {/* ======================================================
         DESKTOP
      ====================================================== */}
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <Swiper
          modules={[Autoplay]}
          slidesPerView={1}
          loop
          grabCursor
          speed={800}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.realIndex);
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            setActiveIndex(swiper.realIndex);
          }}
        >
          {bannersPC.map((src, index) => (
            <SwiperSlide key={`pc-${index}`}>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "3840 / 1191",
                }}
              >
                <Image
                  src={src}
                  alt={`banner-pc-${index}`}
                  fill
                  priority={index === 0}
                  quality={90}

                  /* ======================================================
                     FIX WARNING
                     desktop banner กว้างเต็มจอเฉพาะ md+
                  ====================================================== */
                  sizes="(max-width: 899px) 0px, 100vw"

                  draggable={false}
                  style={{
                    objectFit: "cover",
                    userSelect: "none",
                    WebkitUserDrag: "none",
                  }}
                />
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>

      {/* ======================================================
         MOBILE
      ====================================================== */}
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <Swiper
          modules={[Autoplay]}
          slidesPerView={1}
          loop
          grabCursor
          speed={800}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.realIndex);
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            setActiveIndex(swiper.realIndex);
          }}
        >
          {bannersMobile.map((src, index) => (
            <SwiperSlide key={`mobile-${index}`}>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "768 / 1032",
                }}
              >
                <Image
                  src={src}
                  alt={`banner-mobile-${index}`}
                  fill
                  priority={index === 0}
                  quality={90}

                  /* ======================================================
                     FIX WARNING
                     mobile แสดงเฉพาะต่ำกว่า md
                  ====================================================== */
                  sizes="(max-width: 899px) 100vw, 0px"

                  draggable={false}
                  style={{
                    objectFit: "cover",
                    userSelect: "none",
                    WebkitUserDrag: "none",
                  }}
                />
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>

      {/* ======================================================
         DOT SLIDER
      ====================================================== */}
      {mounted && (
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            bottom: { xs: 14, md: 22 },
            zIndex: 10,
            px: 2,
            py: 1,
            borderRadius: "999px",
          }}
        >
          <DotSlider
            total={9}
            activeIndex={activeIndex}
            onClick={(index) => {
              swiperRef.current?.slideToLoop(index);
            }}
          />
        </Box>
      )}
    </Box>
  );
}