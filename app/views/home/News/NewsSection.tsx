"use client";

/* ====================================================== */
import { useEffect, useRef, useState } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import NewsCard from "@/app/components/cards/NewsCard/NewsCard";
import { IoIosArrowForward } from "react-icons/io";
import { useLocale } from "@/app/providers/LocaleContext";

/* 🔥 DOT */
import DotSlider from "@/app/components/ui/DotSlider/DotSlider";

/* SWIPER */
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Link from "next/link";

/* ====================================================== */
type News = {
  id: number;

  categoryTH: string;
  categoryEN: string;

  titleTH: string;
  titleEN: string;

  detailTH: string;
  detailEN: string;

  createdAt: string;
  images: string[];
};

/* ====================================================== */
export default function NewsSection() {
  const [news, setNews] = useState<News[]>([]);
  const [activeIndex, setActiveIndex] = useState(0); // 🔥 index ของ "หน้า"
  const swiperRef = useRef<any>(null);
  const { messages, locale } = useLocale();

  /* ====================================================== */
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/new");
        const data = await res.json();
        setNews(data.news || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNews();
  }, []);

  /* ======================================================
     🔥 จำนวนหน้า (2 การ์ด / หน้า)
  ====================================================== */
  const totalPages = Math.ceil(news.length / 2);

  /* ====================================================== */
  return (
    <Box sx={{ position: "relative", py: 8 }}>

      {/* 🔵 BLUE BG */}
      <Box
        sx={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "46%",
          height: "100%",
          background: "linear-gradient(180deg, #243865, #2669CD)",
          borderRadius: "0 40px 40px 0",
          zIndex: 1,
        }}
      />

      {/* CONTENT */}
      <Container maxWidth="lg" disableGutters sx={{ position: "relative", zIndex: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>

          {/* ================= LEFT ================= */}
          <Box
            sx={{
              width: 460,
              flexShrink: 0,
              color: "#fff",

              display: "flex",
              flexDirection: "column",
              justifyContent: "center",

              px: 0,
              py: 2, // 🔥 เพิ่มความสูง

              gap: 15, // 🔥 spacing สวยขึ้น
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                lineHeight: 1.3,
                letterSpacing: "-0.5px",
              }}
            >
              <Box component="span" sx={{ fontSize: 64, display: "block" }}>
                {messages.home.follow_news_1}
              </Box>

              <Box component="span" sx={{ fontSize: 48, display: "block" }}>
                {messages.home.follow_news_2}
              </Box>

              <Box component="span" sx={{ fontSize: 48, display: "block" }}>
                {messages.home.follow_news_3}
              </Box>
            </Typography>

            <Button
              component={Link}
              href="/news"
              sx={{
                mt: 2,
                alignSelf: "flex-start",

                display: "flex",
                alignItems: "center",
                gap: "4px",

                borderRadius: "16px",
                border: "2px solid rgba(255,255,255,0.8)",
                color: "#fff",

                px: 6,
                py: 1,

                fontSize: 16,
                fontWeight: 500,

                textTransform: "none",
                backdropFilter: "blur(4px)",
                transition: "all .25s ease",

                "&:hover": {
                  background: "rgba(255,255,255,0.1)",
                  borderColor: "#fff",
                },
              }}
            >
              {messages.home.view_all_news}
              <IoIosArrowForward size={16} />
            </Button>
          </Box>

          {/* ================= RIGHT ================= */}
          <Box
            sx={{
              width: "calc(100% - 400px)",
              ml: "-50px",
            }}
          >
            {/* 🔥 กันเงาหาย */}
            <Box sx={{ py: 2 }}>
              <Swiper
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}
                slidesPerView={2}
                spaceBetween={2}
                onSlideChange={(swiper) => {
                  // 🔥 แปลง slide → page
                  setActiveIndex(Math.floor(swiper.realIndex / 2));
                }}
              >
                {news.map((item) => (
                  <SwiperSlide key={item.id}>
                    <Box sx={{ px: 2, py: 2 }}>
                      <NewsCard item={item} />
                    </Box>
                  </SwiperSlide>
                ))}
              </Swiper>
            </Box>

            {/* ================= DOT ================= */}
            <Box sx={{ mt: 2 }}>
              <DotSlider
                total={totalPages}
                activeIndex={activeIndex}
                onClick={(pageIndex: number) => {
                  // 🔥 page → slide
                  swiperRef.current?.slideTo(pageIndex * 2);
                }}
              />
            </Box>
          </Box>

        </Box>
      </Container>
    </Box>
  );
}