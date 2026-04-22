"use client";

/* ====================================================== */
import { useEffect, useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";

/* ====================================================== */
import NewsGrid from "./NewsGrid";
import NewsTabs, { TabType } from "./NewsTabs";
import NewsPagination from "./NewsPagination";
import NewsListHeader from "./NewsListHeader";
import { useLocale } from "@/app/providers/LocaleContext";
import NewsABanner from "./NewsABanner";

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
export default function NewsListClient() {
  const { messages, locale } = useLocale();
  const searchParams = useSearchParams();

  /* ================= STATE ================= */
  const [data, setData] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  const [tab, setTab] = useState<TabType>("all");
  const [page, setPage] = useState(1);

  /* 🔥 FIX COLUMN แบบ responsive แต่ไม่ใช้ state */
  const getColumns = () => {
    if (typeof window === "undefined") return 4;
    const width = window.innerWidth;
    if (width >= 900) return 4;
    if (width >= 600) return 2;
    return 1;
  };

  const [columns, setColumns] = useState(getColumns());

  /* ====================================================== */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const tabParam = searchParams.get("tab") as TabType;
    if (tabParam && ["all", "news", "activity"].includes(tabParam)) {
      setTab(tabParam);
    }

    const handleResize = () => {
      setColumns(getColumns());
    };

    window.addEventListener("resize", handleResize);

    const fetchNews = async () => {
      try {
        const res = await fetch("/api/new");
        const json = await res.json();
        setData(json.news || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [searchParams]);

  /* ====================================================== */
  const filtered = useMemo(() => {
    if (tab === "all") return data;

    return data.filter((item) => {
      const category =
        locale === "en" ? item.categoryEN : item.categoryTH;

      if (tab === "news")
        return category === "News" || category === "ข่าวสาร";

      if (tab === "activity")
        return category === "Activities" || category === "กิจกรรม";

      return true;
    });
  }, [data, tab, locale]);

  /* ====================================================== */
  /* 🔥 핵: ล็อก 5 แถวจริง */
  const ROWS = 5;
  const perPage = columns * ROWS;

  const totalPages = Math.ceil(filtered.length / perPage);

  const paginated = useMemo(() => {
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page, perPage]);

  /* ====================================================== */
  const handleTabChange = (val: TabType) => {
    setTab(val);
    setPage(1);
  };

  const handlePageChange = (val: number) => {
    setPage(val);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ====================================================== */
  if (loading) {
    return (
      <Box sx={{ textAlign: "center", py: 10 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  /* ====================================================== */
  return (
    <>
      {/* ================= HEADER ================= */}
      <Box>
        <NewsABanner />
        <NewsListHeader />

        <Box sx={{ mx: "auto" }}>
          <Typography
            sx={{
              fontSize: { xs: "32px", md: "48px" },
              fontWeight: 800,
              color: "var(--main-blue-500)",
              textAlign: "center",
              mb: 4,
            }}
          >
            {messages.home.follow_news_1}
            {messages.home.follow_news_2}{" "}
            {messages.home.follow_news_3}
          </Typography>
        </Box>
      </Box>

      {/* ================= CONTENT ================= */}
      <Box sx={{ maxWidth: "1200px", mx: "auto", mb: 6 }}>
        <NewsTabs tab={tab} setTab={handleTabChange} />

        {/* EMPTY */}
        {filtered.length === 0 && (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <Typography>
              {locale === "en" ? "No data found" : "ไม่พบข้อมูล"}
            </Typography>
          </Box>
        )}

        {/* GRID */}
        {filtered.length > 0 && <NewsGrid data={paginated} />}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <Box sx={{ mt: 6, display: "flex", justifyContent: "center" }}>
            <NewsPagination
              page={page}
              totalPages={totalPages}
              setPage={handlePageChange}
            />
          </Box>
        )}
      </Box>
    </>
  );
}