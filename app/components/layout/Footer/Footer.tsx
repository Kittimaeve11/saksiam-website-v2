"use client";

import Image from "next/image";
import Link from "next/link";

import Stack from "@mui/material/Stack";
import { Box, Grid, Typography } from "@mui/material";

import { footerMenu } from "@/app/config/footer";
import { useLocale } from "@/app/providers/LocaleContext";

import { useEffect, useState } from "react";

/* ====================================================== */
type Policy = {
  id: number;
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

export default function Footer() {

  const { locale } = useLocale();
  const iconSize = 35;

  const [policies, setPolicies] = useState<Policy[]>([]);
  const [contact, setContact] = useState<Contact | null>(null);

  /* ================= FETCH ================= */
  useEffect(() => {

    // POLICY
    fetch("/api/policies")
      .then(res => res.json())
      .then(data => setPolicies(data.data || []));

    // CONTACT ( ใหม่)
    fetch("/api/contact")
      .then(res => res.json())
      .then(data => setContact(data));

  }, []);

  return (
    <Box component="footer">
      {/* ================= BACKGROUND ================= */}
      <Grid
        container
        sx={{
          justifyContent: "center",
          width: "100%",
          minHeight: "420px",
          backgroundImage: `
      linear-gradient(rgba(28,53,99,0.75), rgba(28,53,99,0.75)),
      url('/Footer/Footer.png')
    `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          color: "var(--neutral-white)",
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
                    {menu.items.map((item, i) => (
                      <Typography
                        key={i}
                        component={Link}
                        href={item.href}
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
                    ))}
                  </Stack>
                </Grid>
              ))}

              {/* POLICY */}
              <Grid>
                <Typography sx={{ fontWeight: "bold", mb: 1, fontSize: "20px" }}>
                  {locale === "th" ? "นโยบาย" : "Policies"}
                </Typography>

                <Stack spacing={0.7}>
                  {policies.map((item) => (
                    <Typography
                      key={item.id}
                      component={Link}
                      href={`/policy/${item.id}`}
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
                  ))}
                </Stack>
              </Grid>
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
                    {menu.items.map((item, i) => (
                      <Typography
                        key={i}
                        component={Link}
                        href={item.href}
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
                    ))}
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
              {contact && (
                <Stack spacing={0.7}>
                  <Typography sx={{ fontSize: "16px" }}>
                    {locale === "th" ? contact.companyTH : contact.companyEN}
                  </Typography>

                  <Typography sx={{ fontSize: "16px" }}>
                    {locale === "th" ? contact.addressTH : contact.addressEN}
                  </Typography>
                </Stack>
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
                        {contact?.email?.[0]}
                      </Typography>
                    </Stack>

                    {/* PHONE */}
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
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
                            fontSize: "20px",       //  ลดนิดจะบาลานซ์กว่า
                            color: "var(--main-yellow-500)",
                            lineHeight: 0,          //  ตัวสำคัญ (แก้ลอย)
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        />
                      </Grid>


                      <Typography
                        sx={{
                          fontSize: "36px",
                          fontWeight: 800,
                          color: "var(--main-yellow-500)",
                        }}
                      >
                        {contact?.callCenter}
                      </Typography>
                    </Stack>

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
          backgroundColor: "var(--main-blue-950)",
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
