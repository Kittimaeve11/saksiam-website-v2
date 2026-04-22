/* ====================================================== */
import { Suspense } from "react";
import NewsListClient from "../views/news/news-activities-list/NewsListClient";

/* ====================================================== */
export default function Page() {
  return (
    <Suspense fallback={null}>
      <NewsListClient />
    </Suspense>
  );
}