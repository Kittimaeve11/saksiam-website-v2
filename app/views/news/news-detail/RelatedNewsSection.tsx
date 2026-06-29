"use client";

/* ======================================================
   IMPORT
====================================================== */
import { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";

/* ======================================================
   TYPE
====================================================== */
import type { Swiper as SwiperType } from "swiper";
import NewsCard from "@/app/components/cards/NewsCard/NewsCard";
import DotSlider from "@/app/components/ui/DotSlider/DotSlider";
import { useLocale } from "@/app/providers/LocaleContext";
import type { News } from "@/app/Utils/type";
/* ======================================================
   DATA TYPE
====================================================== */


type Props = {
  data: News[];
  currentId: string | number;
  currentCategory: string;
};

/* ======================================================
   COMPONENT
====================================================== */
export default function RelatedNewsSection({
  data,
  currentId,
  currentCategory,
}: Props) {
  const { messages } = useLocale();

  /* ======================================================
     FILTER ข่าวที่เกี่ยวข้อง
  ====================================================== */
  const related = data
    .filter(
      (item) =>
        item.id !== currentId &&
        (item.categoryTH === currentCategory ||
          item.categoryEN === currentCategory)
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 10);

  /* ======================================================
     SWIPER
  ====================================================== */
  const swiperRef = useRef<SwiperType | null>(null);

  const [activePage, setActivePage] = useState(0);
  const [perPage, setPerPage] = useState(3);

  /* ======================================================
     RESPONSIVE PAGE SIZE
  ====================================================== */
  useEffect(() => {
    const updatePerPage = () => {
      if (window.innerWidth < 600) {
        setPerPage(1);
      } else if (window.innerWidth < 1200) {
        setPerPage(2);
      } else {
        setPerPage(3);
      }
    };

    updatePerPage();

    window.addEventListener(
      "resize",
      updatePerPage
    );

    return () =>
      window.removeEventListener(
        "resize",
        updatePerPage
      );
  }, []);

  const totalPages = Math.ceil(
    related.length / perPage
  );

  /* ======================================================
     EMPTY
  ====================================================== */
  if (related.length === 0) return null;

  /* ======================================================
     RENDER
  ====================================================== */
  return (
    <Box sx={{ mt: { xs: 4, md: 6 } }}>
      {/* ======================================================
         TITLE
      ====================================================== */}
      <Typography
        sx={{
          fontSize: {
            xs: 20,
            md: 22,
          },
          fontWeight: 600,
          color: "var(--color-primary)",
          mb: 2,
        }}
      >
        {messages?.news?.other_news ||
          "ข่าวและกิจกรรมอื่น ๆ"}
      </Typography>

      {/* ======================================================
         SWIPER
      ====================================================== */}
      <Box>
        <Swiper
          modules={[Navigation]}
          spaceBetween={16}
          watchOverflow
          centeredSlides={false}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            const currentPerPage =
              Number(swiper.params.slidesPerGroup) || 1;

            const pageIndex = Math.floor(
              swiper.activeIndex / currentPerPage
            );

            setActivePage(pageIndex);
          }}
          breakpoints={{
            0: {
              slidesPerView: 1,
              slidesPerGroup: 1,
            },

            600: {
              slidesPerView: 2,
              slidesPerGroup: 2,
            },

            900: {
              slidesPerView: 2,
              slidesPerGroup: 2,
            },

            1200: {
              slidesPerView: 3,
              slidesPerGroup: 3,
            },
          }}
          style={{
            paddingBottom: "4px",
          }}
        >
          {related.map((item) => (
            <SwiperSlide
              key={item.id}
              style={{
                display: "flex",
                height: "auto",
              }}
            >
              {/* ======================================================
                 FIX CARD HEIGHT
              ====================================================== */}
              <Box
                sx={{
                  pt: 1,
                  pb: 3,
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                  }}
                >
                  <NewsCard
                    item={item}
                    variant="minimal"
                  />
                </Box>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>

      {/* ======================================================
         DOT SLIDER
      ====================================================== */}
      {totalPages > 1 && (
        <Box sx={{ mt: 2 }}>
          <DotSlider
            total={totalPages}
            activeIndex={activePage}
            onClick={(index) => {
              swiperRef.current?.slideTo(
                index * perPage
              );
            }}
          />
        </Box>
      )}
    </Box>
  );
}