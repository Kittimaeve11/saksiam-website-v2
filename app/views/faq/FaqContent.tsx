"use client";

import { useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

import Breadcrumb from "@/app/components/ui/Breadcrumb/Breadcrumb";
import { useLocale } from "@/app/providers/LocaleContext";
import type { FaqItem, FaqTypeItem } from "@/app/Utils/type";
import {
  ALL_TAB_SLUG,
  getFaqTabPath,
  isSameTabSlug,
  normalizeTabSlug,
  toTabSlug,
} from "@/app/Utils/tabSlug";
import FaqList from "./FaqList";
import FaqTabs from "./FaqTabs";

type FaqContentData = {
  faq: FaqItem[];
  faqTypes: FaqTypeItem[];
};

type Props = {
  initialData: FaqContentData;
  initialTabParam?: string | null;
};

const getTypeLabel = (item: FaqTypeItem): string =>
  item.nameEN || item.nameTH || item.faqtypeID || item.id;

const normalizeFaqTab = (
  value: string | null,
  faqTypes: FaqTypeItem[]
): string => {
  if (!value || value.toLowerCase() === "all") return ALL_TAB_SLUG;

  const normalizedSlug = normalizeTabSlug(value);
  const selectedType = faqTypes.find(
    (item) =>
      item.faqtypeID === value ||
      item.id === value ||
      toTabSlug(getTypeLabel(item)).toLowerCase() === normalizedSlug.toLowerCase() ||
      isSameTabSlug(value, item.nameEN)
  );

  return selectedType ? toTabSlug(getTypeLabel(selectedType)) : normalizedSlug;
};

export default function FaqContent({
  initialData,
  initialTabParam = null,
}: Props) {
  const router = useRouter();
  const [tab, setTab] = useState(() =>
    normalizeFaqTab(initialTabParam, initialData.faqTypes)
  );
  const { messages, locale } = useLocale();
  const faq = initialData.faq;
  const faqTypes = initialData.faqTypes;

  const filtered = useMemo(() => {
    if (tab === ALL_TAB_SLUG) return faq;

    const selectedType = faqTypes.find(
      (item) => toTabSlug(getTypeLabel(item)).toLowerCase() === tab.toLowerCase()
    );

    return selectedType
      ? faq.filter((item) => item.faqtypeID === selectedType.faqtypeID)
      : [];
  }, [faq, faqTypes, tab]);

  const handleTabChange = (value: string) => {
    setTab(value);
    router.push(getFaqTabPath(value), { scroll: false });
  };

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
          mx: { xs: 0, md: 2 },
          mt: { xs: 0, md: 2 },
          mb: 0,
          pb: { xs: 5, md: 6 },
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

        <FaqTabs tab={tab} setTab={handleTabChange} faqTypes={faqTypes} />

        {!filtered.length ? (
          <Box className="fade-in" sx={{ textAlign: "center", py: 8 }}>
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
