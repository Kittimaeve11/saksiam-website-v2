import { NextResponse } from "next/server";
import { apiFetch } from "../../client";
import { getEditorialViews } from "../../editoria-views/store";
import type { NewsApiItem } from "@/app/Utils/type";
import {
  isEditorialActive,
  normalizeEditorialDetail,
} from "@/app/Utils/editorialData";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const response = await apiFetch<NewsApiItem[]>("/api/editoriaapimain");
    const record = (response.data || []).find(
      (item) => item.editoriaNum === id && isEditorialActive(item.active)
    );

    if (!record) {
      return NextResponse.json({ editorial: null }, { status: 404 });
    }

    const editorial = normalizeEditorialDetail(record);

    return NextResponse.json({
      editorial: {
        ...editorial,
        num: editorial.id,
        views: await getEditorialViews(editorial.id),
      },
    });
  } catch (error) {
    console.error("Editorial detail API error:", error);
    return NextResponse.json({ editorial: null }, { status: 502 });
  }
}
