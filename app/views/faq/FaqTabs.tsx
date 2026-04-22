"use client";

/* ====================================================== */
import Tabs, { TabItem } from "@/app/components/ui/Tabs/Tabs";

/* 🔥 i18n */
import { useLocale } from "@/app/providers/LocaleContext";

/* ====================================================== */
type TabType = "all" | "loan" | "contact";

type Props = {
  tab: TabType;
  setTab: (val: TabType) => void;
};

/* ====================================================== */
export default function FaqTabs({ tab, setTab }: Props) {
  const { messages } = useLocale();

  const tabs: TabItem<TabType>[] = [
    { label: messages?.faq?.all || "ทั้งหมด", value: "all" },
    { label: messages?.faq?.loan || "สินเชื่อ", value: "loan" },
    { label: messages?.faq?.contact || "การติดต่อ", value: "contact" },
  ];

  return (
    <Tabs
      tabs={tabs}
      value={tab}
      onChange={setTab}
    />
  );
}