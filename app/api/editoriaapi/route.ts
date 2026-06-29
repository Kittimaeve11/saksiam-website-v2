import { NextResponse } from "next/server";
import { apiFetch } from "../client";
import { getEditorialViewMap } from "../editoria-views/store";
import type { EditorialTypeApiItem, NewsApiItem } from "@/app/Utils/type";
import {
  isEditorialActive,
  normalizeEditorial,
  normalizeEditorialType,
  sortEditorials,
} from "@/app/Utils/editorialData";

export async function GET() {
  try {
    const [editoriaResponse, typeResponse, viewMap] = await Promise.all([
      apiFetch<NewsApiItem[]>("/api/editoriaapimain"),
      apiFetch<EditorialTypeApiItem[]>("/api/editorialtypeapi"),
      getEditorialViewMap(),
    ]);

    const editorialTypes = (typeResponse.data || [])
      .filter((item) => isEditorialActive(item.active))
      .map(normalizeEditorialType)
      .filter((item) => item.id && (item.nameTH || item.nameEN));

    const activeTypeIds = new Set(editorialTypes.map((item) => item.id));
    const editorials = sortEditorials(
      (editoriaResponse.data || [])
        .filter((item) => isEditorialActive(item.active))
        .map((item) => {
          const editorial = normalizeEditorial(item);
          return {
            ...editorial,
            views: viewMap[editorial.id] || 0,
          };
        })
        .filter((item) => (item.titleTH || item.titleEN) && activeTypeIds.has(item.typeID))
    );

    return NextResponse.json({ editorials, editorialTypes });
  } catch (error) {
    console.error("Editorial API error:", error);
    return NextResponse.json({ editorials: [], editorialTypes: [] }, { status: 502 });
  }
}
