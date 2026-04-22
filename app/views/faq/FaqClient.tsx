"use client";

/* ====================================================== */
import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

/* ====================================================== */
import { useLocale } from "@/app/providers/LocaleContext";

/* ====================================================== */
import EachBanner from "@/app/components/ui/Banner/EachBanner";
import FaqTabs from "./FaqTabs";
import FaqList from "./FaqList";

/* ====================================================== */
const BASE_URL = process.env.NEXT_PUBLIC_API_PHOTO!;

/* ====================================================== */
type FAQ = {
  id: number;
  category: "loan" | "contact";
  questionTH: string;
  questionEN: string;
  answerTH: string;
  answerEN: string;
};

/* ====================================================== */
export default function FaqClient() {
  const [faq, setFaq] = useState<FAQ[]>([]);
  const [tab, setTab] = useState<"all" | "loan" | "contact">("all");

  const { messages } = useLocale();

  /* ====================================================== */
  useEffect(() => {
    const fetchFAQ = async () => {
      try {
        const res = await fetch(`${BASE_URL}/apici4/api/FQAapi`);
        const data = await res.json();
        setFaq(data?.data || []);
      } catch (err) {
        console.error("FAQ error:", err);
      }
    };

    fetchFAQ();
  }, []);

  const filtered =
    tab === "all" ? faq : faq.filter((f) => f.category === tab);

  /* ====================================================== */
  return (
    <>
      {/* 🔥 BANNER (อยู่นอก Box ตามที่มึงต้องการ) */}
      <EachBanner num={4} />

      {/* 🔥 CONTENT */}
      <Box
        sx={{
          minHeight: "100vh",
          backgroundImage:
            "url('/background/23655cd5-6444-4153-bd07-b3f71a81e34c.png')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "bottom center",
          backgroundSize: "100% auto",
        }}
      >
        <Box sx={{ maxWidth: "lg", mx: "auto", pb: 6 }}>
          
          {/* TITLE */}
          <Typography
            sx={{
              fontSize: { xs: "32px", md: "48px" },
              fontWeight: 800,
              color: "var(--main-blue-500)",
              textAlign: "center",
              mt: 4,
              mb: 4,
            }}
          >
            {messages?.faq?.title || "FAQ"}
          </Typography>

          {/* TABS */}
          <FaqTabs tab={tab} setTab={setTab} />

          {/* LIST */}
          <FaqList data={filtered} />
        </Box>
      </Box>
    </>
  );
}