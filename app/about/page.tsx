"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Box } from "@mui/material";

import AboutHeader from "@/app/views/about/AboutHeader";
import AboutSidebar, { AboutTabId } from "@/app/views/about/AboutSidebar";
import HistorySection from "@/app/views/about/sections/HistorySection";
import VisionMissionSection from "@/app/views/about/sections/VisionMissionSection";
import OrgStructureSection from "@/app/views/about/sections/OrgStructureSection";
import BoardSection from "@/app/views/about/sections/BoardSection";
import BoardSubCommittee from "@/app/views/about/sections/BoardSubCommittee";
import BoardSkillsMatrix from "@/app/views/about/sections/BoardSkillsMatrix";
import { useLocale } from "@/app/providers/LocaleContext";

const aboutTabSlugById: Record<AboutTabId, string> = {
  history: "company-history",
  vision: "vision-mission",
  org: "organization-structure",
  board: "board-of-directors",
  subcommittee: "sub-committee",
  skills: "board-skills-matrix",
};

const aboutTabIdBySlug: Record<string, AboutTabId> = {
  history: "history",
  "company-history": "history",
  vision: "vision",
  "vision-mission": "vision",
  org: "org",
  organization: "org",
  "organization-structure": "org",
  board: "board",
  "board-of-directors": "board",
  subcommittee: "subcommittee",
  "sub-committee": "subcommittee",
  skills: "skills",
  "board-skills": "skills",
  "board-skills-matrix": "skills",
};

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { messages } = useLocale();
  const activeTab = aboutTabIdBySlug[searchParams.get("tab") || ""] || "history";
  const aboutHeaderByTab: Record<
    AboutTabId,
    {
      title: string;
      bannerNum: number;
      hideTitle?: boolean;
    }
  > = {
    history: {
      title: messages.about.history,
      bannerNum: 10,
      hideTitle: true,
    },
    vision: {
      title: messages.about.vision_mission,
      bannerNum: 6,
    },
    org: {
      title: messages.about.organization_structure,
      bannerNum: 6,
    },
    board: {
      title: messages.about.board_of_directors,
      bannerNum: 6,
    },
    subcommittee: {
      title: messages.about.board_committees,
      bannerNum: 6,
    },
    skills: {
      title: messages.about.board_skills_matrix,
      bannerNum: 6,
    },
  };
  const header = aboutHeaderByTab[activeTab];

  const handleTabChange = (tab: AboutTabId) => {
    router.push(`/about?tab=${aboutTabSlugById[tab]}`, { scroll: false });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "vision":
        return <VisionMissionSection />;
      case "org":
        return <OrgStructureSection />;
      case "board":
        return <BoardSection />;
      case "subcommittee":
        return <BoardSubCommittee />;
      case "skills":
        return <BoardSkillsMatrix />;
      case "history":
      default:
        return <HistorySection />;
    }
  };

  return (
    <>
      <AboutHeader
        title={header.title}
        bannerNum={header.bannerNum}
        hideTitle={header.hideTitle}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          maxWidth: "lg",
          mx: "auto",
          px: 2,
          pt: 6,
          pb: activeTab === "vision" ? 0 : 6,
        }}
      >
        <AboutSidebar active={activeTab} onChange={handleTabChange} />

        <Box key={activeTab} className="fade-in" sx={{ flex: 1 }}>
          {renderContent()}
        </Box>
      </Box>
    </>
  );
}
