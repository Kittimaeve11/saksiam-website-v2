"use client";

/* ====================================================== */
import { Box } from "@mui/material";

/* ====================================================== */
import AboutHeader from "./AboutHeader";
import AboutSidebar from "./AboutSidebar";

/* 🔥 IMPORT SECTIONS */
import HistorySection from "./sections/HistorySection";
import VisionMissionSection from "./sections/VisionMissionSection";
import OrgStructureSection from "./sections/OrgStructureSection";
import BoardSection from "./sections/BoardSection";
import BoardSkillsMatrix from "./sections/BoardSkillsMatrix";
import TeamsSection from "./sections/TeamsSection";

/* ====================================================== */
export default function AboutPageClient() {
  return (
    <>
      <AboutHeader />

      {/* ================= CONTENT ================= */}
      <Box
        sx={{
          display: "flex",
          maxWidth: "lg",
          mx: "auto",
          px: 2,
          py: 6,
        }}
      >
        {/* SIDEBAR */}
        <AboutSidebar />

        {/* MAIN CONTENT */}
        <Box sx={{ flex: 1 }}>
          <HistorySection />
          <VisionMissionSection />
          <OrgStructureSection />
          <BoardSection />
          <BoardSkillsMatrix />
          <TeamsSection />
        </Box>
      </Box>
    </>
  );
}