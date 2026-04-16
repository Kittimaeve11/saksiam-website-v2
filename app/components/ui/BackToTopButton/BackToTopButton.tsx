"use client";

/* ======================================================
   IMPORT
====================================================== */
import { useEffect, useState } from "react";
import { Box, Fade } from "@mui/material";
import { IoMdArrowRoundUp } from "react-icons/io";
import { usePathname } from "next/navigation";

/* ======================================================
   TYPE
====================================================== */
type Props = {
  hide?: boolean; // 🔥 รับ prop จาก gallery modal
};

/* ======================================================
   COMPONENT
====================================================== */
export default function BackToTopButton({ hide = false }: Props) {
  const [show, setShow] = useState(false);
  const pathname = usePathname();

  /* ======================================================
     🔥 เช็ค route + prop
  ====================================================== */
  const isGalleryRoute = pathname?.startsWith("/gallery");
  const shouldHide = hide || isGalleryRoute;

  /* ======================================================
     SCROLL EVENT
  ====================================================== */
  useEffect(() => {
    if (shouldHide) return; // 🔥 ไม่ต้อง listen

    const handleScroll = () => {
      setShow(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [shouldHide]);

  /* ======================================================
     SCROLL TO TOP
  ====================================================== */
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* ======================================================
     🔥 ซ่อนจริง
  ====================================================== */
  if (shouldHide) return null;

  /* ====================================================== */
  return (
    <Fade in={show}>
      <Box
        onClick={scrollToTop}
        sx={{
          position: "fixed",
          bottom: { xs: 20, md: 30 },
          right: { xs: 20, md: 30 },
          zIndex: 9999,

          width: 50,
          height: 50,
          borderRadius: "50%",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          background: "var(--color-primary)",
          color: "#fff",

          cursor: "pointer",
          boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
          transition: "all .25s ease",

          "&:hover": {
            transform: "translateY(-4px) scale(1.05)",
            boxShadow: "0 12px 25px rgba(0,0,0,0.25)",
          },

          "@keyframes wiggle": {
            "0%,100%": { transform: "rotate(0deg)" },
            "50%": { transform: "rotate(5deg)" },
          },

          "&:hover .icon": {
            animation: "wiggle 0.6s ease-in-out infinite",
          },
        }}
      >
        <Box
          className="icon"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 0,
          }}
        >
          <IoMdArrowRoundUp size={30} />
        </Box>
      </Box>
    </Fade>
  );
}