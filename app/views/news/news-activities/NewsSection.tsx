"use client";

/* ====================================================== */
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

/* ====================================================== */
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";

/* ====================================================== */
import NewsCard from "@/app/components/cards/NewsCard/NewsCard";
import DotSlider from "@/app/components/ui/DotSlider/DotSlider";

/* ====================================================== */
import { useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { useLocale } from "@/app/providers/LocaleContext";

/* ====================================================== */
type Props = {
  data: any[];
};

/* ====================================================== */
export default function NewsSection({ data }: Props) {
  const router = useRouter(); // 🔥 เพิ่ม router
  const { messages } = useLocale();

  const newsOnly = data.filter(
    (item) => item.categoryTH === "ข่าวสาร"
  );

  const [active, setActive] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  /* ======================================================
     🔥 แบ่ง slide
  ====================================================== */
  const chunkSize = 3;
  const slides = [];

  for (let i = 0; i < newsOnly.length; i += chunkSize) {
    slides.push(newsOnly.slice(i, i + chunkSize));
  }

  /* ======================================================
     🔥 CLICK VIEW ALL
  ====================================================== */
  const handleViewAll = () => {
    router.push("/news-activities?tab=news");
  };

  /* ====================================================== */
  return (
    <Box sx={{ mb: 6 }}>
      {/* ================= HEADER ================= */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 3,
          color: "var(--color-primary)",
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: 28, md: 36 },
            fontWeight: 700,
            lineHeight: 1.2,
          }}
        >          {messages.news.title}
        </Typography>

        <Typography
          onClick={handleViewAll} // 🔥 ใส่ onClick
          sx={{
            fontSize: 16,
            color: "var(--color-info)",
            fontWeight: 600,
            cursor: "pointer",
            "&:hover": {
              color: "var(--color-info-hover)",
            },
          }}
        >
          {messages.news.view_all}
        </Typography>
      </Box>

      {/* ======================================================
         🔥 SLIDER
      ====================================================== */}
      <Box sx={{ overflow: "visible" }}>
        <Swiper
          modules={[EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          loop={false}
          grabCursor={true}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => setActive(swiper.realIndex)}
          style={{ overflow: "visible" }}
        >
          {slides.map((group, index) => (
            <SwiperSlide key={index}>
              <Box
                sx={{
                  py: 2,
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    md: "2fr 1fr 1fr",
                  },
                  gap: 3,
                }}
              >
                {/* 🔥 การ์ดใหญ่ */}
                {group[0] && (
                  <NewsCard
                    item={group[0]}
                    variant="overlay"
                  />
                )}

                {/* 🔥 การ์ดเล็ก */}
                {group.slice(1).map((item) => (
                  <NewsCard
                    key={item.id}
                    item={item}
                    variant="simple"
                  />
                ))}
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* ================= DOT ================= */}
        <Box sx={{ mt: 2 }}>
          <DotSlider
            total={slides.length}
            activeIndex={active}
            onClick={(index) =>
              swiperRef.current?.slideTo(index)
            }
          />
        </Box>
      </Box>
    </Box>
  );
}