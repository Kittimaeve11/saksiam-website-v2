"use client";

/* ======================================================
   IMPORT
====================================================== */
import { Box } from "@mui/material";
import Breadcrumb from "@/app/components/ui/Breadcrumb/Breadcrumb";
import { useLocale } from "@/app/providers/LocaleContext";

/* ======================================================
   TYPE
====================================================== */
type News = {
    id: number;
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
    const { locale } = useLocale();

    return (
        <Box sx={{ mx: "auto" }}>
            <Box sx={{ mx: "auto" }}>
                <Breadcrumb
                    items={[
                        {
                            label: locale === "en" ? "Home" : "หน้าหลัก",
                            type: "link",
                            href: "/",
                        },
                        {
                            label: locale === "en" ? "Back" : "ย้อนกลับ",
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
            </Box>
        </Box>
    );
}