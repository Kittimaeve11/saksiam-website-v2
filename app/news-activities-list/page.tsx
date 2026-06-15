"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";

import NewsGrid from "@/app/views/news/news-activities-list/NewsGrid";
import NewsTabs, {
  EditorialType,
  TabType,
  getEditorialTabValue,
} from "@/app/views/news/news-activities-list/NewsTabs";
import NewsPagination from "@/app/views/news/news-activities-list/NewsPagination";
import NewsListHeader from "@/app/views/news/news-activities-list/NewsListHeader";
import { useLocale } from "@/app/providers/LocaleContext";
import EachBanner from "@/app/components/ui/Banner/EachBanner";
import type {
  NewsListEditorialType,
  NewsListItem,
} from "@/app/Utils/newsActivitiesList";
import Loading from "./loading";

type NewsListApiResponse = {
  editorials?: NewsListItem[];
  editorialTypes?: NewsListEditorialType[];
};

const getColumns = () => {
  if (typeof window === "undefined") return 4;

  const width = window.innerWidth;
  if (width >= 900) return 4;
  if (width >= 600) return 2;

  return 1;
};

const normalizeTab = (
  value: string | null,
  editorialTypes: EditorialType[]
): TabType => {
  if (!value || value === "all") return "all";

  const selectedType = editorialTypes.find(
    (item) => item.id === value || getEditorialTabValue(item) === value
  );

  return selectedType ? getEditorialTabValue(selectedType) : value;
};

export default function Page() {
  const { messages, locale } = useLocale();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [data, setData] = useState<NewsListItem[]>([]);
  const [editorialTypes, setEditorialTypes] = useState<EditorialType[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabType>("all");
  const [page, setPage] = useState(1);
  const [columns, setColumns] = useState(getColumns());

  useEffect(() => {
    let active = true;

    const handleResize = () => {
      setColumns(getColumns());
    };

    const fetchNews = async () => {
      try {
        setLoading(true);

        const response = await fetch("/api/editoriaapi", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`News list API error: ${response.status}`);
        }

        const result = (await response.json()) as NewsListApiResponse;
        const nextEditorialTypes = result.editorialTypes || [];
        const nextNews = (result.editorials || []).filter(
          (item) => item.images.length
        );

        if (!active) return;

        setEditorialTypes(nextEditorialTypes);
        setData(nextNews);
        setTab(normalizeTab(tabParam, nextEditorialTypes));
        setPage(1);
      } catch (error) {
        console.error("Fetch news activities list error:", error);

        if (active) {
          setEditorialTypes([]);
          setData([]);
          setTab("all");
          setPage(1);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchNews();
    window.addEventListener("resize", handleResize);

    return () => {
      active = false;
      window.removeEventListener("resize", handleResize);
    };
  }, [tabParam]);

  const filtered = useMemo(() => {
    if (tab === "all") return data;

    const selectedType = editorialTypes.find(
      (item) => getEditorialTabValue(item) === tab || item.id === tab
    );

    if (selectedType) {
      return data.filter((item) => item.typeID === selectedType.id);
    }

    return data.filter((item) => {
      const categoryEN = item.categoryEN.toLowerCase();
      const categoryTH = item.categoryTH;

      if (tab === "news") {
        return categoryEN === "news" || categoryTH === "ข่าวสาร";
      }

      if (tab === "activity") {
        return (
          categoryEN === "activity" ||
          categoryEN === "activities" ||
          categoryTH === "กิจกรรม"
        );
      }

      return true;
    });
  }, [data, editorialTypes, tab]);

  const rows = 5;
  const perPage = columns * rows;
  const totalPages = Math.ceil(filtered.length / perPage);

  const paginated = useMemo(() => {
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page, perPage]);

  const handleTabChange = (val: TabType) => {
    setTab(val);
    setPage(1);
  };

  const handlePageChange = (val: number) => {
    setPage(val);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Box>
        <EachBanner num={13} />
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
            {messages.home.follow_news_2} {messages.home.follow_news_3}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ maxWidth: "1200px", mx: "auto", mb: 6 }}>
        <Box sx={{ px: { xs: 2, sm: 3, md: 0 } }}>
          <NewsTabs
            tab={tab}
            setTab={handleTabChange}
            editorialTypes={editorialTypes}
            loading={loading}
          />
        </Box>

        {filtered.length === 0 && (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <Typography>
              {locale === "en" ? "No data found" : "ไม่พบข้อมูล"}
            </Typography>
          </Box>
        )}

        {filtered.length > 0 && (
          <Box>
            <NewsGrid data={paginated} />
          </Box>
        )}

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
