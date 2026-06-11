"use client";

import { Box, Container, Skeleton } from "@mui/material";

import NewsCardSkeleton from "@/app/components/cards/NewsCard/NewsCardskeleton";
import EachBannerSkeleton from "@/app/components/ui/Banner/EachBannerskeleton";
import Breadcrumb from "@/app/components/ui/Breadcrumb/Breadcrumb";
import { useLocale } from "@/app/providers/LocaleContext";

export default function Loading() {
  const { messages } = useLocale();

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
        <NewsSectionSkeleton />
        <NewsSectionSkeleton flipped />
      </Box>
    </Box>
  );
}

function NewsSectionSkeleton({ flipped = false }: { flipped?: boolean }) {
  return (
    <Box sx={{ mb: 7 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          gap: 2,
        }}
      >
        <Skeleton
          variant="rounded"
          animation="wave"
          width={160}
          height={44}
          sx={{ borderRadius: "12px" }}
        />
        <Skeleton
          variant="rounded"
          animation="wave"
          width={92}
          height={20}
          sx={{ borderRadius: "999px" }}
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: flipped ? "1fr 1.15fr" : "1.15fr 1fr",
            lg: flipped ? "1fr 1fr 2fr" : "2fr 1fr 1fr",
          },
          gap: 3,
          alignItems: "stretch",
        }}
      >
        {flipped ? (
          <>
            <NewsCardSkeleton variant="simple" />
            <NewsCardSkeleton variant="simple" />
            <NewsCardSkeleton variant="overlay" />
          </>
        ) : (
          <>
            <NewsCardSkeleton variant="overlay" />
            <NewsCardSkeleton variant="simple" />
            <NewsCardSkeleton variant="simple" />
          </>
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
          mt: 3,
        }}
      >
        <Skeleton
          variant="rounded"
          width={50}
          height={10}
          sx={{ borderRadius: "999px", bgcolor: "var(--yellow-500)" }}
        />
        {[0, 1].map((item) => (
          <Skeleton key={item} variant="circular" width={10} height={10} />
        ))}
      </Box>
    </Box>
  );
}
