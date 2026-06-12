"use client";

import Tabs, { TabItem } from "@/app/components/ui/Tabs/Tabs";
import TabsSkeleton from "@/app/components/ui/Tabs/Tabsskeleton";
import { useLocale } from "@/app/providers/LocaleContext";

export type TabType = string;

export type EditorialType = {
  id: string;
  nameTH: string;
  nameEN: string;
};

type Props = {
  tab: TabType;
  setTab: (val: TabType) => void;
  editorialTypes: EditorialType[];
  loading?: boolean;
};

export const getEditorialTabValue = (item: EditorialType): TabType => {
  const nameEN = item.nameEN.toLowerCase();

  if (nameEN === "news") return "news";
  if (nameEN === "activity" || nameEN === "activities") return "activity";

  return item.id;
};

export default function NewsTabs({
  tab,
  setTab,
  editorialTypes,
  loading = false,
}: Props) {
  const { locale } = useLocale();

  if (loading) {
    return <TabsSkeleton count={3} />;
  }

  const tabs: TabItem<TabType>[] = [
    {
      label: locale === "en" ? "All" : "ทั้งหมด",
      value: "all",
    },
    ...editorialTypes.map((item) => ({
      label: locale === "en" ? item.nameEN : item.nameTH,
      value: getEditorialTabValue(item),
    })),
  ];

  return (
    <div>
      <Tabs<TabType> tabs={tabs} value={tab} onChange={setTab} />
    </div>
  );
}
