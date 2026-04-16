"use client";

import Image from "next/image";
import { Box, Typography } from "@mui/material";
import { IoIosArrowForward } from "react-icons/io";
import { useLocale } from "@/app/providers/LocaleContext";
import Link from "next/link";

/* ====================================================== */
type Variant =
  | "default"
  | "readmore"
  | "overlay"
  | "simple"
  | "minimal"

type News = {
  id: number;

  categoryTH: string;
  categoryEN: string;

  titleTH: string;
  titleEN: string;

  detailTH: string;
  detailEN: string;

  createdAt: string;
  images: string[];
};


type Props = {
  item: News;
  variant?: Variant;
};

/* ======================================================
    FORMAT DATE (TH / EN)
====================================================== */
const formatDate = (dateString: string, locale: "th" | "en" = "th") => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";
  if (locale === "th") {
    return date.toLocaleDateString("th-TH", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

/* ====================================================== */
export default function NewsCard({ item, variant = "default" }: Props) {
  const { messages, locale } = useLocale();

  const category = locale === "th" ? item.categoryTH : item.categoryEN;
  const title = locale === "th" ? item.titleTH : item.titleEN;
  const detail = locale === "th" ? item.detailTH : item.detailEN;
  const href = `/news-activities/${item.id}`;
  const formattedDate = item.createdAt
    ? formatDate(item.createdAt, locale)
    : "-";
  const imageSrc = item.images?.[0] || "/images/placeholder.jpg";

  /* ======================================================
     OVERLAY
  ====================================================== */
  if (variant === "overlay") {
    return (
      <Link
        href={href}
        style={{ textDecoration: "none", display: "block", height: "100%" }}
      >
        <Box
          sx={{
            position: "relative",
            borderRadius: "20px",
            overflow: "hidden",
            height: "100%",
            cursor: "pointer",

            //  ใส่ transition ให้รูปก่อน
            "& img": {
              transition: "transform .4s ease",
            },

            //  hover แยกออกมา
            "&:hover .image-overlay": {
              background: "rgba(0,0,0,0.7)",
            },

            "&:hover img": {
              transform: "scale(1.05)",
            },
          }}
        >
          {/* IMAGE */}
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: "100%",
            }}
          >
            <Image
              src={imageSrc}
              alt={title || "news image"}
              fill
              sizes="(max-width: 600px) 100vw,
            (max-width: 900px) 50vw,
            25vw"
              style={{
                objectFit: "cover",
                transition: "transform .4s ease",
              }}
            />

            {/*  OVERLAY BASE */}
            <Box
              className="image-overlay"
              sx={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0)", // ปกติใส
                transition: "all .3s ease",
                zIndex: 1,
              }}
            />

            {/*  GRADIENT TEXT */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 40%, transparent 70%)",
                zIndex: 2,
              }}
            />
          </Box>

          {/*  TEXT */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              p: 2,
              zIndex: 3,
            }}
          >
            <Typography
              sx={{
                color: "#fff",
                fontWeight: 600,
                fontSize: "18px",
                lineHeight: 1.5,

                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {title}
            </Typography>
          </Box>
        </Box>
      </Link>
    );
  }
  /* ======================================================
     simple
  ====================================================== */
  if (variant === "simple") {
    return (
      <Link
        href={href}
        style={{ textDecoration: "none", display: "block", height: "100%" }}
      >
        <Box
          sx={{
            borderRadius: "20px",
            background: "#fff",
            boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
            overflow: "hidden",
            transition: "all .3s cubic-bezier(0.4, 0, 0.2, 1)",
            display: "flex",
            flexDirection: "column",
            cursor: "pointer",

            "&:hover": {
              transform: "translateY(-4px)",

              "& img": {
                transition: "transform .4s ease",
              },
              "&:hover img": {
                transform: "scale(1.05)",
              },
            },
          }}
        >
          {/* IMAGE */}
          <Box
            sx={{
              position: "relative",
              width: "100%",
              pt: "56.25%",
              overflow: "hidden",
            }}
          >
            <Image
              src={imageSrc}
              alt={title || "news image"}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              style={{
                objectFit: "cover",
                transition: "transform .4s ease",
              }}
            />

            {/*  OVERLAY */}
            <Box
              className="image-overlay"
              sx={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0)",
                transition: "all .3s ease",
                zIndex: 1,
              }}
            />
          </Box>

          {/* CONTENT */}
          <Box
            sx={{
              p: 2.5,
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
            }}
          >
            {/* TITLE */}
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: 18,
                color: "var(--main-blue-700)",
                lineHeight: 1.5,
                mb: 1.5,

                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",

                textAlign: "justify",
                textJustify: "inter-word",

                minHeight: "81px",
              }}
            >
              {title}
            </Typography>

            {/* READ MORE */}
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 600,
                color: "var(--color-info)",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
                mt: "auto",
                "&:hover": {
                  textDecoration: "none",
                  color: "var(--color-info-hover)",
                },
              }}
            >
              {messages.news.read_more_short}
              <IoIosArrowForward size={16} />
            </Typography>
          </Box>
        </Box>
      </Link>
    );
  }

  /* ======================================================
   MINIMAL ( ใช้แบบในรูป)
====================================================== */
  if (variant === "minimal") {
    return (
      <Link
        href={href}
        style={{
          textDecoration: "none",
          display: "block",
          height: "100%",
          width: "100%",

        }}
      >
        <Box
          sx={{
            borderRadius: "28px",
            background: "#fff",
            border: "1px solid #D8DADC",

            boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
            overflow: "hidden",

            display: "flex",
            flexDirection: "column",
            height: "100%",
            transition: "all .3s cubic-bezier(0.4, 0, 0.2, 1)",
            cursor: "pointer",

            "&:hover": {
              transform: "translateY(-3px)",
              boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
            },
          }}
        >
          {/* IMAGE */}
          <Box
            sx={{
              position: "relative",
              width: "100%",
              pt: "56.25%",
              overflow: "hidden",
            }}
          >
            <Image
              src={imageSrc}
              alt={title || "news image"}
              fill
              sizes="(max-width: 600px) 100vw,
                   (max-width: 900px) 50vw,
                   25vw"
              style={{
                objectFit: "cover",
              }}
            />
          </Box>

          {/* CONTENT */}
          <Box
            sx={{
              p: 2.5,
              display: "flex",
              flexDirection: "column",
              gap: 1, //  ใช้ gap แทน mb
              flexGrow: 1, //  ให้ content เต็มการ์ด
            }}
          >
            {/* TITLE */}
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: 18,
                color: "var(--main-blue-700)",
                lineHeight: 1.5,

                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {title}
            </Typography>

            {/* DETAIL */}
            <Typography
              sx={{
                fontSize: 16,
                color: "#667085",
                lineHeight: 1.6,

                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",

              }}
            >
              {detail || " "} {/*  กันไม่มีข้อมูล */}
            </Typography>
          </Box>
        </Box>
      </Link>
    );
  }


  /* ======================================================
     DEFAULT
  ====================================================== */
  return (
    <Link
      href={href}
      style={{ textDecoration: "none", display: "block", height: "100%" }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,

          borderRadius: "20px",
          background: "#fff",
          //  เงาใหม่: ชิด + ไม่ล้น → ไม่โดนตัดใน slider
          boxShadow: `
        0 1px 2px rgba(0,0,0,0.02),
        0 4px 8px rgba(0,0,0,0.04)
        `,

          transition: "all .25s ease",

          "&:hover": {
            transform: "translateY(-3px)", //  ลดความแรง (จาก -6 → -4)

            //  hover เงา: เพิ่มนิดเดียว ไม่ฟุ้ง
            boxShadow: `
          0 3px 6px rgba(0,0,0,0.04),
          0 10px 16px rgba(0,0,0,0.06)
          `,
            "& img": {
              transition: "transform .4s ease",
            },
            "&:hover img": {
              transform: "scale(1.05)",
            },
          },
        }}
      >
        {/* IMAGE */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            pt: "56.25%",
            overflow: "hidden",
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
          }}
        >
          <Image
            src={imageSrc}
            alt={title || "news image"}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            style={{ objectFit: "cover" }}
          />

          {/*  OVERLAY ดำ */}
          <Box
            className="image-overlay"
            sx={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0)", // ปกติใส
              transition: "all .3s ease",
              zIndex: 1,
            }}
          />
        </Box>

        {/* CONTENT */}
        <Box
          sx={{
            p: 2,
            display: "flex",          //  เพิ่ม
            flexDirection: "column",  //  เพิ่ม
            flexGrow: 1,              //  เพิ่ม
          }}
        >        {/* TAG */}
          <Box
            sx={{
              display: "inline-flex",   //  เปลี่ยนตรงนี้
              alignItems: "center",
              width: "fit-content",     //  สำคัญ
              px: 2.5,                  // ลด padding ให้บาลานซ์
              py: "6px",
              borderRadius: "999px",
              background: "var(--color-info-bg)",
              color: "var(--color-info)",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {category}
          </Box>

          {/* TITLE */}
          <Typography
            sx={{
              mt: 1.5, mb: 1,
              fontWeight: 600,
              fontSize: 18,
              color: "var(--main-blue-700)",
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: "54px",
            }}
          >
            {title}
          </Typography>

          {/* FOOTER */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: "auto",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "6px", //  ระยะห่าง icon กับ text
              }}
            >
              {/* ICON */}
              <Box
                component="i"
                className="fi fi-sr-calendar"
                sx={{
                  fontSize: 14,
                  display: "flex",
                  alignItems: "center",
                  color: "var(--main-blue-700)",
                }}
              />

              {/* DATE */}
              <Typography
                sx={{
                  fontSize: 14,
                  color: "var(--main-blue-700)",
                }}
              >
                {formattedDate}
              </Typography>
            </Box>

            {/* READMORE */}
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 600,
                color: "var(--color-info)",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                textDecoration: "none",

                "&:hover": {
                  textDecoration: "none",
                  color: "var(--color-info-hover)",
                },
              }}
            >
              {messages.home.read_more}
              <IoIosArrowForward size={15} />
            </Typography>
          </Box>
        </Box>
      </Box>
    </Link>
  );
}