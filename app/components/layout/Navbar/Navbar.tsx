"use client";

/* ======================================================
   IMPORT
====================================================== */
import Image from "next/image";
import Link from "next/link";
import { Box, Typography, Stack } from "@mui/material";
import { usePathname } from "next/navigation";
import { useLocale } from "@/app/providers/LocaleContext";
import React, { useEffect } from "react";

/* ======================================================
   COMPONENT
====================================================== */
export default function Navbar(): React.ReactElement {
  /* ================================
     Locale
  ================================ */
  const { messages, locale, switchLocale } = useLocale();
  const [contact, setContact] = React.useState<any>(null);

  /* ================================
     Path
  ================================ */
  const pathname = usePathname();

  /* ================================
     Helper
  ================================ */
  const isActive = (path: string): boolean => {
    if (!pathname) return false;
    return pathname === path || pathname.startsWith(path + "/");
  };

  useEffect(() => {

    // CONTACT
    fetch("/api/contact")
      .then(res => res.json())
      .then(data => setContact(data));

  }, []);

  /* ====================================================== */
  return (
    <>
      {/* ======================================================
         DESKTOP NAVBAR
      ====================================================== */}
      <Box
        sx={{
          width: "100%",
          height: "120px",
          backgroundImage: "url('/Navbar/Navbar.jpg')",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",

          position: "relative",
          zIndex: 1, // 🔥 เพิ่มตรงนี้
        }}
      >
        <Box
          sx={{
            height: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: {
              xs: 1,   // มือถือ → padding 8px
              sm: 2,
              md: 4,
              lg: "100px", // desktop เท่าเดิม
            },
            boxSizing: "border-box",
          }}
        >
          {/* LOGO */}
          <Link href="/" style={{ display: "inline-block" }}>
            <Box
              sx={{
                height: {
                  xs: "70px",   // มือถือเล็ก → ยังใหญ่
                  sm: "75px",   // tablet
                  md: "80px",   // laptop
                  lg: "100px",   // desktop
                },
                display: "flex",
                alignItems: "center",
              }}
            >
              <Image
                src="/Icons/Logo_SAKSiam_Text.png"
                alt="SAKSIAM"
                width={400}
                height={100}
                priority
                style={{
                  width: "auto",
                  height: "auto",
                  maxHeight: "100%", // 🔥 ให้พอดีกับ Box
                  objectFit: "contain",
                }}
              />
            </Box>
          </Link>

          {/* RIGHT */}
          <Stack
            spacing={0.5}
            sx={{
              display: { xs: "none", lg: "flex" },
              alignItems: "flex-end",
              textAlign: "right",
              color: "var(--color-primary)",

              position: "relative",
              zIndex: 9999, // 🔥 ดันขึ้นเหนือ Navbar
            }}
          >
            {/* LANGUAGE */}
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Typography
                sx={{
                  cursor: locale === "th" ? "default" : "pointer",
                  fontWeight: locale === "th" ? 600 : 400,
                  color: locale === "th"
                    ? "var(--main-blue-400)"
                    : "var(--color-primary)",
                  transform: locale === "th" ? "translateY(-1px)" : "none",
                }}
                onClick={() => locale !== "th" && switchLocale("th")}
              >
                TH
              </Typography>

              <Typography sx={{ color: "var(--color-primary)" }}>|</Typography>

              <Typography
                sx={{
                  cursor: locale === "en" ? "default" : "pointer",
                  fontWeight: locale === "en" ? 600 : 400,
                  color: locale === "en"
                    ? "var(--main-blue-400)"
                    : "var(--color-primary)",
                  transform: locale === "en" ? "translateY(-1px)" : "none",
                }}
                onClick={() => locale !== "en" && switchLocale("en")}
              >
                ENG
              </Typography>
            </Stack>

            {/* PHONE */}
            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: "center",
                lineHeight: 1, // 🔥 กัน baseline เพี้ยนทั้งแถว
              }}
            >
              {/* ICON */}
              <Box
                component="i"
                className="fi fi-sr-phone-flip"
                sx={{
                  fontSize: 22,
                  color: "var(--main-blue-500)",
                  display: "flex",          // 🔥 สำคัญ
                  alignItems: "center",     // 🔥 ให้อยู่กลางจริง
                  transform: "scaleX(-1) translateY(1px)", // 🔥 ปรับ pixel ให้เป๊ะ
                }}
              />

              {/* TEXT */}
              <Typography
                sx={{
                  fontSize: 26,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  lineHeight: 1,
                }}
              >
                {contact ? (
                  <span className="fade-in">
                    {contact.callCenter}
                  </span>
                ) : (
                  <span className="loading-text">
                    {messages.loading}
                    <span className="loading-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </span>
                  </span>

                )}
              </Typography>
            </Stack>

            {/* MENU */}
            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: "center",
                "& .MuiTypography-root": {
                  lineHeight: 1,
                  pt: 1,
                }
              }}
            >
              <Link href="/about" style={{ textDecoration: "none" }}>
                <Typography
                  sx={{
                    fontWeight: isActive("/about") ? 600 : 400,
                    color: "var(--color-primary)",
                    cursor: "pointer",
                  }}
                >
                  {messages.menu.about}
                </Typography>
              </Link>

              <Typography>|</Typography>

              <Link href="/job" style={{ textDecoration: "none" }}>
                <Typography
                  sx={{
                    fontWeight: isActive("/job") ? 600 : 400,
                    color: "var(--color-primary)",
                    cursor: "pointer",
                  }}
                >
                  {messages.menu.careers}
                </Typography>
              </Link>

              <Typography>|</Typography>

              <Link href="/contact" style={{ textDecoration: "none" }}>
                <Typography
                  sx={{
                    fontWeight: isActive("/contact") ? 600 : 400,
                    color: "var(--color-primary)",
                    cursor: "pointer",
                  }}
                >
                  {messages.menu.contact}
                </Typography>
              </Link>
            </Stack>
          </Stack>
        </Box>
      </Box>

      {/* ======================================================
         MOBILE
      ====================================================== */}
      <Box
        sx={{
          display: { xs: "flex", lg: "none" },
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#FBD53F",
          py: 1.5,
        }}
      >
        {/* LANGUAGE */}
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Typography
            sx={{
              cursor: locale === "th" ? "default" : "pointer",
              fontWeight: locale === "th" ? 600 : 400,
              color: locale === "th"
                ? "var(--main-blue-400)"
                : "var(--color-primary)",
              transform: locale === "th" ? "translateY(-1px)" : "none",
            }}
            onClick={() => locale !== "th" && switchLocale("th")}
          >
            TH
          </Typography>

          <Typography sx={{ color: "var(--color-primary)" }}>|</Typography>

          <Typography
            sx={{
              cursor: locale === "en" ? "default" : "pointer",
              fontWeight: locale === "en" ? 600 : 400,
              color: locale === "en"
                ? "var(--main-blue-400)"
                : "var(--color-primary)",
              transform: locale === "en" ? "translateY(-1px)" : "none",
            }}
            onClick={() => locale !== "en" && switchLocale("en")}
          >
            ENG
          </Typography>
        </Stack>


        {/* MENU */}
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Link href="/about" style={{ textDecoration: "none" }}>
            <Typography
              sx={{
                fontWeight: isActive("/about") ? 600 : 400,
                color: "var(--color-primary)",
                cursor: "pointer",
                transform: isActive("/about") ? "translateY(-1px)" : "none",
              }}
            >
              {messages.menu.about}
            </Typography>
          </Link>

          <Typography sx={{ color: "var(--color-primary)" }}>|</Typography>

          <Link href="/job" style={{ textDecoration: "none" }}>
            <Typography
              sx={{
                fontWeight: isActive("/job") ? 600 : 400,
                color: "var(--color-primary)",
                cursor: "pointer",
                transform: isActive("/job") ? "translateY(-1px)" : "none",
              }}
            >
              {messages.menu.careers}
            </Typography>
          </Link>

          <Typography sx={{ color: "var(--color-primary)" }}>|</Typography>

          <Link href="/contact" style={{ textDecoration: "none" }}>
            <Typography
              sx={{
                fontWeight: isActive("/contact") ? 600 : 400,
                color: "var(--color-primary)",
                cursor: "pointer",
                transform: isActive("/contact") ? "translateY(-1px)" : "none",
              }}
            >
              {messages.menu.contact}
            </Typography>
          </Link>
        </Stack>
      </Box>
    </>
  );
}

