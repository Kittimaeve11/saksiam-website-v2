"use client";

import { useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/effect-fade";

import NewsCard from "@/app/components/cards/NewsCard/NewsCard";
import DotSlider from "@/app/components/ui/DotSlider/DotSlider";
import { useLocale } from "@/app/providers/LocaleContext";

type News = {
  id: string | number;
  typeID?: string;
  categoryTH: string;
  categoryEN: string;
  titleTH: string;
  titleEN: string;
  detailTH: string;
  detailEN: string;
  createdAt: string;
  images: string[];
};

type EditorialType = {
  id: string;
  nameTH: string;
  nameEN: string;
};

type Props = {
  data: News[];
  editorialType: EditorialType;
  layoutIndex: number;
};

export default function NewsSection({
  data,
  editorialType,
  layoutIndex,
}: Props) {
  const router = useRouter();
  const { messages, locale } = useLocale();
  const [active, setActive] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);
  const isOverlayLeft = layoutIndex % 2 === 0;

  const chunkArray = <T,>(array: T[], size: number): T[][] => {
    const result: T[][] = [];

    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }

    return result;
  };

  const slidesLg = chunkArray(data, 3);
  const slidesMd = chunkArray(data, 2);
  const slidesSm = chunkArray(data, 1);


  const handleViewAll = () => {
    router.push(`/news-activities?tab=${editorialType.id}`);
  };

  const renderSlideContent = (group: News[]) => {
    if (isOverlayLeft) {
      return (
        <>
          {group[0] && <NewsCard item={group[0]} variant="overlay" />}
          {group.slice(1).map((item) => (
            <NewsCard key={item.id} item={item} variant="simple" />
          ))}
        </>
      );
    }

    return (
      <>
        {group.slice(0, 2).map((item) => (
          <NewsCard key={item.id} item={item} variant="simple" />
        ))}
        {group[2] && <NewsCard item={group[2]} variant="overlay" />}
      </>
    );
  };

  return (
    <Box sx={{ mt: layoutIndex === 0 ? 0 : 6, mb: 6 }}>
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
        >
          {locale === "en" ? editorialType.nameEN : editorialType.nameTH}
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

      {!slidesLg.length && (
        <Box
          sx={{
            minHeight: { xs: 150, md: 190 },
            borderRadius: "20px",
            border: "1px solid rgba(216, 218, 220, 0.72)",
            bgcolor: "rgba(255, 255, 255, 0.72)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: 3,
          }}
        >
          <Typography
            sx={{
              color: "var(--main-blue-700)",
              fontSize: { xs: 16, md: 18 },
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            {locale === "en"
              ? "No content available yet"
              : "ยังไม่มีรายการในประเภทนี้"}
          </Typography>
        </Box>
      )}

      {!!slidesLg.length && (
        <Box
          sx={{
            overflow: "visible",
            "& .swiper": {
              overflow: "visible",
            },
            "& .swiper:not(.swiper-initialized) .swiper-slide:not(:first-of-type)":
            {
              opacity: "0 !important",
              visibility: "hidden",
              pointerEvents: "none",
            },
            "& .swiper.swiper-initialized .swiper-slide:not(.swiper-slide-active)":
            {
              opacity: "0 !important",
              visibility: "hidden",
              pointerEvents: "none",
            },
            "& .swiper-slide-active": {
              visibility: "visible",
              pointerEvents: "auto",
            },
          }}
        >
          <Box sx={{ display: { xs: "block", md: "none" } }}>
            <Swiper
              modules={[EffectFade]}
              effect="fade"
              fadeEffect={{ crossFade: true }}
              loop={false}
              grabCursor
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              onSlideChange={(swiper) => setActive(swiper.realIndex)}
            >
              {slidesSm.map((group, index) => (
                <SwiperSlide key={index}>
                  <Box
                    sx={{
                      py: 1,
                      display: "grid",
                      gridTemplateColumns: "1fr",
                      gap: 3,
                    }}
                  >
                    <NewsCard
                      item={group[0]}
                      variant="overlay"
                    />
                  </Box>
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>

{/* ไอแพด */}
<Box sx={{ display: { xs: "none", md: "block", lg: "none" } }}>
  <Swiper
    modules={[EffectFade]}
    effect="fade"
    fadeEffect={{ crossFade: true }}
    loop={false}
    grabCursor
    onSwiper={(swiper) => (swiperRef.current = swiper)}
    onSlideChange={(swiper) => setActive(swiper.realIndex)}
  >
    {slidesMd.map((group, index) => (
      <SwiperSlide key={index}>
        <Box
          sx={{
            py: 2,

            display: "grid",

            gridTemplateColumns: isOverlayLeft
              ? {
                  md: "1.15fr 1fr",
                }
              : {
                  md: "1fr 1.15fr",
                },

            gap: {
              md: 3,
            },

            alignItems: "stretch",
            minHeight: {
              md: 332,
            },

            "& > *": {
              height: "100%",
              minHeight: 0,
            },

            "& .news-overlay-card": {
              height: "100%",
              aspectRatio: "auto",
            },

            "& .news-simple-card": {
              height: "100%",
              width: "100%",
              maxWidth: "none",
            },
          }}
        >
          {isOverlayLeft ? (
            <>
              {group[0] && (
                <NewsCard
                  item={group[0]}
                  variant="overlay"
                />
              )}

              {group[1] && (
                <NewsCard
                  item={group[1]}
                  variant="simple"
                />
              )}
            </>
          ) : (
            <>
              {group[0] && (
                <NewsCard
                  item={group[0]}
                  variant="simple"
                />
              )}

              {group[1] && (
                <NewsCard
                  item={group[1]}
                  variant="overlay"
                />
              )}
            </>
          )}
        </Box>
      </SwiperSlide>
    ))}
  </Swiper>
</Box>

          <Box sx={{ display: { xs: "none", lg: "block" } }}>
            <Swiper
              modules={[EffectFade]}
              effect="fade"
              fadeEffect={{ crossFade: true }}
              loop={false}
              grabCursor
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              onSlideChange={(swiper) => setActive(swiper.realIndex)}
            >
              {slidesLg.map((group, index) => (
                <SwiperSlide key={index}>
                  <Box
                    sx={{
                      py: 2,
                      display: "grid",
                      gridTemplateColumns: isOverlayLeft
                        ? "2fr 1fr 1fr"
                        : "1fr 1fr 2fr",
                      gap: 3,
                    }}
                  >
                    {renderSlideContent(group)}
                  </Box>
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>


          <Box sx={{ display: { xs: "block", md: "none" }, mt: 2 }}>
            {slidesSm.length > 1 && (
              <DotSlider
                total={slidesSm.length}
                activeIndex={active}
                onClick={(index) => swiperRef.current?.slideTo(index)}
              />
            )}
          </Box>

          <Box sx={{ display: { xs: "none", md: "block", lg: "none" }, mt: 2 }}>
            {slidesMd.length > 1 && (
              <DotSlider
                total={slidesMd.length}
                activeIndex={active}
                onClick={(index) => swiperRef.current?.slideTo(index)}
              />
            )}
          </Box>

          <Box sx={{ display: { xs: "none", lg: "block" }, mt: 2 }}>
            {slidesLg.length > 1 && (
              <DotSlider
                total={slidesLg.length}
                activeIndex={active}
                onClick={(index) => swiperRef.current?.slideTo(index)}
              />
            )}
          </Box>



        </Box>
      )}
    </Box>
  );
}
