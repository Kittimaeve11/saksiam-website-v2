"use client";

/* ====================================================== */
import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useLocale } from "@/app/providers/LocaleContext";

/* ====================================================== */
import NewsDetailHeader from "./NewsDetailHeader";
import NewsGallery from "./NewsGallery";
import NewsMainImage from "./NewsMainImage";
import NewsDetailMeta from "./NewsDetailMeta";
import RelatedNewsSection from "./RelatedNewsSection";

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

type Contact = {
  social: {
    facebook?: string;
    line?: string;
    instagram?: string;
  };
};

/* ====================================================== */
export default function NewsDetailClient({ id }: { id: string }) {
  const { locale } = useLocale();

  const [data, setData] = useState<News | null>(null);
  const [allNews, setAllNews] = useState<News[]>([]);
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);

  /* ================= EFFECT ================= */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        window.scrollTo(0, 0);

        const [newsRes, contactRes] = await Promise.all([
          fetch("/api/new"),
          fetch("/api/contact"),
        ]);

        const newsJson = await newsRes.json();
        const contactJson = await contactRes.json();

        const newsList = newsJson.news || [];

        setAllNews(newsList);

        const found = newsList.find(
          (item: News) => String(item.id) === String(id)
        );

        setData(found || null);
        setContact(contactJson || null);
      } catch (err) {
        console.error("❌ fetch error:", err);
        setData(null);
        setContact(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <Box sx={{ textAlign: "center", py: 10 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  /* ================= NOT FOUND ================= */
  if (!data) {
    return (
      <Box sx={{ textAlign: "center", py: 10 }}>
        <Typography>ไม่พบข้อมูล</Typography>
      </Box>
    );
  }

  /* ====================================================== */
  return (
    <Box>
      {/* ================= HEADER ================= */}
      <NewsDetailHeader data={data} />

      {/* ================= CONTENT ================= */}
      <Box
        sx={{
          maxWidth: "lg",
          mx: "auto",
          mt: { xs: 2, md: 2 },
          px: 2,
          pb: 8,
        }}
      >
        {/* MAIN IMAGE */}
        <NewsMainImage
          src={data.images?.[0]}
          title={locale === "en" ? data.titleEN : data.titleTH}
        />

        {/*  META + TITLE + SOCIAL */}
        <NewsDetailMeta
          createdAt={data.createdAt}
          titleTH={data.titleTH}
          titleEN={data.titleEN}
          social={contact?.social}
        />

        {/*  DETAIL */}
        <Typography
          sx={{
            mb: 5,
            color: "var(--gray-500)",
            lineHeight: 1.8,
            fontSize: { xs: "16px", md: "18px" },
          }}
        >
          {locale === "en" ? data.detailEN : data.detailTH}
        </Typography>

        {/*  GALLERY */}
        <NewsGallery images={data.images} />

        {/*  RELATED */}
        <RelatedNewsSection
          data={allNews} //  แก้ตรงนี้
          currentId={data.id}
          currentCategory={
            locale === "en" ? data.categoryEN : data.categoryTH
          } //  รองรับ 2 ภาษา
        />
      </Box>
    </Box>
  );
}