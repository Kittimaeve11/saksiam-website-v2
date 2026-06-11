import { Box } from "@mui/material";
import { getHomeData } from "./Utils/homePageData";
import HomeBanner from "./views/home/HomeBanner/HomeBanner";
import HomeBrandStrip from "./views/home/HomeBrandStrip";
import HomeIntroSection from "./views/home/HomeIntroSection/HomeIntroSection";
import LoanInterestSection from "./views/home/LoanInterestSection/LoanInterestSection";
import NewsSection from "./views/home/News/NewsSection";
import ServiceClient from "./views/home/Service/ServiceClient";
import TestimonialSection from "./views/home/TestimonialSection/TestimonialSection";
import { getWebsiteMourningMode } from "./Utils/websiteTheme";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [homeData, isMourningMode] = await Promise.all([
    getHomeData(),
    getWebsiteMourningMode(),
  ]);
  const { banners, news, testimonials } = homeData;

  return (
    <Box className={isMourningMode ? "home-mourning-mode" : undefined}>
      <HomeBanner banners={banners} />

      <HomeBrandStrip />

      <Box sx={{ position: "relative" }}>
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: `
              linear-gradient(rgba(255,255,255,0.5), rgba(255,255,255,0.5)),
              linear-gradient(180deg, rgba(255,255,255,0) 59%, rgba(255,255,255,1) 85%),
              url('/Service/ServiceBackGrund.png')
            `,
            backgroundSize: "cover",
            zIndex: 0,
          }}
        />

        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            pt: { xs: 6, md: 8 },
            pb: { xs: 3, md: 4 },
          }}
        >
          <ServiceClient />
        </Box>
      </Box>

      <Box
        sx={{
          background: "rgba(255,255,255,1)",
          pt: { xs: 3, md: 4 },
          pb: { xs: 7, md: 9 },
        }}
      >
        <LoanInterestSection />
      </Box>

      <Box sx={{ backgroundColor: "#E9F0FB", pb: 5 }}>
        <NewsSection news={news} />
      </Box>
 
      <TestimonialSection testimonials={testimonials} />
      <HomeIntroSection />
    </Box>
  );
}
