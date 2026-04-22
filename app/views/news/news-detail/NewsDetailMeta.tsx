"use client";

/* ====================================================== */
import { Box, Typography } from "@mui/material";
import { useLocale } from "@/app/providers/LocaleContext";
import Image from "next/image";

/* ====================================================== */
type Props = {
  createdAt: string;
  titleTH: string;
  titleEN: string;
  social?: {
    facebook?: string;
    line?: string;
    instagram?: string;
  };
};

/* ====================================================== */
// 🔥 FORMAT DATE
const formatDate = (dateString: string, locale: string) => {
  const date = new Date(dateString);

  if (locale === "th") {
    return date.toLocaleDateString("th-TH", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

/* ====================================================== */
export default function NewsDetailMeta({
  createdAt,
  titleTH,
  titleEN,
  social,
}: Props) {
  const { locale } = useLocale();

  return (
    <>
      {/* ================= META ================= */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center", // 🔥 จัดกลางแนวตั้ง
          my: 3,
          mx: 2,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {/* LEFT */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center", // 🔥 สำคัญมาก
            gap: 2,
            color: "#6b7280",
            fontSize: "14px",
          }}
        >
          {/* DATE */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center", // 🔥 ทำให้ icon ตรงกลาง
              gap: 1,
            }}
          >
            <Box
              component="i"
              className="fi fi-br-calendar"
              sx={{
                fontSize: 16,
                display: "flex",
                alignItems: "center",
              }}
            />
            <Typography sx={{ lineHeight: 1 }}>
              {formatDate(createdAt, locale)}
            </Typography>
          </Box>

          {/* | */}
          <Typography sx={{ color: "#cbd5e1" }}>|</Typography>

          {/* VIEW */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box
              component="i"
              className="fi fi-sr-eye"
              sx={{
                fontSize: 16,
                display: "flex",
                alignItems: "center",
              }}
            />
            <Typography sx={{ lineHeight: 1 }}>
              7,151 ครั้ง
            </Typography>
          </Box>
        </Box>

        {/* RIGHT: SOCIAL */}
        <Box sx={{ display: "flex", gap: 1.5 }}>
          {[
            {
              key: "line",
              url: social?.line,
              img: "/Social/lineicon-CF2kmLSj.png",
            },
            {
              key: "facebook",
              url: social?.facebook,
              img: "/Social/facebookicon-ClQapmHz.png",
            },
            {
              key: "instagram",
              url: social?.instagram,
              img: "/Social/instagramicon-BKDF1ohf.png",
            },
          ]
            .filter((item) => item.url)
            .map((item) => (
              <Box
                key={item.key}
                component="a"
                href={item.url}
                target="_blank"
                sx={{
                  width: 40,
                  height: 40,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <Image src={item.img} alt={item.key} width={40} height={40} />
              </Box>
            ))}
        </Box>
      </Box>

      {/* ================= TITLE ================= */}
      <Typography
        sx={{
          fontSize: { xs: "22px", md: "28px" },
          fontWeight: 600,
          color: "var(--color-primary)",
          mb: 2,
          lineHeight: 1.4,
        }}
      >
        {locale === "en" ? titleEN : titleTH}
      </Typography>
    </>
  );
}