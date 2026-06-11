"use client";

import Tabs, { TabItem } from "@/app/components/ui/Tabs/Tabs";
import TabsSkeleton from "@/app/components/ui/Tabs/Tabsskeleton";
import { useLocale } from "@/app/providers/LocaleContext";
import type { FaqTypeItem } from "@/app/Utils/type";

type Props = {
  tab: string;
  setTab: (val: string) => void;
  faqTypes: FaqTypeItem[];
  loading?: boolean;
};

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
    { label: messages?.faq?.all || "ทั้งหมด", value: "all" },
    ...faqTypes.map((item) => ({
      label: locale === "en" ? item.nameEN || item.nameTH : item.nameTH || item.nameEN,
      value: item.id,
    })),
  ];

  return (
    <div className="fade-in">
      <Tabs tabs={tabs} value={tab} onChange={setTab} />
    </div>
  );
}
