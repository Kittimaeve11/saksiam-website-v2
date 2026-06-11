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
import NewsCardSkeleton from "@/app/components/cards/NewsCard/NewsCardskeleton";
import type {
  NewsListEditorialType,
  NewsListItem,
} from "@/app/Utils/newsActivitiesList";

type Props = {
  initialData?: NewsListItem[];
  initialEditorialTypes?: NewsListEditorialType[];
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

export default function NewsListPage({
  initialData = [],
  initialEditorialTypes = [],
}: Props) {
  const { messages, locale } = useLocale();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [data] = useState<NewsListItem[]>(initialData);
  const [editorialTypes] = useState<EditorialType[]>(initialEditorialTypes);
  const [loading] = useState(false);
  const [tab, setTab] = useState<TabType>(() =>
    normalizeTab(tabParam, initialEditorialTypes)
  );
  const [page, setPage] = useState(1);
  const [columns, setColumns] = useState(getColumns());

  useEffect(() => {
    const handleResize = () => {
      setColumns(getColumns());
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setTab(normalizeTab(tabParam, editorialTypes));
    setPage(1);
  }, [editorialTypes, tabParam]);

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

      if (tab === "news") return categoryEN === "news" || categoryTH === "ข่าวสาร";
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

        {loading && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                md: "repeat(3, minmax(0, 1fr))",
              },
              gap: { xs: 3, md: 4 },
              mt: { xs: 4, md: 5 },
              px: { xs: 2, sm: 3, md: 0 },
            }}
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <NewsCardSkeleton key={index} variant="list" />
            ))}
          </Box>
        )}

        {!loading && filtered.length === 0 && (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <Typography>
              {locale === "en" ? "No data found" : "ไม่พบข้อมูล"}
            </Typography>
          </Box>
        )}

        {!loading && filtered.length > 0 && (
          <Box className="fade-in">
            <NewsGrid data={paginated} />
          </Box>
        )}

        {!loading && totalPages > 1 && (
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
