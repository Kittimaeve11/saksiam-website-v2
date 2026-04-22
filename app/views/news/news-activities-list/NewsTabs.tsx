"use client";

/* ====================================================== */
import Tabs, { TabItem } from "@/app/components/ui/Tabs/Tabs";
import { useLocale } from "@/app/providers/LocaleContext";

/* ====================================================== */
export type TabType = "all" | "news" | "activity";

type Props = {
  tab: TabType;
  setTab: (val: TabType) => void;
};

/* ====================================================== */
export default function NewsTabs({ tab, setTab }: Props) {
  const { messages } = useLocale();

  /* ======================================================
     🔥 FIX TYPE (กัน TS แดง)
  ====================================================== */
  const newsText = (messages as any)?.news;

  /* ======================================================
     🔥 TABS DATA (type-safe)
  ====================================================== */
  const tabs: TabItem<TabType>[] = [
    {
      label: newsText?.all ?? "ทั้งหมด",
      value: "all",
    },
    {
      label: newsText?.news ?? "ข่าวสาร",
      value: "news",
    },
    {
      label: newsText?.activity ?? "กิจกรรม",
      value: "activity",
    },
  ];

  /* ====================================================== */
  return (
    <Tabs<TabType>
      tabs={tabs}
      value={tab}
      onChange={setTab}
    />
  );
}