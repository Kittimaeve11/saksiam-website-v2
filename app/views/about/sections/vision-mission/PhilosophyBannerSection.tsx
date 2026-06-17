import { Box } from "@mui/material";

import AboutMenuBanner from "@/app/components/ui/Banner/AboutMenuBanner";

export default function PhilosophyBannerSection() {
  return (
    <Box
      component="section"
      sx={{
        width: "100vw",
        ml: "50%",
        transform: "translateX(-50%)",

        // ดึง Banner ขึ้นไปด้านหลังเนื้อหา
        mt: {
          xs: -20,
          sm: -28,
          md: -38,
        },

        position: "relative",

        // สำคัญ: ให้ Banner อยู่ Layer ล่าง
        zIndex: 1,

        overflow: "hidden",
        lineHeight: 0,
      }}
    >
      <AboutMenuBanner num={16} objectFit="cover" />
    </Box>
  );
}
