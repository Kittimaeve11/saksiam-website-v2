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

import DotSlider from "@/app/components/ui/DotSlider/DotSlider";
import NewsCard from "@/app/components/cards/NewsCard/NewsCard";
/* ====================================================== */
import { useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { useLocale } from "@/app/providers/LocaleContext";

/* ====================================================== */
type Props = {
  data: any[];
};

/* ====================================================== */
export default function ActivitySection({ data }: Props) {
  const router = useRouter(); // ใช้ route

  const activities = data.filter(
    (item) => item.categoryTH === "กิจกรรม"
  );

  const [active, setActive] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);
  const { messages } = useLocale();

  /* ======================================================
     แบ่ง slide
  ====================================================== */
  const chunkSize = 3;
  const slides = [];

  for (let i = 0; i < activities.length; i += chunkSize) {
    slides.push(activities.slice(i, i + chunkSize));
  }

  /* ======================================================
     CLICK VIEW ALL
  ====================================================== */
  const handleViewAll = () => {
    router.push("/news-activities?tab=activity"); // ส่ง param ไปด้วย
  };

  /* ====================================================== */
  return (
    <Box sx={{ mt: 6 }}>
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
          }}
        >
          {messages.news.activities}
        </Typography>

        <Typography
          onClick={handleViewAll}
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
         SLIDER
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
                    md: "1fr 1fr 2fr",
                  },
                  gap: 3,
                }}
              >
                {/* การ์ดเล็ก */}
                {group.slice(0, 2).map((item) => (
                  <NewsCard
                    key={item.id}
                    item={item}
                    variant="simple"
                  />
                ))}

                {/* การ์ดใหญ่ */}
                {group[2] && (
                  <NewsCard
                    item={group[2]}
                    variant="overlay"
                  />
                )}
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