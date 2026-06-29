"use client";

import Tabs, { TabItem } from "@/app/components/ui/Tabs/Tabs";
import TabsSkeleton from "@/app/components/ui/Tabs/Tabsskeleton";
import { useLocale } from "@/app/providers/LocaleContext";
import { ALL_TAB_SLUG, toTabSlug } from "@/app/Utils/tabSlug";
import type { EditorialType } from "@/app/Utils/type";

export type TabType = string;


type Props = {
  tab: TabType;
  setTab: (val: TabType) => void;
  editorialTypes: EditorialType[];
  loading?: boolean;
};

export const getEditorialTabValue = (item: EditorialType): TabType => {
  return toTabSlug(item.nameEN || item.nameTH || item.id);
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
      value: ALL_TAB_SLUG,
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
