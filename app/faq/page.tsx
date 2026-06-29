import { Box, Container } from "@mui/material";

import EachBanner from "@/app/components/ui/Banner/EachBanner";
import { getFaqData } from "@/app/Utils/faqData";
import FaqContent from "@/app/views/faq/FaqContent";

export const dynamic = "force-dynamic";

type FaqPageProps = {
  searchParams?: Promise<{
    tab?: string;
    tabSlug?: string;
  }>;
};

export default async function Page({ searchParams }: FaqPageProps) {
  const emptySearchParams: Awaited<NonNullable<FaqPageProps["searchParams"]>> = {};
  const [faqData, params] = await Promise.all([
    getFaqData(),
    searchParams || Promise.resolve(emptySearchParams),
  ]);
  const tabParam = params.tabSlug || params.tab || null;

  return (
    <Box
      sx={{
        backgroundColor: "white",
        minHeight: "100vh",
      }}
    >
      <EachBanner num={4} />

      <Container
        maxWidth={false}
        sx={{
          position: "relative",
          overflow: "hidden",
          px: 0,
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            zIndex: 0,
            backgroundImage:
              'url("/background/23655cd5-6444-4153-bd07-b3f71a81e34c.png")',
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center bottom",
            backgroundSize: "100% auto",
            pointerEvents: "none",
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            maxWidth: "lg",
            mx: "auto",
            px: { xs: 2, md: 3 },
          }}
        >
          <FaqContent initialData={faqData} initialTabParam={tabParam} />
        </Box>
      </Container>
    </Box>
  );
}
