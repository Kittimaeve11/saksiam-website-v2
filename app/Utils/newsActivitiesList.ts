import { apiFetch } from "@/app/api/client";
import { getEditorialViewMap } from "@/app/api/editoria-views/store";
import type { EditorialTypeApiItem, NewsApiItem } from "@/app/Utils/type";
import {
  isEditorialActive,
  normalizeEditorial,
  normalizeEditorialType,
  sortEditorials,
  type EditorialItem,
  type EditorialTypeItem,
} from "@/app/Utils/editorialData";

export type NewsListItem = EditorialItem & {
  views?: number;
};

export type NewsListEditorialType = EditorialTypeItem;

export async function getNewsActivitiesListData() {
  try {
    const [typeResponse, newsResponse, viewMap] = await Promise.all([
      apiFetch<EditorialTypeApiItem[]>("/api/editorialtypeapi"),
      apiFetch<NewsApiItem[]>("/api/editoriaapimain"),
      getEditorialViewMap(),
    ]);

    const editorialTypes = (typeResponse.data || [])
      .filter((item) => isEditorialActive(item.active))
      .map(normalizeEditorialType)
      .filter((item) => item.id && (item.nameTH || item.nameEN));

    const activeTypeIds = new Set(editorialTypes.map((item) => item.id));
    const news = sortEditorials(
      (newsResponse.data || [])
        .filter((item) => isEditorialActive(item.active))
        .map((item) => {
          const editorial = normalizeEditorial(item);
          return {
            ...editorial,
            views: viewMap[editorial.id] || 0,
          };
        })
        .filter((item) => item.typeID && activeTypeIds.has(item.typeID))
        .filter((item) => (item.titleTH || item.titleEN) && item.images.length)
    );

    return { news, editorialTypes };
  } catch (error) {
    console.error("Fetch news activities list error:", error);
    return { news: [], editorialTypes: [] };
  }
}
