import { Suspense } from "react";

import { getNewsActivitiesListData } from "@/app/Utils/newsActivitiesList";
import Loading from "./loading";
import NewsListPage from "./NewsListPage";

export default async function Page() {
  const { news, editorialTypes } = await getNewsActivitiesListData();

  return (
    <Suspense fallback={<Loading />}>
      <NewsListPage
        initialData={news}
        initialEditorialTypes={editorialTypes}
      />
    </Suspense>
  );
}
