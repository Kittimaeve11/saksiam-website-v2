"use client";

/* ====================================================== */
import Image from "next/image";
import { Box, Typography } from "@mui/material";
import { useLocale } from "@/app/providers/LocaleContext";
import Link from "next/link"; // 🔥 เพิ่ม

/* ====================================================== */
type News = {
  id: number;
  categoryTH: string;
  categoryEN: string;
  titleTH: string;
  titleEN: string;
  createdAt: string;
  images: string[];
  views?: number;
};

/* ====================================================== */
const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  return date.toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/* ====================================================== */
export default function NewsCardItem({ item }: { item: News }) {
  const { locale } = useLocale();

  const category = locale === "th" ? item.categoryTH : item.categoryEN;
  const title = locale === "th" ? item.titleTH : item.titleEN;

  const href = `/news-activities/${item.id}`; // 🔥 route

  return (
    <Link
      href={href}
      style={{ textDecoration: "none", display: "block", height: "100%" }}
    >
      <Box
        sx={{
          borderRadius: "20px",
          background: "#fff",
          overflow: "hidden",
          border: "1px solid #D8DADC",

          boxShadow: `
            0 2px 6px rgba(0,0,0,0.04),
            0 12px 24px rgba(0,0,0,0.06)
          `,

          cursor: "pointer",
          transition: "all .3s ease",

          display: "flex",
          flexDirection: "column",
          height: "100%", // 🔥 สำคัญ

          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: `
              0 6px 12px rgba(0,0,0,0.06),
              0 20px 32px rgba(0,0,0,0.10)
            `,
            "& .image-overlay": {
              background: "rgba(0,0,0,0.7)",
            },
          },
        }}
      >
        {/* ================= IMAGE ================= */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            aspectRatio: "16/9",
            overflow: "hidden",
          }}
        >
          <Image
            src={item.images[0]}
            alt=""
            fill
            sizes="(max-width: 600px) 100vw,
                   (max-width: 900px) 50vw,
                   25vw"
            style={{
              objectFit: "cover",
              transition: "transform .4s ease",
            }}
          />

          <Box
            className="image-overlay"
            sx={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0)",
              zIndex: 1,
            }}
          />
        </Box>

        {/* ================= CONTENT ================= */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
          }}
        >
          {/* TAG */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              alignSelf: "flex-start",
              px: 2.5,
              py: "6px",
              borderRadius: "999px",
              background: "var(--color-info-bg)",
              color: "var(--color-info)",
              fontSize: 12,
              fontWeight: 600,
              mb: 1,
            }}
          >
            {category}
          </Box>

          {/* TITLE */}
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 600,
              color: "var(--gray-800)",
              lineHeight: 1.7,
              mb: 2,

              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",

              textAlign: "justify",
              textJustify: "inter-word",
              minHeight: "74px",
            }}
          >
            {title}
          </Typography>

          {/* FOOTER */}
          <Box sx={{ mt: "auto" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                color: "var(--gray-500)",
                fontSize: 14,
              }}
            >
              {/* DATE */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box component="i" className="fi fi-br-calendar" sx={{ fontSize: 16 }} />
                <Typography sx={{ fontSize: 14 }}>
                  {formatDate(item.createdAt)}
                </Typography>
              </Box>

              {/* DIVIDER */}
              <Typography sx={{ color: "#cbd5e1" }}>|</Typography>

              {/* VIEW */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box component="i" className="fi fi-sr-eye" sx={{ fontSize: 16 }} />
                <Typography sx={{ fontSize: 14 }}>
                  {(item.views || 1777).toLocaleString()} ครั้ง
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Link>
  );
}