"use client";

/* ====================================================== */
import { useEffect, useState } from "react";
import { Box } from "@mui/material";

/* ====================================================== */
import { useLocale } from "@/app/providers/LocaleContext";

/* ====================================================== */
import NewsHeader from "./NewsHeader"; // 🔥 ใช้ตัวใหม่
import NewsSection from "./NewsSection";
import ActivitySection from "./ActivitySection";

/* ====================================================== */
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

/* ====================================================== */
export default function NewsClient() {
  const [news, setNews] = useState<News[]>([]);
  const { messages } = useLocale(); // (ยังใช้ได้เผื่ออนาคต)

  /* ======================================================
     FETCH
  ====================================================== */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/new");
        const data = await res.json();
        setNews(data.news || []);
      } catch (err) {
        console.error("Fetch news error:", err);
      }
    };

    fetchData();
  }, []);

  /* ====================================================== */
  return (
    <Box
      sx={{
        minHeight: "100vh",

        backgroundImage: `
          linear-gradient(
            to bottom,
            rgb(253, 253, 253) 0%,
            rgba(253,253,253,0) 100%
          ),
          url('/background/bg-new.jpg')
        `,
        backgroundSize: "100% 100%, 100% auto",
        backgroundPosition: "top center, bottom center",
        backgroundRepeat: "no-repeat, no-repeat",
      }}
    >
      {/* 🔥 HEADER */}
      <NewsHeader data={news} />

      {/* CONTENT */}
      <Box sx={{ maxWidth: "lg", mx: "auto", pb: 15 }}>
        <NewsSection data={news} />
        <ActivitySection data={news} />
      </Box>
    </Box>
  );
}