import { apiFetch } from "../api/client";
import type { EditorialTypeApiItem, NewsApiItem } from "./type";
import {
  isEditorialActive,
  normalizeEditorial,
  normalizeEditorialType,
  sortEditorials,
  type EditorialItem,
  type EditorialTypeItem,
} from "./editorialData";

export type NewsPageItem = EditorialItem;
export type NewsEditorialType = EditorialTypeItem;

export async function getNewsPageData(): Promise<{
  news: NewsPageItem[];
  highlights: NewsPageItem[];
  editorialTypes: NewsEditorialType[];
}> {
  try {
    const [typeResponse, newsResponse] = await Promise.all([
      apiFetch<EditorialTypeApiItem[]>("/api/editorialtypeapi"),
      apiFetch<NewsApiItem[]>("/api/editoriaapimain"),
    ]);

    const editorialTypes = (typeResponse.data || [])
      .filter((item) => isEditorialActive(item.active))
      .map(normalizeEditorialType)
      .filter((item) => item.id && (item.nameTH || item.nameEN));

    const activeTypeIds = new Set(editorialTypes.map((item) => item.id));
    const news = sortEditorials(
      (newsResponse.data || [])
        .filter((item) => isEditorialActive(item.active))
        .map(normalizeEditorial)
        .filter((item) => item.typeID && activeTypeIds.has(item.typeID))
        .filter((item) => (item.titleTH || item.titleEN) && item.images.length)
    );

    const highlights = news.filter((item) => item.pinned);

    return {
      news,
      highlights: highlights.length ? highlights : news,
      editorialTypes,
    };
  } catch (error) {
    console.error("Fetch news error:", error);
    return { news: [], highlights: [], editorialTypes: [] };
  }
}
