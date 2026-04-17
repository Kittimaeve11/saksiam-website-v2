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
   BANNER LIST
====================================================== */
const banners: string[] = [
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
   COMPONENT
====================================================== */
export default function HomeBanner() {
  /* ================= STATE ================= */
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);
  const [mounted, setMounted] = useState(false);

  /* ================= MOUNT ================= */
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        overflow: "hidden",
        backgroundColor: "var(--main-blue-500)",
        position: "relative",
      }}
    >
      {/* ======================================================
         SWIPER
      ====================================================== */}
      <Swiper
        modules={[Autoplay]}
        slidesPerView={1}
        loop
        grabCursor
        speed={800} // 🔥 ลื่นขึ้น
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
        {banners.map((src, index) => (
          <SwiperSlide key={index}>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                aspectRatio: "3840 / 1191", // 🔥 fix layout shift
              }}
            >
              <Image
                src={src}
                alt={`banner-${index}`}

                /* ================= NEXT IMAGE ================= */
                fill

                /* โหลดรูปแรกทันที */
                priority={index === 0}

                /* 🔥 แก้ performance + responsive จริง */
                sizes="(max-width: 768px) 100vw, 100vw"

                /* 🔥 ลด blur / flicker */
                quality={90}

                /* 🔥 smooth ขึ้น */
                style={{
                  objectFit: "cover",
                  willChange: "transform",
                }}
              />
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* ======================================================
         DOT SLIDER
      ====================================================== */}
      {mounted && (
        <Box
          sx={{
            position: "absolute",
            bottom: { xs: 10, md: 20 },
            left: "50%",
            transform: "translateX(-50%)",
            px: 2,
            py: 1,
            borderRadius: "999px",
            zIndex: 10,
          }}
        >
          <DotSlider
            total={banners.length}
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