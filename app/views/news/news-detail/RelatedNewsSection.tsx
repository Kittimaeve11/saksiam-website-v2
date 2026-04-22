"use client";

/* ======================================================
   IMPORT
====================================================== */
import { useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules"; // กันบางเวอร์ชัน error
import "swiper/css";

/* ======================================================
   TYPE
====================================================== */
import type { Swiper as SwiperType } from "swiper";
import NewsCard from "@/app/components/cards/NewsCard/NewsCard";
import DotSlider from "@/app/components/ui/DotSlider/DotSlider";
import { useLocale } from "@/app/providers/LocaleContext";

/* ======================================================
   DATA TYPE
====================================================== */
type News = {
  id: number;
  titleTH: string;
  titleEN: string;
  images: string[];
  createdAt: string;
  categoryTH: string;
  categoryEN: string;
  detailTH: string;
  detailEN: string;
};

type Props = {
  data: News[];
  currentId: number;
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
     SWIPER SETUP
  ====================================================== */
  const swiperRef = useRef<SwiperType | null>(null);

  const perPage = 3;
  const totalPages = Math.ceil(related.length / perPage);

  const [activePage, setActivePage] = useState(0);

  /* ======================================================
     EMPTY
  ====================================================== */
  if (related.length === 0) return null;

  /* ======================================================
     RENDER
  ====================================================== */
  return (
    <Box sx={{ mt: 6 }}>
      {/* ================= TITLE ================= */}
      <Typography
        sx={{
          fontSize: 22,
          fontWeight: 600,
          color: "var(--color-primary)",
          mb: 2,
        }}
      >
        {/* กัน undefined */}
        {messages?.news?.other_news || "ข่าวและกิจกรรมอื่น ๆ"}
      </Typography>

      {/* ================= SWIPER ================= */}
      <Box>
        <Swiper
          modules={[Navigation]} // สำคัญ (บางเวอร์ชันต้องมี)
          slidesPerView={3}
          spaceBetween={16}
          slidesPerGroup={3}
          watchOverflow
          centeredSlides={false}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => {
            const pageIndex = Math.floor(swiper.activeIndex / perPage);
            setActivePage(pageIndex);
          }}
          style={{ paddingBottom: "4px" }} // กัน shadow โดนตัด
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
                 FIX HEIGHT CARD เท่ากันทุกใบ
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
                <Box sx={{ flex: 1, display: "flex" }}>
                  <NewsCard item={item} variant="minimal" />
                </Box>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>

      {/* ================= DOT ================= */}
      {totalPages > 1 && (
        <Box sx={{ mt: 2 }}>
          <DotSlider
            total={totalPages}
            activeIndex={activePage}
            onClick={(index) => {
              swiperRef.current?.slideTo(index * perPage);
            }}
          />
        </Box>
      )}
    </Box>
  );
}