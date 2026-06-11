import { Box } from "@mui/material";

import CorporateEthicsSection from "./vision-mission/CorporateEthicsSection";
import CorporatePhilosophySection from "./vision-mission/CorporatePhilosophySection";
import MissionSection from "./vision-mission/MissionSection";
import ObjectivesImageSection from "./vision-mission/ObjectivesImageSection";
import PhilosophyBannerSection from "./vision-mission/PhilosophyBannerSection";
import VisionImageSection from "./vision-mission/VisionImageSection";

export default function VisionMissionSection() {
  return (
    <Box
      component="section"
      sx={{
        width: "100%",
        maxWidth: "lg",
        mx: "auto",
      }}
    >
      <VisionImageSection />
      <MissionSection />
      <ObjectivesImageSection />
      <CorporateEthicsSection />
      <CorporatePhilosophySection />
      <PhilosophyBannerSection />
    </Box>
  );
}
