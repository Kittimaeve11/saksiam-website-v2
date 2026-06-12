import { Box } from "@mui/material";
import { getNewsPageData } from "../Utils/newsPage";
import NewsHeader from "../views/news/news-activities/NewsHeader";
import NewsSection from "../views/news/news-activities/NewsSection";

export default async function Page() {
  const { news, highlights, editorialTypes } = await getNewsPageData();
  const bannerNews = highlights.length ? highlights : news;
  const sections = editorialTypes.map((type) => ({
    type,
    data: news.filter((item) => item.typeID === type.id),
  }));

  return (
    <Box
      sx={{
        minHeight: "100vh",
        overflow: "hidden",
        backgroundImage: `
          linear-gradient(
            to bottom,
            rgba(255,255,255,0.98) 0%,
            rgba(255,255,255,0.9) 46%,
            rgba(244,248,252,0.86) 100%
          ),
          url('/background/bg-new.jpg')
        `,
        backgroundSize: "100% 100%, min(1400px, 120vw) auto",
        backgroundPosition: "top center, bottom center",
        backgroundRepeat: "no-repeat, no-repeat",
      }}
    >
      <NewsHeader data={bannerNews} />

      <Box
        component="main"
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
    </Box>
  );
}
