import type { Metadata } from "next";
import { apiFetch } from "@/app/api/client";
import { toText } from "@/app/Utils/imageUrl";
import type { NewsApiItem } from "@/app/Utils/type";
import NewsDetailClient from "@/app/views/news/news-detail/NewsDetailClient";

type PageProps = {
  params: Promise<{ id: string }>;
};

const fallbackTitle = "ข่าวและกิจกรรม";

const getEditorialTitle = async (id: string): Promise<string> => {
  try {
    const response = await apiFetch<NewsApiItem[]>("/api/editoriaapimain");
    const record = (response.data || []).find((item) => item.editoriaNum === id);

    if (!record) return "";

    return toText(record.titleTH) || toText(record.titleEN);
  } catch (error) {
    console.error("Fetch editorial metadata error:", error);
    return "";
  }
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const title = (await getEditorialTitle(id)) || fallbackTitle;

  return {
    title,
    description: title,
    alternates: {
      canonical: `/news-activities-list/${id}`,
    },
    openGraph: {
      title,
      description: title,
      url: `https://saksiam.com/news-activities-list/${id}`,
      siteName: "SAKSIAM",
      locale: "th_TH",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: title,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return <NewsDetailClient id={id} />;
}
