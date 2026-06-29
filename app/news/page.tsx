import { Box } from "@mui/material";
import { cache, Suspense } from "react";
import { getNewsPageData } from "../Utils/newsPage";
import NewsHeader from "../views/news/news-activities/NewsHeader";
import NewsContentSkeleton from "../views/news/news-activities/NewsContentSkeleton";
import { NewsContentScrollRestorer } from "../views/news/news-activities/NewsContentScrollKeeper";
import NewsSection from "../views/news/news-activities/NewsSection";

const getCachedNewsPageData = cache(getNewsPageData);

export const dynamic = "force-dynamic";

async function NewsHeaderBlock() {
  const { news, highlights } = await getCachedNewsPageData();
  const bannerNews = highlights.length ? highlights : news;

  return <NewsHeader data={bannerNews} />;
}

async function NewsContentBlock() {
  const { news, editorialTypes } = await getCachedNewsPageData();
  const sections = editorialTypes.map((type) => ({
    type,
    data: news.filter((item) => item.typeID === type.id),
  }));

  return (
    <NewsContentScrollRestorer>
      <Box
        component="main"
        className="api-content-fade-in"
        sx={{
          width: "100%",
          maxWidth: "lg",
          mx: "auto",
          px: { xs: 2, sm: 3, md: 4 },
          pt: { xs: 5, md: 4 },
          pb: { xs: 2, md: 5 },
        }}
      >
        {sections.map((section, index) => (
          <NewsSection
            key={section.type.id}
            data={section.data}
            editorialType={section.type}
            layoutIndex={index}
          />
        ))}
      </Box>
    </NewsContentScrollRestorer>
  );
}

export default function Page() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        overflow: "hidden",
        backgroundColor: "#fff",
        backgroundImage:
          'url("/background/90f4e363-6472-4324-8eb1-2b84c1eabd1c 1.png")',
        backgroundSize: "auto clamp(420px, 55vw, 760px)",
        backgroundPosition: "left bottom",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Suspense fallback={<NewsHeader data={[]} />}>
        <NewsHeaderBlock />
      </Suspense>

      <Suspense fallback={<NewsContentSkeleton />}>
        <NewsContentBlock />
      </Suspense>
    </Box>
  );
}
