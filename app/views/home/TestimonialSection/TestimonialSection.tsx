"use client";

/* ====================================================== */
import { useEffect, useState, useRef } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import DotSlider from "@/app/components/ui/DotSlider/DotSlider";
import { IoIosArrowForward } from "react-icons/io";
import VideoCard from "@/app/components/cards/VideoCard/VideoCard";

/* ====================================================== */
type Testimonial = {
  id: number;
  title: string;
  videoUrl: string;
  videoId: string;
};

/* ====================================================== */
export default function TestimonialSection() {
  const [data, setData] = useState<Testimonial[]>([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);

  /* ================= DRAG ================= */
  const startX = useRef(0);
  const isDragging = useRef(false);

  const next = () => {
    if (!data.length) return;
    setActive((prev) => (prev + 1) % data.length);
  };

  const prev = () => {
    if (!data.length) return;
    setActive((prev) => (prev - 1 + data.length) % data.length);
  };

  const handleStart = (x: number) => {
    startX.current = x;
    isDragging.current = true;
  };

  const handleEnd = (x: number) => {
    if (!isDragging.current) return;

    const diff = x - startX.current;

    if (diff > 50) prev();
    else if (diff < -50) next();

    isDragging.current = false;
  };

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/testimonial");
        const json = await res.json();
        setData(json.data || []);
      } catch (err) {
        console.error("❌ testimonial error:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <Box sx={{ textAlign: "center", py: 10 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!data.length) return null;

  /* ====================================================== */
  return (
    <Box
      sx={{
        pt: 10,
        position: "relative",
        backgroundImage: "url('/New/bg-slide.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        overflow: "hidden",

        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background: "rgba(255,255,255,0.32)",
          zIndex: 0,
        },
      }}
    >
      <Box sx={{ maxWidth: "lg", mx: "auto", px: 1, position: "relative" }}>

        {/* LEFT IMAGE */}
        <Box
          component="img"
          src="/New/ChatGPT_Image_Jan_29_2026_04_19_20_PM_1.png"
          sx={{
            position: "absolute",
            left: 0,
            bottom: 0,
            height: { xs: "50%", md: "100%" },
            maxWidth: "60%",
            objectFit: "contain",
            zIndex: 3,
            pointerEvents: "none",
            transform: "scaleX(-1)",
          }}
        />

        {/* TITLE */}
        <Box sx={{ textAlign: "center", mb: 6, position: "relative", zIndex: 2 }}>
          <Typography
            sx={{
              fontSize: { xs: 28, md: 48 },
              fontWeight: 700,
              color: "#1C3563",
            }}
          >
            เสียงจากลูกค้า ที่ไว้วางใจ
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: 14, md: 18 },
              color: "#666",
              mt: 1,
              mb: 8,
            }}
          >
            ลูกค้ากว่า 50,000 คนที่ได้รับบริการจากเรา พร้อมรีวิวจากประสบการณ์จริง
          </Typography>
        </Box>

        {/* ================= SLIDER ================= */}
        <Box
          sx={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2,
            transform: { md: "translate(120px, -20px)" },
          }}
        >
          {/* 🔥 DRAG LAYER (ตัวรับ event จริง) */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 4,
              cursor: "grab",
              touchAction: "pan-y",
              background: "transparent",
            }}
            onMouseDown={(e) => handleStart(e.clientX)}
            onMouseUp={(e) => handleEnd(e.clientX)}
            onMouseLeave={(e) => handleEnd(e.clientX)}
            onTouchStart={(e) => handleStart(e.touches[0].clientX)}
            onTouchEnd={(e) => handleEnd(e.changedTouches[0].clientX)}
          />

          {/* BACK CARD */}
          {data.length > 1 && (
            <Box sx={{ position: "absolute", right: "11.5%" }}>
              <VideoCard
                videoId={data[(active + 1) % data.length]?.videoId}
                type="preview"
                onClick={next}
              />
            </Box>
          )}

          {/* MAIN VIDEO */}
          <VideoCard
            videoUrl={data[active]?.videoUrl}
            type="main"
          />

          {/* ARROW */}
          <IconButton
            onClick={next}
            sx={{
              position: "absolute",
              right: { xs: 10, md: 130 },
              zIndex: 5,
              background: "#fff",
              width: 48,
              height: 48,
              borderRadius: "50%",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              "&:hover": {
                background: "#fff",
                transform: "translateY(-3px) scale(1.05)",
              },
            }}
          >
            <IoIosArrowForward size={30} />
          </IconButton>
        </Box>

        {/* DOT */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 2.5,
            transform: { md: "translateX(120px)" },
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 530 }}>
            <DotSlider
              total={data.length}
              activeIndex={active}
              onClick={(i: number) => setActive(i)}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}