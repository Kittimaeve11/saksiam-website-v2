"use client";

/* ======================================================
   IMPORT
   นำเข้า Component, Hook และเครื่องมือที่ใช้
====================================================== */
import Image from "next/image";
import Link from "next/link";
import { Box, Typography, Stack } from "@mui/material";
import { usePathname } from "next/navigation";
import { useLocale } from "@/app/providers/LocaleContext";
import React, { useEffect } from "react";
import { getWebsiteMourningMode } from "@/app/Utils/websiteTheme";
import LoadingText from "@/app/components/ui/LoadingText/LoadingText";

/* ======================================================
   TYPE
   กำหนดรูปแบบข้อมูล
====================================================== */
type ContactInfo = {
  callCenter: string;
};

type NavbarProps = {
  initialMourningMode?: boolean;
};

/* ======================================================
   CACHE
   เก็บข้อมูล Contact เพื่อลดการเรียก API ซ้ำ
====================================================== */
let cachedNavbarContact: ContactInfo | null = null;
let pendingNavbarContact: Promise<ContactInfo | null> | null = null;

/* ======================================================
   FETCH CONTACT
   ดึงข้อมูล Contact จาก API
====================================================== */
const getNavbarContact = async () => {
  if (cachedNavbarContact) return cachedNavbarContact;
  if (pendingNavbarContact) return pendingNavbarContact;

  pendingNavbarContact = fetch("/api/contact")
    .then((res) => res.json())
    .then((data: ContactInfo) => {
      cachedNavbarContact = data;
      return cachedNavbarContact;
    })
    .catch(() => null)
    .finally(() => {
      pendingNavbarContact = null;
    });

  return pendingNavbarContact;
};

/* ======================================================
   COMPONENT
   Navbar หลักของเว็บไซต์
====================================================== */
export default function Navbar({
  initialMourningMode = false,
}: NavbarProps): React.ReactElement {
  /* ================================
     Locale
     จัดการภาษาและข้อความ
  ================================ */
  const { messages, locale, switchLocale } = useLocale();
  const [contact, setContact] = React.useState<ContactInfo | null>(cachedNavbarContact);
  const [isMourningMode, setIsMourningMode] =
    React.useState(initialMourningMode);

  /* ================================
     Path
     ตรวจสอบหน้าปัจจุบัน
  ================================ */
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isHomeMourningMode = isHomePage && isMourningMode;

  /* ================================
     Helper
     ตรวจสอบเมนูที่กำลังใช้งาน
  ================================ */
  const isActive = (path: string): boolean => {
    if (!pathname) return false;
    return pathname === path || pathname.startsWith(path + "/");
  };

  /* ================================
     โหลดข้อมูลเริ่มต้น
     ดึงข้อมูล Contact และโหมดไว้อาลัย
  ================================ */
  useEffect(() => {
    let active = true;

    getNavbarContact().then(data => {
      if (active) setContact(data);
    });

    getWebsiteMourningMode().then((enabled) => {
      if (active) setIsMourningMode(enabled);
    });

    // ป้องกันการอัปเดต State หลัง Component ถูกยกเลิก
    return () => {
      active = false;
    };
  }, []);

  /* ====================================================== */
  return (
    <>
      {/* ======================================================
         DESKTOP NAVBAR
         แสดงแถบนำทางสำหรับทุกขนาดหน้าจอ
      ====================================================== */}
      <Box
        sx={{
          width: "100%",
          height: "120px",
          backgroundImage: "url('/Navbar/Navbar.png')",

          // Tablet
          "@media (max-width:1200px)": {
            height: "170px",
            backgroundImage: "url('/Navbar/Navbar_Tablet.png')",
            backgroundSize: "100% 100%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          },

          // Mobile
          "@media (max-width:764px)": {
            height: "150px",
            backgroundImage: "url('/Navbar/Navbar_Mobile.png')",
            backgroundSize: "100% 100%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          },

          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%",
          backgroundPosition: "center",

          // เปลี่ยนเป็นโหมดไว้อาลัย
          backgroundColor: isHomeMourningMode ? "#f4f4f4" : "transparent",
          filter: isHomeMourningMode ? "grayscale(1)" : "none",

          position: "relative",
          zIndex: 1,
        }}
      >
        {/* แสดงริบบิ้นไว้อาลัย */}
        {isMourningMode && (
          <Box
            aria-hidden
            sx={{
              position: "absolute",
              top: 0,
              right: {
                xs: 0,
                sm: 0,
                md: 0,
                lg: -8,
              },
              width: {
                xs: 82,
                sm: 100,
                md: 118,
                lg: 120,
              },
              aspectRatio: "1 / 1",
              lineHeight: 0,
              overflow: "visible",
              zIndex: 30,
              pointerEvents: "none",
            }}
          >
            {/* ริบบิ้นสำหรับ Desktop */}
            <Image
              src="/commemorate/mourning-ribbon-desktop.png.png"
              alt=""
              fill
              sizes="136px"
              style={{
                objectFit: "contain",
                objectPosition: "top right",
              }}
              className="mourning-ribbon-desktop"
            />

            {/* ริบบิ้นสำหรับ Mobile */}
            <Image
              src="/commemorate/mourning-badge-transparent.png"
              alt=""
              fill
              sizes="116px"
              style={{
                objectFit: "contain",
                objectPosition: "top right",
              }}
              className="mourning-ribbon-mobile"
            />
          </Box>
        )}
        {/* ======================================================
            NAVBAR MAIN CONTAINER
            จัดวางโครงสร้างหลักของ Navbar และกำหนดระยะห่างของแต่ละส่วน
        ====================================================== */}        <Box
          sx={{
            height: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: {
              xs: 2,
              sm: 2,
              md: 4,
              lg: 4,
              xl: "100px",
            },
            pr: isMourningMode
              ? {
                xs: 10,
                sm: 12,
                md: 15,
                lg: 13,
                xl: "145px",
              }
              : {
                xs: 2,
                sm: 2,
                md: 4,
                lg: 4,
                xl: "100px",
              },
            boxSizing: "border-box",
          }}
        >
          {/* โลโก้เว็บไซต์ */}
          <Link href="/" style={{ display: "block", width: "fit-content" }}>
            <Box
              sx={{
                position: "relative",

                width: {
                  xs: "350px",
                  sm: "360px",
                  md: "400px",
                },

                aspectRatio: "4 / 1",

                maxWidth: {
                  xs: "calc(100vw - 32px)",
                  sm: "360px",
                  md: "400px",
                },

                mt: {
                  xs: "-65px",
                  sm: "-64px",
                  md: "-60px",
                },

                pr: {
                  xs: 0,
                  sm: 0,
                  md: 0,
                },

                left: {
                  xs: "-8px",
                  sm: 0,
                  md: 0,
                },

                "@media (max-width:441px)": {
                  width: "300px",
                  maxWidth: "calc(100vw - 28px)",
                  left: "-8px",
                },

                "@media (max-width:415px)": {
                  width: "295px",
                  left: "-18px",
                },

                "@media (max-width:360px)": {
                  width: "280px",
                  left: "-18px",
                },
                "@media (max-width:340px)": {
                  width: "260px",
                  left: "-18px",
                },

                "@media (min-width:1201px)": {
                  mt: "0px",
                },

              }}
            >
              <Image
                src="/Icons/Logo_SAKSiam_Text.png"
                alt="SAKSIAM"
                fill
                priority
                sizes="(max-width: 600px) 350px, 400px"
                style={{
                  objectFit: "contain",
                }}
              />
            </Box>
          </Link>

          {/* ข้อมูลด้านขวา (แสดงเฉพาะ Desktop) */}
          <Stack
            spacing={0.5}
            sx={{
              display: "none",
              "@media (min-width:1201px)": {
                display: "flex",
              },
              alignItems: "flex-end",
              textAlign: "right",
              color: "var(--color-primary)",

              position: "relative",
              zIndex: 9999,
            }}
          >
            {/* สลับภาษา */}
            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: "center",
                flexWrap: "nowrap",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >

              {/* ภาษาไทย */}
              <Typography
                sx={{
                  cursor: locale === "th" ? "default" : "pointer",
                  fontWeight: locale === "th" ? 600 : 400,
                  color: locale === "th"
                    ? "var(--color-primary)"
                    : "var(--main-blue-300)",
                  transform: locale === "th" ? "translateY(-1px)" : "none",
                  whiteSpace: "nowrap",
                }}
                onClick={() => locale !== "th" && switchLocale("th")}
              >
                TH
              </Typography>

              {/* ตัวคั่น */}
              <Typography sx={{ color: "var(--color-primary)" }}>|</Typography>

              {/* ภาษาอังกฤษ */}
              <Typography
                sx={{
                  cursor: locale === "en" ? "default" : "pointer",
                  whiteSpace: "nowrap",
                  fontWeight: locale === "en" ? 600 : 400,
                  color: locale === "en"
                    ? "var(--color-primary)"
                    : "var(--main-blue-300)",
                  transform: locale === "en" ? "translateY(-1px)" : "none",
                }}
                onClick={() => locale !== "en" && switchLocale("en")}
              >
                ENG
              </Typography>
            </Stack>

            {/* ข้อมูลเบอร์ติดต่อ */}
            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: "center",
                lineHeight: 1,
              }}
            >
              {/* ไอคอนโทรศัพท์ */}
              <Box
                component="i"
                className="fi fi-sr-phone-flip"
                sx={{
                  fontSize: 22,
                  color: "var(--main-blue-500)",
                  display: "flex",
                  alignItems: "center",
                  transform: "scaleX(-1) translateY(1px)",
                }}
              />

              {/* หมายเลข Call Center */}
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
                  <span className="fade-in">{contact.callCenter}</span>
                ) : (
                  <LoadingText text={messages.loading} />
                )}
              </Typography>
            </Stack>

            {/* เมนูนำทาง */}
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
              {/* เมนูเกี่ยวกับเรา */}
              <Link href="/about" style={{ textDecoration: "none" }}>
                <Typography
                  sx={{
                    fontWeight: isActive("/about") ? 600 : 400,
                    color: "var(--color-primary)",
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                  }}
                >
                  {messages.menu.about}
                </Typography>
              </Link>

              {/* ตัวคั่นเมนู */}
              <Typography sx={{ color: "var(--color-primary)" }}>|</Typography>

              {/* เมนูร่วมงานกับเรา */}
              <Link href="https://saksiam.com/job" style={{ textDecoration: "none" }}>
                <Typography
                  sx={{
                    fontWeight: isActive("/job") ? 600 : 400,
                    color: "var(--color-primary)",
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                  }}
                >
                  {messages.menu.careers}
                </Typography>
              </Link>

              {/* ตัวคั่นเมนู */}
              <Typography sx={{ color: "var(--color-primary)" }}>|</Typography>

              {/* เมนูติดต่อเรา */}
              <Link href="/contact" style={{ textDecoration: "none" }}>
                <Typography
                  sx={{
                    fontWeight: isActive("/contact") ? 600 : 400,
                    color: "var(--color-primary)",
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                  }}
                >
                  {messages.menu.contact}
                </Typography>
              </Link>
            </Stack>
          </Stack>
        </Box>


        {/* ======================================================
            MOBILE NAVBAR
            แสดงเมนูสำหรับ Tablet และ Mobile
        ====================================================== */}
        <Box
          sx={{
            position: "absolute",
            bottom: 10,
            left: "50%",
            transform: "translateX(-50%)",

            display: {
              xs: "flex",
              md: "flex",
            },
            "@media (min-width:1201px)": {
              display: "none",
            },

            flexDirection: "column",
            alignItems: "center",

            zIndex: 10,
            color: "#fff",
            // textShadow: "0 2px 6px rgba(0,0,0,0.5)",
          }}
        >
          {/* สลับภาษา */}
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            {/* ภาษาไทย */}
            <Typography
              sx={{
                cursor: locale === "th" ? "default" : "pointer",
                whiteSpace: "nowrap",
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

            {/* ตัวคั่น */}
            <Typography sx={{ color: "var(--color-primary)" }}>|</Typography>

            {/* ภาษาอังกฤษ */}
            <Typography
              sx={{
                cursor: locale === "en" ? "default" : "pointer",
                whiteSpace: "nowrap",
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


          {/* เมนูนำทาง */}
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>

            {/* เมนูเกี่ยวกับเรา */}
            <Link href="/about" style={{ textDecoration: "none" }}>
              <Typography
                sx={{
                  fontWeight: isActive("/about") ? 600 : 400,
                  whiteSpace: "nowrap",
                  color: "var(--color-primary)",
                  cursor: "pointer",
                  transform: isActive("/about") ? "translateY(-1px)" : "none",
                }}
              >
                {messages.menu.about}
              </Typography>
            </Link>

            {/* ตัวคั่น */}
            <Typography sx={{ color: "var(--color-primary)" }}>|</Typography>

            {/* เมนูร่วมงานกับเรา */}
            <Link href="https://saksiam.com/job" style={{ textDecoration: "none" }}>
              <Typography
                sx={{
                  fontWeight: isActive("/job") ? 600 : 400,
                  whiteSpace: "nowrap",
                  color: "var(--color-primary)",
                  cursor: "pointer",
                  transform: isActive("/job") ? "translateY(-1px)" : "none",
                }}
              >
                {messages.menu.careers}
              </Typography>
            </Link>

            {/* ตัวคั่น */}
            <Typography sx={{ color: "var(--color-primary)" }}>|</Typography>

            {/* เมนูติดต่อเรา */}
            <Link href="/contact" style={{ textDecoration: "none" }}>
              <Typography
                sx={{
                  fontWeight: isActive("/contact") ? 600 : 400,
                  whiteSpace: "nowrap",
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
      </Box>

    </>
  );
}

