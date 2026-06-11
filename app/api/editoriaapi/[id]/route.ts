import { NextResponse } from "next/server";
import { apiFetch } from "../../client";
import { getEditorialViews } from "../../editoria-views/store";
import {
  fetchGalleryImagesByEditorial,
  getFallbackEditorialImages,
} from "../../../Utils/editorialGallery";

type EditorialItem = {
  id: string;
  num: string;
  typeID: string;
  categoryTH: string;
  categoryEN: string;
  titleTH: string;
  titleEN: string;
  detailTH: string;
  detailEN: string;
  createdAt: string;
  images: string[];
  views: number;
  pinned: boolean;
};

type RawRecord = Record<string, unknown>;

const toText = (value: unknown): string =>
  typeof value === "string" ? value : "";

const toBoolean = (value: unknown): boolean => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return ["1", "true", "yes", "y", "pin", "pinned"].includes(normalized);
  }

  return false;
};

const toIdText = (value: unknown): string => {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return "";
};

const pick = (item: RawRecord, keys: string[]): unknown => {
  for (const key of keys) {
    if (item[key] !== undefined && item[key] !== null) return item[key];
  }

  return "";
};

const getRecord = (response: unknown): RawRecord | null => {
  if (Array.isArray(response)) return (response[0] as RawRecord) || null;

  if (response && typeof response === "object") {
    const record = response as Record<string, unknown>;

    if (record.data && typeof record.data === "object" && !Array.isArray(record.data)) {
      return record.data as RawRecord;
    }

    if (Array.isArray(record.data)) return (record.data[0] as RawRecord) || null;
    if (Array.isArray(record.result)) return (record.result[0] as RawRecord) || null;

    return record as RawRecord;
  }

  return null;
};

const normalizeEditorial = async (
  item: RawRecord,
  fallbackId: string,
  galleryImages: string[]
): Promise<EditorialItem> => {
  const id = toIdText(
    pick(item, [
      "id",
      "editoriaID",
      "editoriaId",
      "editoriaNum",
      "int_saksiam_editoria_id",
      "int_saksiam_editoria_num",
    ])
  );
  const normalizedId = id || fallbackId;
  const storedViews = normalizedId ? await getEditorialViews(normalizedId) : 0;

  return {
    id: normalizedId,
    num: toText(
      pick(item, [
        "num",
        "editoriaNum",
        "int_saksiam_editoria_num",
        "int_saksiam_editoria_Num",
      ])
    ),
    typeID: toText(pick(item, ["typeID", "int_saksiam_editoria_typeID"])),
    categoryTH: toText(pick(item, ["typeNameTH"])),
    categoryEN: toText(pick(item, ["typeNameEN"])),
    titleTH: toText(pick(item, ["titleTH", "int_saksiam_editoria_titieTH"])),
    titleEN: toText(pick(item, ["titleEN", "int_saksiam_editoria_titieEN"])),
    detailTH: toText(pick(item, ["descriptionTH", "int_saksiam_editoria_descriptionTH"])),
    detailEN: toText(pick(item, ["descriptionEN", "int_saksiam_editoria_descriptionEN"])),
    createdAt: toText(
      pick(item, ["approvedate", "createAt", "int_saksiam_editoria_approvedate"])
    ),
    images: galleryImages.length ? galleryImages : getFallbackEditorialImages(item),
    views: storedViews,
    pinned: toBoolean(pick(item, ["pin", "pinned", "int_saksiam_editoria_pin"])),
  };
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const response = await apiFetch<unknown>(`/api/editoriaapi/${id}`);
    const record = getRecord(response);

    if (!record) {
      return NextResponse.json({ editorial: null }, { status: 404 });
    }

    const galleryKey =
      toText(
        pick(record, [
          "num",
          "editoriaNum",
          "int_saksiam_editoria_num",
          "int_saksiam_editoria_Num",
          "id",
          "editoriaID",
          "editoriaId",
          "int_saksiam_editoria_id",
        ])
      ) || id;
    const galleryImages = await fetchGalleryImagesByEditorial(galleryKey);

    return NextResponse.json({
      editorial: await normalizeEditorial(record, id, galleryImages),
    });
  } catch (error) {
    console.error("Editorial detail API error:", error);
    return NextResponse.json({ editorial: null }, { status: 502 });
  }
}
