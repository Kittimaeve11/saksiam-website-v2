"use client";

import { useMemo, useRef, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/effect-fade";

import EachBanner from "@/app/components/ui/Banner/EachBanner";
import DotSlider from "@/app/components/ui/DotSlider/DotSlider";
import { useLocale } from "@/app/providers/LocaleContext";
import type { News } from "@/app/Utils/type";


type Props = {
    data: News[];
};

const formatDate = (dateStr: string, locale: string) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "-";

    return date.toLocaleDateString(locale === "th" ? "th-TH" : "en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

const isRemoteImage = (src: string) =>
    src.startsWith("http://") || src.startsWith("https://");

export default function NewsBanner({ data }: Props) {
    const { messages, locale } = useLocale();
    const [active, setActive] = useState(0);
    const swiperRef = useRef<SwiperType | null>(null);

    const newsOnly = useMemo(() => data || [], [data]);
    if (!newsOnly.length) return <EachBanner num={12} />;

    const hasMultipleSlides = newsOnly.length > 1;

    return (
        <Box
            sx={{
                position: "relative",
                width: "100%",
                overflow: "hidden",
                userSelect: "none",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none",
            }}
        >
            <EachBanner num={12} />

            <Box
                className="api-content-fade-in"
                sx={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 1,
                    background: {
                        xs: `
              linear-gradient(180deg, rgba(9,20,42,0.72) 0%, rgba(9,20,42,0.44) 34%, rgba(9,20,42,0.18) 68%, rgba(9,20,42,0.46) 100%),
              linear-gradient(90deg, rgba(9,20,42,0.45) 0%, rgba(9,20,42,0.06) 100%)
            `,
                        md: "linear-gradient(to right, rgba(0,0,0,0.66) 0%, rgba(0,0,0,0.34) 42%, rgba(0,0,0,0.05) 76%)",
                    },
                    pointerEvents: "none",
                }}
            />

            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 2,
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        maxWidth: "lg",
                        height: "100%",
                    }}
                >

                    <Swiper
                        modules={[EffectFade]}
                        effect="fade"
                        fadeEffect={{ crossFade: true }}
                        loop={false}
                        rewind={hasMultipleSlides}
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                        onSlideChange={(swiper) => {
                            setActive((current) =>
                                current === swiper.realIndex ? current : swiper.realIndex
                            );
                        }}
                        style={{ height: "100%" }}
                    >
                        {newsOnly.map((item) => {
                            const imageSrc = item.images?.[0] || "/no-image.jpg";

                            return (
                                <SwiperSlide key={item.id}>
                                    <Box
                                        sx={{
                                            maxWidth: "lg",
                                            mx: "auto",
                                            height: "100%",

                                            display: "grid",

                                            gridTemplateColumns: {
                                                xs: "1fr",
                                                md: "1fr minmax(320px, 0.82fr)",
                                                lg: "1.2fr 1fr",
                                            },

                                            alignItems: {
                                                xs: "start",
                                                md: "center",
                                            },

                                            alignContent: {
                                                xs: "start",
                                                md: "initial",
                                            },
                                            justifyItems: {
                                                xs: "center",
                                                md: "initial",
                                            },

                                            gap: {
                                                xs: 2,
                                                sm: 2.25,
                                                md: 3,
                                                lg: 4,
                                            },

                                            px: {
                                                xs: 3,
                                                sm: 8,
                                                md: 3,
                                                lg: 3,
                                            },

                                            pt: {
                                                sm: 18,
                                                md: 0,
                                            },

                                            pb: {
                                                xs: 9,
                                                sm: 10,
                                                md: 3,
                                                lg: 0,
                                            },

                                            pointerEvents: "auto",

                                            "@media (min-width:320px) and (max-width:375px)": {
                                                pt: 4,
                                                pb: 14,
                                                gap: 3,
                                            },


                                            "@media (min-width:376px) and (max-width:433px)": {
                                                px: 4,
                                                pt: 8,
                                                gap: 2.5,
                                            },



                                            "@media (min-width:434px) and (max-width:600px)": {
                                                px: 4,
                                                pt: 14,
                                                gap: 2.5,
                                            },


                                            "@media (min-width:601px) and (max-width:699px)": {
                                                px: 8,
                                                pt: 20,
                                                gap: 2.75,
                                            },
                                            "@media (min-width:700px) and (max-width:899px)": {
                                                px: 8,
                                                pt: 28,
                                                gap: 2.75,
                                            },
                                            "@media (min-width:1200px) and (max-width:1400px)": {
                                                gridTemplateColumns: "1fr minmax(320px, 0.82fr)",
                                                gap: 3,
                                                pb: 3,
                                            },
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                color: "#fff",
                                                minWidth: 0,
                                                maxWidth: { xs: 470, sm: 560, md: 560, lg: "none" },
                                                mx: { xs: "auto", md: 0 },
                                                width: "100%",
                                                "@media (min-width:1200px) and (max-width:1400px)": {
                                                    maxWidth: 560,
                                                },
                                            }}
                                        >
                                            {/* วันที่เผยแพร่ */}
                                            <Box
                                                sx={{
                                                    display: "inline-block",
                                                    px: { xs: 1.4, sm: 1.7, md: 1.6, lg: 2 },
                                                    py: { xs: 0.45, sm: 0.6, md: 0.55, lg: 0.8 },
                                                    borderRadius: "8px",
                                                    background: "rgba(255,255,255,0.2)",
                                                    mb: { xs: 1.1, sm: 1.3, md: 1.2, lg: 2 },
                                                    fontSize: { xs: 11.5, sm: 13, md: 13, lg: 16 },
                                                    "@media (min-width:1200px) and (max-width:1400px)": {
                                                        px: 1.6,
                                                        py: 0.55,
                                                        mb: 1.2,
                                                        fontSize: 13,
                                                    },
                                                }}
                                            >
                                                {formatDate(item.createdAt, locale)}
                                            </Box>

                                            {/* หัวข้อและรายละเอียดข่าว */}
                                            <Typography
                                                sx={{
                                                    fontSize: { xs: 21, sm: 25, md: 24, lg: 28 },
                                                    fontWeight: 600,
                                                    mb: { xs: 1, sm: 1.35, md: 1.5, lg: 2 },
                                                    mt: { xs: 0.5, md: 0.5, lg: 1 },
                                                    lineHeight: { xs: 1.32, md: 1.36, lg: 1.45 },
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: {
                                                        xs: 2,
                                                        sm: 3,
                                                        md: 2,
                                                        lg: 3,
                                                    }, WebkitBoxOrient: "vertical",
                                                    overflow: "hidden",
                                                    "@media (min-width:1200px) and (max-width:1400px)": {
                                                        fontSize: 24,
                                                        mb: 1.5,
                                                        mt: 0.5,
                                                        lineHeight: 1.36,
                                                        WebkitLineClamp: 2,
                                                    },
                                                }}
                                            >
                                                {locale === "en" ? item.titleEN : item.titleTH}
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    fontSize: { xs: 12.5, sm: 14, md: 15, lg: 18 },
                                                    opacity: 0.9,
                                                    mb: { xs: 1.45, sm: 1.9, md: 1.8, lg: 3 },
                                                    lineHeight: { xs: 1.45, md: 1.5, lg: 1.6 },
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: { xs: 3, sm: 4, md: 2, lg: 3 },
                                                    WebkitBoxOrient: "vertical",
                                                    overflow: "hidden",
                                                    textAlign: "justify",
                                                    "@media (min-width:1200px) and (max-width:1400px)": {
                                                        fontSize: 15,
                                                        mb: 1.8,
                                                        lineHeight: 1.5,
                                                        WebkitLineClamp: 2,
                                                    },
                                                }}
                                            >
                                                {locale === "en" ? item.detailEN : item.detailTH}
                                            </Typography>

                                            <Button
                                                component={Link}
                                                href={`/news-activities-list/${item.id}`}
                                                variant="outlined"
                                                sx={{
                                                    color: "#fff",
                                                    borderColor: "#fff",
                                                    borderRadius: "8px",
                                                    px: { xs: 2.1, sm: 2.5, md: 2.4, lg: 3 },
                                                    py: { xs: 0.55, sm: 0.65, md: 0.55, lg: 0.75 },
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "4px",
                                                    fontSize: { xs: 12.5, sm: 14, md: 14, lg: 16 },

                                                    width: "fit-content",
                                                    "@media (min-width:1200px) and (max-width:1400px)": {
                                                        px: 2.4,
                                                        py: 0.55,
                                                        fontSize: 14,
                                                    },
                                                }}
                                            >
                                                {messages.news.read_more_short}
                                                <IoIosArrowForward size={16} />
                                            </Button>
                                        </Box>

                                        <Box
                                            sx={{
                                                position: "relative",
                                                width: "100%",
                                                maxWidth: { xs: 470, sm: 560, md: 480, lg: "none" },
                                                mx: { xs: "auto", md: 0 },
                                                aspectRatio: {
                                                    xs: "16/9",
                                                    sm: "16/9",
                                                    md: "16/9",
                                                    lg: "16/9",
                                                },
                                                borderRadius: { xs: "16px", sm: "20px" },
                                                overflow: "hidden",
                                                boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
                                                "@media (min-width:434px) and (max-width:600px)": {
                                                    maxWidth: 470,
                                                    aspectRatio: "16/9",
                                                },
                                                "@media (min-width:601px) and (max-width:899px)": {
                                                    maxWidth: 560,
                                                    aspectRatio: "16/9",
                                                },
                                                "@media (min-width:1200px) and (max-width:1400px)": {
                                                    maxWidth: 480,
                                                    aspectRatio: "16/9",
                                                },
                                            }}
                                        >
                                            <Image
                                                src={imageSrc}
                                                alt=""
                                                fill
                                                draggable={false}
                                                unoptimized={isRemoteImage(imageSrc)}
                                                sizes="40vw"
                                                style={{
                                                    objectFit: "cover",
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </Box>

            </Box>

            <Box
                sx={{
                    position: "absolute",
                    bottom: { xs: "8%", sm: "13%", md: 10, lg: 20 },
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 3,
                    "@media (min-width:434px) and (max-width:600px)": {
                        bottom: "9%",
                    },
                    "@media (min-width:601px) and (max-width:899px)": {
                        bottom: "14%",
                    },
                    "@media (min-width:1200px) and (max-width:1400px)": {
                        bottom: 10,
                    },
                }}
            >
                <DotSlider
                    total={newsOnly.length}
                    activeIndex={active}
                    onClick={(index) => swiperRef.current?.slideTo(index)}
                />
            </Box>
        </Box>
    );
}
