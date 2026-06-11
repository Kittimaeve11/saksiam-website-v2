"use client";

import Image from "next/image";
import Link from "next/link";

import Stack from "@mui/material/Stack";
import { Box, Grid, Typography } from "@mui/material";

import { footerMenu } from "@/app/config/footer";
import { useLocale } from "@/app/providers/LocaleContext";
import { getWebsiteMourningMode } from "@/app/Utils/websiteTheme";
import { usePathname } from "next/navigation";

import { useEffect, useState } from "react";

/* ====================================================== */
type Policy = {
  id: string;
  titleTH: string;
  titleEN: string;
};

type Contact = {
  companyTH: string;
  companyEN: string;
  addressTH: string;
  addressEN: string;
  fax: string;
  callCenter: string;
  email: string[];
  social: {
    facebook: string;
    line: string;
    youtube: string;
    instagram: string;
    tiktok: string;
  };
};

type FooterProps = {
  initialMourningMode?: boolean;
};

let cachedFooterPolicies: Policy[] | null = null;
let cachedFooterContact: Contact | null = null;
let pendingFooterPolicies: Promise<Policy[]> | null = null;
let pendingFooterContact: Promise<Contact | null> | null = null;

const isExternalHref = (href: string) =>
  href.startsWith("http://") || href.startsWith("https://");

const getFooterPolicies = async () => {
  if (cachedFooterPolicies) return cachedFooterPolicies;
  if (pendingFooterPolicies) return pendingFooterPolicies;

  pendingFooterPolicies = fetch("/api/policies")
    .then((res) => res.json())
    .then((data) => {
      const policies = data.data || [];
      cachedFooterPolicies = policies;
      return policies;
    })
    .finally(() => {
      pendingFooterPolicies = null;
    });

  return pendingFooterPolicies;
};

const getFooterContact = async () => {
  if (cachedFooterContact) return cachedFooterContact;
  if (pendingFooterContact) return pendingFooterContact;

  pendingFooterContact = fetch("/api/contact")
    .then((res) => res.json())
    .then((data: Contact) => {
      cachedFooterContact = data;
      return cachedFooterContact;
    })
    .catch(() => null)
    .finally(() => {
      pendingFooterContact = null;
    });

  return pendingFooterContact;
};

export default function Footer({
  initialMourningMode = false,
}: FooterProps) {

  const { locale } = useLocale();
  const pathname = usePathname();
  const iconSize = 35;

  const [policies, setPolicies] = useState<Policy[]>(cachedFooterPolicies || []);
  const [contact, setContact] = useState<Contact | null>(cachedFooterContact);

  const [loadingPolicies, setLoadingPolicies] = useState(!cachedFooterPolicies);
  const [isMourningMode, setIsMourningMode] = useState(initialMourningMode);

  const [errorPolicies, setErrorPolicies] = useState(false);
  const isHomeMourningMode = pathname === "/" && isMourningMode;

  /* ================= FETCH ================= */
  useEffect(() => {
    let active = true;

    getWebsiteMourningMode().then((enabled) => {
      if (active) setIsMourningMode(enabled);
    });

    // ================= POLICY =================
    getFooterPolicies()
      .then(data => {
        if (!active) return;
        setPolicies(data);
        setLoadingPolicies(false);
      })
      .catch(() => {
        if (!active) return;
        setErrorPolicies(true);
        setLoadingPolicies(false);
      });

    // ================= CONTACT =================
    getFooterContact()
      .then(data => {
        if (!active) return;
        setContact(data);
      })
      .catch(() => {
        if (!active) return;
        setContact(null);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <Box
      component="footer"
      sx={{
        mt: "-1px",
        backgroundColor: isHomeMourningMode ? "#383838" : "var(--main-blue-950)",
      }}
    >
      {/* ================= BACKGROUND ================= */}
      <Grid
        container
        sx={{
          position: "relative",
          justifyContent: "center",
          width: "100%",
          minHeight: "420px",
          overflow: "hidden",
          color: "var(--neutral-white)",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            backgroundImage: "url('/Footer/Footer.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: isHomeMourningMode ? "grayscale(1)" : "none",
            zIndex: 0,
          },
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            background: isHomeMourningMode
              ? "rgba(42, 42, 42, 0.72)"
              : "rgba(28, 53, 99, 0.75)",
            zIndex: 1,
          },
        }}
      >
        {/* ================= CONTAINER ================= */}
        <Grid
          container
          spacing={6}
          sx={{
            width: "100%",
            maxWidth: "1200px",
            mx: "auto",
            position: "relative",
            zIndex: 2,

            px: {
              xs: 2,
              sm: 4,
              md: 15,   // 🔥 ดันเฉพาะตอน 2 คอลัม
              lg: 2      // 🔥 กลับเป็นปกติตอน 3 คอลัม
            },

            py: 8,
          }}
        >
          {/* ================= COLUMN 1 ================= */}
          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <Stack spacing={4}>
              {footerMenu.slice(0, 1).map((menu) => (
                <Grid key={menu.title.th}>
                  <Typography sx={{ fontWeight: "bold", mb: 1, fontSize: "20px" }}>
                    {menu.title[locale]}
                  </Typography>

                  <Stack spacing={0.7}>
                    {menu.items.map((item, i) => {
                      const isExternal = isExternalHref(item.href);

                      return (
                        <Typography
                          key={i}
                          component={isExternal ? "a" : Link}
                          href={item.href}
                          target={isExternal ? "_blank" : undefined}
                          rel={isExternal ? "noopener noreferrer" : undefined}
                          sx={{
                            fontSize: "16px",
                            textDecoration: "none",
                            color: "inherit",
                            "&:hover": {
                              color: "var(--main-yellow-500)",
                            },
                          }}
                        >
                          {item.label[locale]}
                        </Typography>
                      );
                    })}
                  </Stack>
                </Grid>
              ))}

              {/* POLICY */}
              <Grid>
                <Typography sx={{ fontWeight: "bold", mb: 1, fontSize: "20px" }}>
                  {locale === "th" ? "นโยบาย" : "Policies"}
                </Typography>

                <Stack spacing={0.7}>
                  {loadingPolicies ? (
                    // ================= LOADING =================
                    <Typography
                      sx={{
                        fontSize: "16px",
                        color: "inherit",
                      }}
                    >
                      <span className="loading-text">
                        {locale === "th" ? "กำลังโหลด" : "Loading"}
                        <span className="loading-dots">
                          <span></span>
                          <span></span>
                          <span></span>
                        </span>
                      </span>
                    </Typography>

                  ) : errorPolicies ? (
                    // ================= ERROR =================
                    <Typography
                      sx={{
                        fontSize: "16px",
                        color: "inherit",
                        opacity: 0.7,
                      }}
                    >
                      {locale === "th" ? "โหลดข้อมูลไม่สำเร็จ" : "Failed to load"}
                    </Typography>

                  ) : policies.length > 0 ? (
                    // ================= SUCCESS =================
                    policies.map((item) => (
                      <Typography
                        key={item.id}
                        component={Link}
                        href={`/policy/${item.id}`}
                        className="fade-in"
                        sx={{
                          fontSize: "16px",
                          textDecoration: "none",
                          color: "inherit",
                          "&:hover": {
                            color: "var(--main-yellow-500)",
                          },
                        }}
                      >
                        {locale === "th" ? item.titleTH : item.titleEN}
                      </Typography>
                    ))
                  ) : (
                    // ================= NO DATA =================
                    <Typography
                      sx={{
                        fontSize: "16px",
                        color: "inherit",
                        opacity: 0.6,
                      }}
                    >
                      {locale === "th" ? "ไม่มีข้อมูล" : "No data"}
                    </Typography>
                  )}
                </Stack>              </Grid>
            </Stack>
          </Grid>

          {/* ================= COLUMN 2 ================= */}
          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <Stack spacing={4}>
              {footerMenu.slice(1, 2).map((menu) => (
                <Grid key={menu.title.th}>
                  <Typography sx={{ fontWeight: "bold", mb: 1, fontSize: "20px" }}>
                    {menu.title[locale]}
                  </Typography>

                  <Stack spacing={0.7}>
                    {menu.items.map((item, i) => {
                      const isExternal = isExternalHref(item.href);

                      return (
                        <Typography
                          key={i}
                          component={isExternal ? "a" : Link}
                          href={item.href}
                          target={isExternal ? "_blank" : undefined}
                          rel={isExternal ? "noopener noreferrer" : undefined}
                          sx={{
                            fontSize: "16px",
                            textDecoration: "none",
                            color: "inherit",
                            "&:hover": {
                              color: "var(--main-yellow-500)",
                            },
                          }}
                        >
                          {item.label[locale]}
                        </Typography>
                      );
                    })}
                  </Stack>
                </Grid>
              ))}
            </Stack>
          </Grid>

          {/* ================= COLUMN 3 ================= */}
          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <Stack spacing={2}>
              <Typography sx={{ fontWeight: "bold", mb: 1, fontSize: "20px" }}>
                {locale === "th" ? "ติดต่อเรา" : "Contact Us"}
              </Typography>

              {/*  ใช้ API */}
              {contact ? (
                <Stack spacing={0.7} className="fade-in">
                  <Typography sx={{ fontSize: "16px" }}>
                    {locale === "th" ? contact.companyTH : contact.companyEN}
                  </Typography>

                  <Typography sx={{ fontSize: "16px" }}>
                    {locale === "th" ? contact.addressTH : contact.addressEN}
                  </Typography>
                </Stack>
              ) : (
                <span className="loading-text">
                  {locale === "th" ? "กำลังโหลด" : "Loading"}
                  <span className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                </span>
              )}

              {/* CONTACT */}
              <Grid
                container
                spacing={3}
                sx={{
                  alignItems: "center",
                  flexWrap: "wrap",   // 🔥 ให้มัน wrap ได้ตลอด
                }}
              >
                <Grid
                  size={{ xs: 12, sm: "grow" }}   // 🔥 mobile = เต็มแถว
                >
                  <Stack spacing={2}>
                    {/* EMAIL */}
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                      <Grid
                        component="i"
                        className="fi fi-rr-envelope"
                        sx={{
                          fontSize: "18px",
                          color: "var(--main-yellow-500)",
                          display: "flex",
                          alignItems: "center",
                        }}
                      />
                      <Typography sx={{ fontSize: "16px" }}>
                        {contact ? (
                          <span className="fade-in">
                            {contact.email?.[0] || (locale === "th" ? "ไม่มีข้อมูล" : "No data")}
                          </span>
                        ) : (
                          <span className="loading-text">
                            {locale === "th" ? "กำลังโหลด" : "Loading"}
                            <span className="loading-dots">
                              <span></span>
                              <span></span>
                              <span></span>
                            </span>
                          </span>
                        )}
                      </Typography>
                    </Stack>

                    {/* PHONE */}
                    {contact ? (
                      <Stack
                        direction="row"
                        spacing={1.5}
                        sx={{ alignItems: "center" }}
                        className="fade-in"
                      >
                        {/* ICON */}
                        <Grid
                          container
                          sx={{
                            width: 40,
                            height: 40,
                            border: "2.5px solid var(--main-yellow-500)",
                            borderRadius: "10px",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Grid
                            component="i"
                            className="fi fi-sr-phone-call"
                            sx={{
                              fontSize: "20px",
                              color: "var(--main-yellow-500)",
                              lineHeight: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          />
                        </Grid>

                        {/* TEXT */}
                        <Typography
                          sx={{
                            fontSize: "36px",
                            fontWeight: 800,
                            color: "var(--main-yellow-500)",
                          }}
                        >
                          {contact.callCenter}
                        </Typography>
                      </Stack>
                    ) : (
                      <Typography
                        sx={{
                          fontSize: "36px",
                          fontWeight: 800,
                          color: "var(--main-yellow-500)",
                        }}
                      >
                        <span className="loading-text">
                          {locale === "th" ? "กำลังโหลด" : "Loading"}
                          <span className="loading-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                          </span>
                        </span>
                      </Typography>
                    )}

                    {/* SOCIAL */}
                    <Stack direction="row" spacing={1}>
                      <Link href={contact?.social.facebook || "#"} target="_blank">
                        <Image
                          src="/Social/facebook.png"
                          width={iconSize}
                          height={iconSize}
                          alt="facebook"
                        />
                      </Link>

                      <Link href={contact?.social.youtube || "#"} target="_blank">
                        <Image
                          src="/Social/youtube.png"
                          width={iconSize}
                          height={iconSize}
                          alt="youtube"
                        />
                      </Link>

                      <Link href={contact?.social.instagram || "#"} target="_blank">
                        <Image
                          src="/Social/instagram.png"
                          width={iconSize}
                          height={iconSize}
                          alt="instagram"
                        />
                      </Link>

                      <Link href={contact?.social.tiktok || "#"} target="_blank">
                        <Image
                          src="/Social/tiktok.png"
                          width={iconSize}
                          height={iconSize}
                          alt="tiktok"
                        />
                      </Link>
                    </Stack>
                  </Stack>
                </Grid>

                {/* QR CLICK LINE */}
                <Grid
                  sx={{
                    flexBasis: { xs: "100%", sm: "auto" },   // 🔥 ตัวจริง
                    width: { xs: "100%", sm: "auto" },
                    display: "flex",
                    justifyContent: { xs: "flex-start", sm: "center" },
                    mt: { xs: 2, sm: 0 },
                  }}
                >
                  <Link href={contact?.social.line || "#"} target="_blank">
                    <Image
                      src="/Social/Qrcode-Line.png"
                      width={150}
                      height={150}
                      alt="line"
                      style={{ cursor: "pointer" }}
                    />
                  </Link>
                </Grid>
              </Grid>
            </Stack>
          </Grid>
        </Grid>
      </Grid>

      {/* COPYRIGHT */}
      <Grid
        sx={{
          width: "100%",
          backgroundColor: isHomeMourningMode ? "#303030" : "var(--main-blue-950)",
          py: 1.5,
          textAlign: "center",
        }}
      >
        <Typography
          sx={{
            color: "var(--neutral-white)",
            fontSize: { xs: "12px", md: "14px" },
          }}
        >
          © 2026 Copyright: Saksiam Leasing Public Company Limited. All Rights
          Reserved.
        </Typography>
      </Grid>
    </Box>
  );
}
