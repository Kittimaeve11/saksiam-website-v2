"use client";

/* ======================================================
   IMPORT
====================================================== */
import { Container } from "@mui/material";
import Breadcrumb from "@/app/components/ui/Breadcrumb/Breadcrumb";
import { useLocale } from "@/app/providers/LocaleContext";

/* ======================================================
   TYPE
====================================================== */
type News = {
    id: string | number;
    titleTH: string;
    titleEN: string;
};

type Props = {
    data: News;
};

/* ======================================================
   COMPONENT
====================================================== */
export default function NewsDetailHeader({ data }: Props) {
  const { messages, locale } = useLocale();

    return (
        <Container maxWidth="xl">
           <Breadcrumb
  items={[
    {
      label: messages.common.home,
      type: "link",
      href: "/",
    },
    {
      label: messages.common.back,
      type: "back",
    },
    {
      label:
        locale === "en"
          ? data.titleEN
          : data.titleTH,
      type: "current",
    },
  ]}
/>
        </Container>
    );
}
