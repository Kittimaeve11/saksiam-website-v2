"use client";

import { Box, Container, Typography } from "@mui/material";

import NewsCardSkeleton from "@/app/components/cards/NewsCard/NewsCardskeleton";
import EachBannerSkeleton from "@/app/components/ui/Banner/EachBannerskeleton";
import Breadcrumb from "@/app/components/ui/Breadcrumb/Breadcrumb";
import TabsSkeleton from "@/app/components/ui/Tabs/Tabsskeleton";
import { useLocale } from "@/app/providers/LocaleContext";

export default function Loading() {
  const { messages } = useLocale();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#FDFDFD" }}>
      <EachBannerSkeleton />

      <Container maxWidth="xl">
        <Breadcrumb
          items={[
            {
              label: messages.common.home || "หน้าหลัก",
              type: "link",
              href: "/",
            },
            {
              label: messages.common.back || "ย้อนกลับ",
              type: "back",
            },
            {
              label: messages.menu.news || "ข่าวและกิจกรรม",
              type: "current",
            },
          ]}
        />
      </Container>

      <Box sx={{ mx: "auto" }}>
        <Typography
          sx={{
            fontSize: { xs: "32px", md: "48px" },
            fontWeight: 800,
            color: "var(--main-blue-500)",
            textAlign: "center",
            mb: 4,
            px: 2,
          }}
        >
          {messages.home.follow_news_1}
          {messages.home.follow_news_2} {messages.home.follow_news_3}
        </Typography>
      </Box>

      <Box sx={{ maxWidth: "1200px", mx: "auto", mb: 6 }}>
        <TabsSkeleton count={3} />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 3,
            mt: 4,
            px: {
              xs: 2,
              sm: 3,
              md: 4,
              lg: 5,
            },
          }}
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <NewsCardSkeleton key={index} variant="list" />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
