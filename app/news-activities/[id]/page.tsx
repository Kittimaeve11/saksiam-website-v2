/* ======================================================
   IMPORT
====================================================== */
import NewsDetailClient from "@/app/views/news/news-detail/NewDetailClient";

/* ======================================================
   PAGE
====================================================== */
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // 🔥 สำคัญมาก (Next 16)

  return <NewsDetailClient id={id} />;
}