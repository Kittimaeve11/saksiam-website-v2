"use client";

import { Box, Container } from "@mui/material";
import { useLocale } from "@/app/providers/LocaleContext";

import Breadcrumb from "@/app/components/ui/Breadcrumb/Breadcrumb";
import NewsBanner from "./NewsBanner";

type News = {
  id: string | number;
  categoryTH: string;
  categoryEN: string;
  titleTH: string;
  titleEN: string;
  detailTH: string;
  detailEN: string;
  createdAt: string;
  images: string[];
};

type Props = {
  data: News[];
};

export default function NewsHeader({ data }: Props) {
  const { messages } = useLocale();

  return (
    <Box sx={{ position: "relative" }}>
      <Box className="fade-in">
        <NewsBanner data={data} />
      </Box>

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
    </Box>
  );
}
