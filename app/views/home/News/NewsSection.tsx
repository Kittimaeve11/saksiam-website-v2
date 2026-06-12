//ศักดิ์สยาม สินเชื่อเพื่อสังคม
"use client";

/* ====================================================== */
import { useCallback, useEffect, useRef, useState } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import NewsCard from "@/app/components/cards/NewsCard/NewsCard";
import NewsCardSkeleton from "@/app/components/cards/NewsCard/NewsCardskeleton";
import { IoIosArrowForward } from "react-icons/io";
import { useLocale } from "@/app/providers/LocaleContext";
import DotSlider from "@/app/components/ui/DotSlider/DotSlider";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import Link from "next/link";

/* ====================================================== */
export type HomeNewsItem = {
  id: string | number;
  categoryTH: string;
  categoryEN: string;
  titleTH: string;
  titleEN: string;
  detailTH: string;
  detailEN: string;
  createdAt: string;
  images: string[];
  views?: number;
};

type Props = {
  news: HomeNewsItem[];
};

const getResponsivePerView = () => {
  if (typeof window === "undefined") return 2;

  const width = window.innerWidth;

  if (width >= 1200) return 2;
  if (width >= 900) return 1;
  if (width >= 714) return 2;

  return 1;
};

function HomeNewsSkeletonCards() {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr",
        "@media (min-width:714px)": {
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        },
        "@media (min-width:900px)": {
          gridTemplateColumns: "1fr",
        },
        "@media (min-width:1200px)": {
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        },
      }}
    >
      {[0, 1].map((item) => (
        <Box
          key={item}
          sx={{
            px: 2,
            py: 2,
            display: {
              xs: item === 0 ? "block" : "none",
            },
            "@media (min-width:714px)": {
              display: "block",
            },
            "@media (min-width:900px)": {
              display: item === 0 ? "block" : "none",
            },
            "@media (min-width:1200px)": {
              display: "block",
            },
          }}
        >
          <NewsCardSkeleton />
        </Box>
      ))}
    </Box>
  );
}

/* ====================================================== */
export default function NewsSection({ news }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperHeight, setSwiperHeight] = useState(0);
  const [swiperReady, setSwiperReady] = useState(false);

  // 🔥 เพิ่ม (ใช้คำนวณ dot)
  const [perView, setPerView] = useState(getResponsivePerView);

  const swiperRef = useRef<SwiperType | null>(null);
  const { messages } = useLocale();

  /* ====================================================== */
  const updateHeight = useCallback(() => {
    const activeSlide =
      swiperRef.current?.slides?.[swiperRef.current.activeIndex] ||
      document.querySelector(".swiper-slide-active");

    if (activeSlide) {
      const h = (activeSlide as HTMLElement).offsetHeight;
      if (h > 0) {
        setSwiperHeight(h + 20);
      }
    }
  }, []);

  useEffect(() => {
    const syncLayout = () => {
      const nextPerView = getResponsivePerView();
      setPerView(nextPerView);
      setActiveIndex(
        Math.floor((swiperRef.current?.realIndex || 0) / nextPerView)
      );
      updateHeight();
    };

    const frame = window.requestAnimationFrame(syncLayout);

    window.addEventListener("resize", syncLayout);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", syncLayout);
    };
  }, [news, updateHeight]);

  /* ====================================================== */
  // 🔥 แก้ตรงนี้ (จำนวน dot = จำนวนสไลด์จริง)
  const totalPages = Math.ceil(news.length / perView);

  /* ====================================================== */
  return (
    <Box
      sx={{
        position: "relative",
        py: 8,
      }}
    >
      {/* ================= BG ================= */}
      <Box
        sx={{
          position: "absolute",
          left: 0,
          top: {
            xs: 0,
            md: 0,
          },
          width: {
            xs: "62%",
            sm: "61.5%",
            md: "55%",
            lg: "46%",
          },
          height: {
            xs: swiperHeight ? swiperHeight + 165 : 620,
            sm: swiperHeight ? swiperHeight + 165 : 630,
            md: "100%",
          },
          background: "linear-gradient(180deg, #243865, #2669CD)",
          borderRadius: {
            xs: "0 0px 40px 0",
            lg: "0 0 60px 0",
          },
          zIndex: 1,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "unset", md: "stretch" },
          }}
        >
          {/* ================= LEFT ================= */}
          <Box
            sx={{
              width: { xs: "100%", md: 480 },
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "center", md: "flex-start" },
              px: 0,
              py: {
                xs: 0,
                md: 1,
                lg: 2
              },
            }}
          >
            <Typography
              component="div"
              sx={{
                fontWeight: 700,
                lineHeight: { xs: 1.2, md: 1.3 },
                letterSpacing: 0,
                color: { xs: "transparent", md: "#fff" },
                backgroundImage: {
                  xs: "linear-gradient(90deg, #fff 0 65%, var(--color-primary) 65%)",
                  sm: "linear-gradient(90deg, #fff 0 83%, var(--color-primary) 83%)",
                  md: "none",
                },
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: {
                  xs: "transparent",
                  md: "#fff",
                },
                textAlign: { xs: "center", md: "left" },
                mb: { xs: 3, md: 0 },
              }}
            >
              <Box sx={{ fontSize: { xs: 45, md: 64 } }}>
                {messages.home.follow_news_1}
              </Box>

              <Box
                sx={{
                  fontSize: { xs: 22, md: 48 },
                  display: { xs: "inline", md: "block" },
                }}
              >
                {messages.home.follow_news_2}
              </Box>

              <Box
                sx={{
                  fontSize: { xs: 22, md: 48 },
                  display: { xs: "inline", md: "block" },
                  ml: { xs: 1, md: 0 },
                }}
              >
                {messages.home.follow_news_3}
              </Box>
            </Typography>

            <Button
              component={Link}
              href="/news"
              sx={{
                display: { xs: "none", md: "flex" },
                mt: "auto",
                mb: 4,
                alignSelf: "flex-start",
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
                "&:hover": {
                  background: "rgba(255,255,255,0.1)",
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
              width: { xs: "100%", md: "calc(100% - 400px)" },
              ml: { xs: 0, md: "-50px" },
            }}
          >
            <Box
              sx={{
                position: "relative",
                py: 0,
                "& .swiper-slide > div": {
                  opacity: 1,
                  transform: "translateX(0) scale(1)",
                  transition:
                    "opacity 0.42s ease, transform 0.42s cubic-bezier(0.4, 0, 0.2, 1)",
                },
                "& .swiper-slide-prev > div": {
                  opacity: 0,
                  transform: "translateX(-22px) scale(0.98)",
                  pointerEvents: "none",
                },
              }}
            >
              <Box
                aria-hidden="true"
                sx={{
                  width: "100%",
                  opacity: swiperReady ? 0 : 1,
                  transition: "opacity 0.22s ease",
                  pointerEvents: "none",
                }}
              >
                <HomeNewsSkeletonCards />
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  opacity: swiperReady ? 1 : 0,
                  transition: "opacity 0.24s ease",
                  pointerEvents: swiperReady ? "auto" : "none",
                }}
              >
              <Swiper
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;

                  // 🔥 sync perView
                  const view = getResponsivePerView();
                  setPerView(view);

                  window.requestAnimationFrame(() => {
                    swiper.update();
                    updateHeight();
                    setSwiperReady(true);
                  });
                }}
                slidesPerView={perView}
                slidesPerGroup={perView}
                spaceBetween={8}
                observer
                observeParents
                resizeObserver
                watchOverflow
                breakpoints={{
                  0: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                  },
                  714: {
                    slidesPerView: 2,
                    slidesPerGroup: 2,
                  },
                  900: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                  },
                  1200: {
                    slidesPerView: 2,
                    slidesPerGroup: 2,
                  },
                }}
                style={{
                  paddingRight: "10px", // 🔥 สำคัญ
                }}
                // 🔥 sync ตอน breakpoint เปลี่ยน
                onBreakpoint={(swiper) => {
                  const view =
                    Number(swiper.params.slidesPerView) ||
                    getResponsivePerView();

                  setPerView(view);
                  setActiveIndex(
                    Math.floor(swiper.realIndex / view)
                  );
                  window.requestAnimationFrame(updateHeight);
                }}
                onSlideChange={(swiper) => {
                  const view = getResponsivePerView();
                  setPerView(view);

                  setActiveIndex(
                    Math.floor(swiper.realIndex / view)
                  );

                  setTimeout(updateHeight, 0);
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
            </Box>

            <Box sx={{
              mt: {xs: 4, md: 1}, 
              display: "flex", 
              justifyContent: "center" }}>
              <DotSlider
                total={totalPages}
                activeIndex={activeIndex}
                onClick={(pageIndex: number) => {
                  swiperRef.current?.slideTo(pageIndex * perView);
                }}
              />
            </Box>

            {/* <Button
              component={Link}
              href="/news"
              sx={{
                display: { xs: "flex", md: "none" },
                mt: 3,
                mx: "auto",
                borderRadius: "14px",
                border: "2px solid var(--color-primary)",
                color: "var(--color-primary)",
                px: 3,
                py: 1,
                fontSize: 14,
                textTransform: "none",
                "&:hover": {
                  background: "rgba(36,56,101,0.06)",
                },
              }}
            >
              {messages.home.view_all_news}
              <IoIosArrowForward size={16} />
            </Button> */}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
