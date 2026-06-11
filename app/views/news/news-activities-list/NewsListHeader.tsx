"use client";

/* ======================================================
   IMPORT
====================================================== */
import { Container } from "@mui/material";
import { useLocale } from "@/app/providers/LocaleContext";
import Breadcrumb from "@/app/components/ui/Breadcrumb/Breadcrumb";

/* ======================================================
   COMPONENT
====================================================== */
export default function NewsListHeader() {
  const { messages } = useLocale();

  return (
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
  );
}
