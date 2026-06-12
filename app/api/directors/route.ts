import { NextResponse } from "next/server";
import { apiFetch } from "../client";
import { buildImageUrl } from "@/app/Utils/imageUrl";

type RawRecord = Record<string, unknown>;

type Director = {
  id: string;
  nameTH: string;
  nameEN: string;
  positionTH: string;
  positionEN: string;
  picture: string;
  tag: string;
};

const toText = (value: unknown): string =>
  typeof value === "string" ? value : "";

const getResultList = (response: unknown): RawRecord[] => {
  if (Array.isArray(response)) return response as RawRecord[];

  if (response && typeof response === "object") {
    const record = response as RawRecord;

    if (Array.isArray(record.result)) return record.result as RawRecord[];
    if (Array.isArray(record.data)) return record.data as RawRecord[];
  }

  return [];
};

const toImageUrl = (src: string): string => {
  return buildImageUrl(src);
};

const normalizeDirector = (item: RawRecord): Director => ({
  id: toText(item.id),
  nameTH: toText(item.nameTH),
  nameEN: toText(item.nameEN),
  positionTH: toText(item.positionTH),
  positionEN: toText(item.positionEN),
  picture: toImageUrl(toText(item.picture)),
  tag: toText(item.tag),
});

export async function GET() {
  try {
    const response = await apiFetch<unknown>("/api/directorsapi");
    const directors = getResultList(response)
      .map(normalizeDirector)
      .filter((item) => item.id && (item.nameTH || item.nameEN));

    return NextResponse.json({ directors });
  } catch (error) {
    console.error("Directors API error:", error);
    return NextResponse.json({ directors: [] }, { status: 502 });
  }
}
