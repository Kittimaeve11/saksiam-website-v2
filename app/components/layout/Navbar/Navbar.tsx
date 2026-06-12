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
import { getWebsiteMourningMode } from "@/app/Utils/websiteTheme";

/* ======================================================
   COMPONENT
====================================================== */
type ContactInfo = {
  callCenter: string;
};

type NavbarProps = {
  initialMourningMode?: boolean;
};

let cachedNavbarContact: ContactInfo | null = null;
let pendingNavbarContact: Promise<ContactInfo | null> | null = null;

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

export default function Navbar({
  initialMourningMode = false,
}: NavbarProps): React.ReactElement {
  /* ================================
     Locale
  ================================ */
  const { messages, locale, switchLocale } = useLocale();
  const [contact, setContact] = React.useState<ContactInfo | null>(cachedNavbarContact);
  const [isMourningMode, setIsMourningMode] =
    React.useState(initialMourningMode);

  /* ================================
     Path
  ================================ */
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isHomeMourningMode = isHomePage && isMourningMode;

  /* ================================
     Helper
  ================================ */
  const isActive = (path: string): boolean => {
    if (!pathname) return false;
    return pathname === path || pathname.startsWith(path + "/");
  };

  useEffect(() => {
    let active = true;

    getNavbarContact().then(data => {
      if (active) setContact(data);
    });

    getWebsiteMourningMode().then((enabled) => {
      if (active) setIsMourningMode(enabled);
    });

    return () => {
      active = false;
    };
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
          backgroundImage: "url('/Navbar/Navbar.png')",

          "@media (max-width:1200px)": {
            height: "170px",
            backgroundImage: "url('/Navbar/Navbar_Tablet.png')",
            backgroundSize: "100% 100%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          },

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
          backgroundColor: isHomeMourningMode ? "#f4f4f4" : "transparent",
          filter: isHomeMourningMode ? "grayscale(1)" : "none",

          position: "relative",
          zIndex: 1,
        }}
      >
        {isMourningMode && (
          <Box
            aria-hidden
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              width: {
                xs: 82,
                sm: 100,
                md: 118,
                lg: 136,
              },
              aspectRatio: "1 / 1",
              zIndex: 30,
              pointerEvents: "none",
            }}
          >
            <Image
              src="/commemorate/79c1ca87-4998-4627-b916-d2dfc2acd89f.png"
              alt=""
              fill
              sizes="136px"
              style={{
                objectFit: "contain",
                objectPosition: "top right",
              }}
              className="mourning-ribbon-desktop"
            />
            <Image
              src="/commemorate/79c1ca87-4998-4627-b916-d2dfc2acd89f%20copy.png"
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

        {/* ================= MAIN BAR ================= */}
        <Box
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
                  lg: 17,
                  xl: "190px",
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
          {/* LOGO */}
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

          {/* RIGHT */}
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
            {/* LANGUAGE */}
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

              <Typography sx={{ color: "var(--color-primary)" }}>|</Typography>

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

            {/* PHONE */}
            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: "center",
                lineHeight: 1,
              }}
            >
              {/* ICON */}
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
                    <span>{contact.callCenter}</span>
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
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                  }}
                >
                  {messages.menu.about}
                </Typography>
              </Link>

              <Typography sx={{ color: "var(--color-primary)" }}>|</Typography>

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

              <Typography sx={{ color: "var(--color-primary)" }}>|</Typography>

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
         MOBILE
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
          {/* LANGUAGE */}
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
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

            <Typography sx={{ color: "var(--color-primary)" }}>|</Typography>

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


          {/* MENU */}
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
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

            <Typography sx={{ color: "var(--color-primary)" }}>|</Typography>

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

            <Typography sx={{ color: "var(--color-primary)" }}>|</Typography>

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

