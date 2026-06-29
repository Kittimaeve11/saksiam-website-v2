//เสียงจากลูกค้า ที่ไว้วางใจ
"use client";

/* ====================================================== */
import { useRef, useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import DotSlider from "@/app/components/ui/DotSlider/DotSlider";
import { IoIosArrowForward } from "react-icons/io";
import VideoCard from "@/app/components/cards/VideoCard/VideoCard";
import { useLocale } from "@/app/providers/LocaleContext";
import type { TestimonialItem } from "@/app/Utils/type";

/* ====================================================== */
type Props = {
  testimonials: TestimonialItem[];
};

/* ====================================================== */
export default function TestimonialSection({ testimonials }: Props) {
  const [active, setActive] = useState(0);
  const [videoInteractive, setVideoInteractive] = useState(false);
  const data = testimonials;
  const startX = useRef(0);
  const startY = useRef(0);
  const dragMoved = useRef(false);
  const interactionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { messages } = useLocale();

  const isDragging = useRef(false);

  const resetVideoInteraction = () => {
    if (interactionTimer.current) {
      clearTimeout(interactionTimer.current);
      interactionTimer.current = null;
    }

    setVideoInteractive(false);
  };

  const enableVideoInteraction = () => {
    setVideoInteractive(true);

    if (interactionTimer.current) {
      clearTimeout(interactionTimer.current);
    }

    interactionTimer.current = setTimeout(() => {
      setVideoInteractive(false);
      interactionTimer.current = null;
    }, 2500);
  };

  const next = () => {
    if (!data.length) return;
    resetVideoInteraction();
    setActive((prev) => (prev + 1) % data.length);
  };

  const prev = () => {
    if (!data.length) return;
    resetVideoInteraction();
    setActive((prev) => (prev - 1 + data.length) % data.length);
  };

  const handleStart = (x: number, y = 0) => {
    startX.current = x;
    startY.current = y;
    dragMoved.current = false;
    isDragging.current = true;
  };

  const handleMove = (x: number, y = 0) => {
    if (!isDragging.current) return;

    const diffX = Math.abs(x - startX.current);
    const diffY = Math.abs(y - startY.current);

    if (diffX > 8 || diffY > 8) {
      dragMoved.current = true;
    }
  };

  const handleEnd = (x: number) => {
    if (!isDragging.current) return;

    const diff = x - startX.current;

    if (diff > 50) prev();
    else if (diff < -50) next();

    isDragging.current = false;
  };

  if (!data.length) return null;

  /* ====================================================== */
  return (
    <Box
      sx={{
        pt: 5,
        position: "relative",
        userSelect: "none",
        WebkitUserSelect: "none",
        msUserSelect: "none",

        backgroundImage: {
          xs: "url('/New/bg-mobile.png')",
          lg: "url('/New/bg-slide.png')",
        },

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
      <Box
        sx={{
          maxWidth: "lg",
          mx: "auto",

          px: {
            xs: 2,
            sm: 3,
            md: 1,
          },

          position: "relative",
        }}
      >
        {/* LEFT IMAGE */}
        <Box
          component="img"
          src="/New/ChatGPT_Image_Jan_29_2026_04_19_20_PM_1.png"
          draggable={false}
          sx={{
            display: {
              xs: "none",
              sm: "none",
              md: "block",
            },

            position: "absolute",
            left: 0,
            bottom: 0, // ชิดล่างเสมอ

            width: {
              md: "44%",
              lg: "43%",
            },

            height: "auto",

            objectFit: "contain",
            zIndex: 3,
            pointerEvents: "none",
            transform: "scaleX(-1)",
          }}
        />

        {/* TITLE */}
        <Box
          sx={{
            textAlign: "center",
            mb: 6,
            position: "relative",
            zIndex: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: 34, sm: 44, md: 36, lg: 48 },
              fontWeight: 700,
              color: "#1C3563",
            }}
          >
            {messages.customer_reviews.title}
          </Typography>

          <Typography
            sx={{
              fontSize: "18px",
              color: "var(--gray-400)",
              mt: 1,
              mb: 8,
              opacity: 0.9,
              textAlign: "center",
            }}
          >
            {messages.customer_reviews.description_1}

            <Box
              component="span"
              sx={{
                display: { xs: "block", md: "inline" },
              }}
            >
              {" "}
              {messages.customer_reviews.description_2}
            </Box>
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
            transform: {
              xs: "translate(0, -30px)",
              md: "translate(125px, -20px)",
              lg: "translate(120px, -30px)",
            },
          }}
          onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
          onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
          onMouseUp={(e) => handleEnd(e.clientX)}
          onMouseLeave={(e) => handleEnd(e.clientX)}
          onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
          onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
          onTouchEnd={(e) => handleEnd(e.changedTouches[0].clientX)}
        >
          {/* 🔥 DRAG LAYER (ตัวรับ event จริง) */}
          {/* BACK CARD */}
          {data.length > 1 && (
            <Box
              sx={{
                display: {
                  xs: "none",
                  sm: "none",
                  md: "none",
                  lg: "block",
                },
                position: "absolute",
                right: "11.5%",
              }}
            >
              <VideoCard
                videoId={data[(active + 1) % data.length]?.videoId}
                type="preview"
              />
            </Box>
          )}

          {/* MAIN VIDEO */}
          <Box
            sx={{
              position: "relative",
              width: "100%",
              maxWidth: 530,
              touchAction: "pan-y",
            }}
          >
            <VideoCard videoUrl={data[active]?.videoUrl} type="main" />

            <Box
              aria-hidden="true"
              onMouseDown={(e) => {
                e.stopPropagation();
                handleStart(e.clientX, e.clientY);
              }}
              onMouseMove={(e) => {
                e.stopPropagation();
                handleMove(e.clientX, e.clientY);
              }}
              onMouseUp={(e) => {
                e.stopPropagation();
                handleEnd(e.clientX);
              }}
              onMouseLeave={(e) => {
                e.stopPropagation();
                handleEnd(e.clientX);
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
                handleStart(e.touches[0].clientX, e.touches[0].clientY);
              }}
              onTouchMove={(e) => {
                e.stopPropagation();
                handleMove(e.touches[0].clientX, e.touches[0].clientY);
              }}
              onTouchEnd={(e) => {
                e.stopPropagation();
                handleEnd(e.changedTouches[0].clientX);
              }}
              onClick={() => {
                if (!dragMoved.current) {
                  enableVideoInteraction();
                }
              }}
              sx={{
                position: "absolute",
                inset: 0,
                zIndex: 4,
                borderRadius: "20px",
                pointerEvents: videoInteractive ? "none" : "auto",
                touchAction: "pan-y",
              }}
            />

            {/* ARROW */}
            <IconButton
              onClick={next}
              sx={{
                display: { xs: "none", md: "flex", lg: "none" },
                position: "absolute",
                right: -24,
                top: "50%",
                zIndex: 5,
                background: "#fff",
                width: 48,
                height: 48,
                borderRadius: "50%",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                transform: "translateY(-50%)",
                transition:
                  "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s ease",
                "&:hover": {
                  background: "#fff",
                  transform: "translateY(-50%) scale(1.05)",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                },
              }}
            >
              <IoIosArrowForward size={30} />
            </IconButton>
          </Box>

          <IconButton
            onClick={next}
            sx={{
              display: { xs: "none", lg: "flex" },
              position: "absolute",
              right: "calc(11.5% - 8px)",
              top: "50%",
              zIndex: 5,

              background: "#fff",
              width: 48,
              height: 48,
              borderRadius: "50%",

              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",

              transform: "translateY(-50%)",

              transition:
                "transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s ease",

              "&:hover": {
                background: "#fff",
                transform: "translateY(-50%) scale(1.08)",
                boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
              },

              "&:active": {
                transform: "translateY(-50%) scale(0.9)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
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
            transform: {
              xs: "translate(0, -25px)",
              md: "translate(125px, -25px)",
              lg: "translate(120px, -25px)",
            },
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 530 }}>
            <DotSlider
              total={data.length}
              activeIndex={active}
              onClick={(i: number) => {
                resetVideoInteraction();
                setActive(i);
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
