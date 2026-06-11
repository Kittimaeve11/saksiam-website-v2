"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";

import Breadcrumb from "@/app/components/ui/Breadcrumb/Breadcrumb";
import { useLocale } from "@/app/providers/LocaleContext";
import type { FaqItem, FaqTypeItem } from "@/app/Utils/type";
import { getFaqData } from "@/app/Utils/faqData";
import FaqCardSkeleton from "./FaqCardskeleton";
import FaqList from "./FaqList";
import FaqTabs from "./FaqTabs";

export default function FaqContent() {
  const [tab, setTab] = useState("all");
  const [faq, setFaq] = useState<FaqItem[]>([]);
  const [faqTypes, setFaqTypes] = useState<FaqTypeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { messages, locale } = useLocale();

  useEffect(() => {
    let active = true;

    const fetchFaq = async () => {
      try {
        setLoading(true);

        const data = await getFaqData();

        if (!active) return;

        setFaq(data.faq);
        setFaqTypes(data.faqTypes);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchFaq();

    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    return tab === "all" ? faq : faq.filter((item) => item.category === tab);
  }, [faq, tab]);

  return (
    <>
      <Breadcrumb
        items={[
          { label: messages.menu.home, type: "link", href: "/" },
          { label: messages.menu.back, type: "back" },
          { label: messages.menu.faq, type: "current" },
        ]}
      />

      <Box
        sx={{
          m: { xs: 0, md: 2 },
          mb: { xs: 5, md: 6 },
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "30px", md: "48px" },
            fontWeight: 800,
            color: "var(--main-blue-500)",
            textAlign: "center",
            mt: { xs: 2, md: 3 },
            mb: { xs: 3, md: 4 },
          }}
        >
          {messages?.faq?.title || "FAQ"}
        </Typography>

        <FaqTabs tab={tab} setTab={setTab} faqTypes={faqTypes} loading={loading} />

        {loading ? (
          <Box sx={{ mt: { xs: 3, md: 4 } }}>
            {[0, 1, 2, 3, 4, 5].map((item, index) => (
              <FaqCardSkeleton key={item} isLast={index === 5} />
            ))}
          </Box>
        ) : !filtered.length ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography sx={{ color: "var(--gray-500)", fontWeight: 600 }}>
              {locale === "en" ? "No data found" : "ไม่พบข้อมูล"}
            </Typography>
          </Box>
        ) : (
          <Box className="fade-in">
            <FaqList data={filtered} />
          </Box>
        )}
      </Box>
    </>
  );
}
