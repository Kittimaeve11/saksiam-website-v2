"use client";

import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useLocale } from "@/app/providers/LocaleContext";
import NewsDetailHeader from "@/app/views/news/news-detail/NewsDetailHeader";
import NewsGallery from "@/app/views/news/news-detail/NewsGallery";
import NewsMainImage from "@/app/views/news/news-detail/NewsMainImage";
import NewsDetailMeta from "@/app/views/news/news-detail/NewsDetailMeta";
import RelatedNewsSection from "@/app/views/news/news-detail/RelatedNewsSection";
import NewsDetailLoading from "@/app/views/news/news-detail/NewsDetailLoading";
import type { News } from "@/app/Utils/type";

type Contact = {
  social: {
    facebook?: string;
    line?: string;
    instagram?: string;
  };
};

declare global {
  interface Window {
    __editorialViewGuard?: Record<
      string,
      {
        loggedAt: number;
        promise: Promise<number>;
      }
    >;
  }
}

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const hasHtmlTag = (value: string): boolean => /<\/?[a-z][\s\S]*>/i.test(value);

const toEditorHtml = (value: string): string => {
  if (hasHtmlTag(value)) return value;

  return escapeHtml(value);
};

type NewsDetailClientProps = {
  id: string;
};

export default function NewsDetailClient({ id }: NewsDetailClientProps) {
  const { locale } = useLocale();

  const [data, setData] = useState<News | null>(null);
  const [allNews, setAllNews] = useState<News[]>([]);
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        window.scrollTo(0, 0);
        setLoading(true);

        const [detailRes, newsRes, contactRes] = await Promise.all([
          fetch(`/api/editoriaapi/${id}`),
          fetch("/api/editoriaapi"),
          fetch("/api/contact"),
        ]);

        const detailJson = await detailRes.json();
        const newsJson = await newsRes.json();
        const contactJson = await contactRes.json();

        const editorial = detailJson.editorial || null;

        if (editorial?.id) {
          const viewKey = String(editorial.id);
          const now = Date.now();
          const guard = window.__editorialViewGuard || {};
          const activeGuard = guard[viewKey];
          const shouldCountView = !activeGuard || now - activeGuard.loggedAt > 1500;

          if (shouldCountView) {
            const viewPromise = fetch("/api/editoria-views", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: editorial.id,
                num: editorial.num,
                title: editorial.titleTH || editorial.titleEN,
                titleTH: editorial.titleTH,
                titleEN: editorial.titleEN,
                typeID: editorial.typeID,
                category: editorial.categoryTH || editorial.categoryEN,
                categoryTH: editorial.categoryTH,
                categoryEN: editorial.categoryEN,
              }),
            })
              .then((viewRes) => viewRes.json())
              .then((viewJson) => Number(viewJson.views ?? editorial.views ?? 0));

            window.__editorialViewGuard = {
              ...guard,
              [viewKey]: {
                loggedAt: now,
                promise: viewPromise,
              },
            };

            editorial.views = await viewPromise;
          } else {
            editorial.views = await activeGuard.promise;
          }
        }

        setData(editorial);
        setAllNews(
          (newsJson.editorials || []).map((item: News) =>
            String(item.id) === String(editorial?.id)
              ? { ...item, views: editorial?.views || item.views || 0 }
              : item
          )
        );
        setContact(contactJson || null);
      } catch (err) {
        console.error("fetch editorial detail error:", err);
        setData(null);
        setContact(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAll();
    }
  }, [id]);
if (loading) {
    return <NewsDetailLoading />;
}
  if (!data) {
    return (
      <Box sx={{ textAlign: "center", py: 10 }}>
        <Typography>ไม่พบข้อมูล</Typography>
      </Box>
    );
  }

  const detailHtml = locale === "en" ? data.detailEN : data.detailTH;

  return (
    <Box>
      <NewsDetailHeader data={data} />

      <Box
        sx={{
          maxWidth: "lg",
          mx: "auto",
          mt: { xs: 2, md: 2 },
          px: 2,
          pb: 8,
        }}
      >
        <NewsMainImage
          src={data.images?.[0]}
          title={locale === "en" ? data.titleEN : data.titleTH}
        />

        <NewsDetailMeta
          createdAt={data.createdAt}
          titleTH={data.titleTH}
          titleEN={data.titleEN}
          views={data.views || 0}
          social={contact?.social}
        />

        <Box
          className="editorial-rich-text"
          dangerouslySetInnerHTML={{ __html: toEditorHtml(detailHtml) }}
          sx={{
            mb: 5,
            color: "var(--gray-500)",
            lineHeight: 1.8,
            fontSize: { xs: "16px", md: "18px" },
            textAlign: "justify",
            textAlignLast: "left",
            textJustify: "inter-character",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            "&, & p, & div, & span, & li": {
              fontFamily: "inherit",
            },
            "& p": {
              mt: 0,
              mb: 2,
              lineHeight: 1.8,
              textAlign: "justify",
              textAlignLast: "left",
              textJustify: "inter-character",
            },
            "& p:empty": {
              minHeight: "1.75em",
              mb: 0,
            },
            "& ul, & ol": {
              mt: 1,
              mb: 2,
              pl: { xs: 3.5, md: 5 },
            },
            "& li": {
              mb: 0.75,
              lineHeight: 1.8,
              textAlign: "justify",
              textAlignLast: "left",
              textJustify: "inter-character",
            },
            "& strong, & b": {
              fontWeight: 700,
              color: "var(--color-primary)",
            },
            "& a": {
              color: "var(--color-primary)",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
            },
            "& img": {
              maxWidth: "100%",
              height: "auto",
              borderRadius: "16px",
            },
            "& .ql-align-center": {
              textAlign: "center",
            },
            "& .ql-align-right": {
              textAlign: "right",
            },
            "& .ql-align-justify": {
              textAlign: "justify",
            },
            "& .ql-indent-1": {
              pl: "3em",
            },
            "& .ql-indent-2": {
              pl: "6em",
            },
            "& .ql-indent-3": {
              pl: "9em",
            },
          }}
        />

        <NewsGallery images={data.images} />

        <RelatedNewsSection
          data={allNews}
          currentId={data.id}
          currentCategory={locale === "en" ? data.categoryEN : data.categoryTH}
        />
      </Box>
    </Box>
  );
}
