"use client";

/* ====================================================== */
import { useState, useMemo, useRef } from "react";
import { Box, Typography, Button } from "@mui/material";
import Image from "next/image";
import { IoIosArrowForward } from "react-icons/io";
import Link from "next/link";
/* ====================================================== */
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/effect-fade";

/* ====================================================== */
import DotSlider from "@/app/components/ui/DotSlider/DotSlider";
import { useLocale } from "@/app/providers/LocaleContext";

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

type Props = {
    data: News[];
};

/* ======================================================
   🔥 FORMAT DATE
====================================================== */
const formatDate = (dateStr: string, locale: string) => {
    const date = new Date(dateStr);

    if (locale === "th") {
        return date.toLocaleDateString("th-TH", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    }

    return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

/* ====================================================== */
export default function NewsBanner({ data }: Props) {
    const { messages, locale } = useLocale();
    const [active, setActive] = useState(0);
    const swiperRef = useRef<SwiperType | null>(null);

    /* ======================================================
       🔥 FILTER + SORT + LIMIT 10
    ====================================================== */
    const newsOnly = useMemo(() => {
        return (data || [])
            .sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
            )
            .slice(0, 10); // 🔥 เอาล่าสุด 10 ทั้งหมด
    }, [data]);

    if (!newsOnly.length) return null;

    /* ====================================================== */
    return (
        <Box
            sx={{
                position: "relative",
                width: "100%",
                height: { xs: 400, md: 520 },
                overflow: "hidden",
            }}
        >
            {/* BACKGROUND */}
            <Image
                src="/background/BaranchlocationsBanner.png"
                alt="banner"
                fill
                priority
                style={{ objectFit: "cover" }}
            />

            {/* OVERLAY */}
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0) 70%)",
                    zIndex: 1,
                }}
            />

            {/* ======================================================
         🔥 SWIPER (ลากได้)
      ====================================================== */}
            <Swiper
                modules={[EffectFade]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                loop={true}
                grabCursor={true}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                onSlideChange={(swiper) => setActive(swiper.realIndex)}
                style={{ height: "100%" }}
            >
                {newsOnly.map((item) => (
                    <SwiperSlide key={item.id}>
                        <Box
                            sx={{
                                position: "relative",
                                zIndex: 2,
                                maxWidth: "lg",
                                mx: "auto",
                                height: "100%",
                                display: "grid",
                                gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr" },
                                alignItems: "center",
                                gap: 4,
                                px: 3,
                            }}
                        >
                            {/* LEFT */}
                            <Box sx={{ color: "#fff" }}>
                                {/* DATE */}
                                <Box
                                    sx={{
                                        display: "inline-block",
                                        px: 2,
                                        py: 0.8,
                                        borderRadius: "8px",
                                        background: "rgba(255,255,255,0.2)",
                                        mb: 2,
                                        fontSize: 16,
                                    }}
                                >
                                    {formatDate(item.createdAt, locale)}
                                </Box>

                                {/* TITLE */}
                                <Typography
                                    sx={{
                                        fontSize: { xs: 20, md: 28 },
                                        fontWeight: 600,
                                        mb: 2,
                                        mt: 1,
                                    }}
                                >
                                    {locale === "en" ? item.titleEN : item.titleTH}
                                </Typography>

                                {/* DETAIL */}
                                <Typography
                                    sx={{
                                        fontSize: 18,
                                        opacity: 0.9,
                                        mb: 3,
                                        lineHeight: 1.6,
                                        display: "-webkit-box",
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                        textAlign: "justify",
                                    }}
                                >
                                    {locale === "en" ? item.detailEN : item.detailTH}
                                </Typography>

                                {/* BUTTON */}
                                <Button
                                    component={Link}
                                    href={`/news-activities/${item.id}`}
                                    variant="outlined"
                                    sx={{
                                        color: "#fff",
                                        borderColor: "#fff",
                                        borderRadius: "8px",
                                        px: 3,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                        fontSize: 16,

                                        width: "fit-content", // 🔥 ตัวนี้สำคัญ
                                    }}
                                >
                                    {messages.news.read_more_short}
                                    <IoIosArrowForward size={16} />
                                </Button>
                            </Box>

                            {/* RIGHT IMAGE */}
                            <Box
                                sx={{
                                    position: "relative",
                                    width: "100%",
                                    aspectRatio: "16/10",
                                    borderRadius: "20px",
                                    overflow: "hidden",
                                    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                                }}
                            >
                                <Image
                                    src={item.images?.[0] || "/no-image.jpg"}
                                    alt=""
                                    fill

                                    // 🔥 FIX WARNING
                                    sizes="(max-width: 900px) 100vw, 40vw"

                                    style={{
                                        objectFit: "cover",
                                        transition: "transform .4s ease",
                                    }}
                                />

                            </Box>
                        </Box>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* ======================================================
         🔥 DOT CONTROL
      ====================================================== */}
            <Box
                sx={{
                    position: "absolute",
                    bottom: 20,
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 3,
                }}
            >
                <DotSlider
                    total={newsOnly.length}
                    activeIndex={active}
                    onClick={(index) => swiperRef.current?.slideToLoop(index)}
                />
            </Box>
        </Box>
    );
}