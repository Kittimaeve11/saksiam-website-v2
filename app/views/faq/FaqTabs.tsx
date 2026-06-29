"use client";

import Tabs, { TabItem } from "@/app/components/ui/Tabs/Tabs";
import TabsSkeleton from "@/app/components/ui/Tabs/Tabsskeleton";
import { useLocale } from "@/app/providers/LocaleContext";
import type { FaqTypeItem } from "@/app/Utils/type";
import { ALL_TAB_SLUG, toTabSlug } from "@/app/Utils/tabSlug";

type Props = {
  tab: string;
  setTab: (val: string) => void;
  faqTypes: FaqTypeItem[];
  loading?: boolean;
};

const getTabLabel = (item: FaqTypeItem, locale: string): string =>
  locale === "en"
    ? item.nameEN || item.faqtypenameEN || item.nameTH
    : item.nameTH || item.faqtypenameTH || item.nameEN;

const getTabValue = (item: FaqTypeItem): string =>
  toTabSlug(item.nameEN || item.nameTH || item.faqtypeID || item.id);

export default function FaqTabs({
  tab,
  setTab,
  faqTypes,
  loading = false,
}: Props) {
  const { messages, locale } = useLocale();

  if (loading) {
    return <TabsSkeleton count={3} />;
  }

  const tabs: TabItem<string>[] = [
    { label: messages?.faq?.all || "ทั้งหมด", value: ALL_TAB_SLUG },
    ...faqTypes.map((item) => ({
      label: getTabLabel(item, locale),
      value: getTabValue(item),
    })),
  ];

  return (
    <div className="fade-in">
      <Tabs tabs={tabs} value={tab} onChange={setTab} />
    </div>
  );
}
