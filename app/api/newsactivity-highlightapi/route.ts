import { NextResponse } from "next/server";
import { apiFetch } from "../client";
import { fetchGalleryMap, getImagesForEditorial } from "../../Utils/editorialGallery";

type Highlight = {
  id: string;
  typeID: string;
  categoryTH: string;
  categoryEN: string;
  titleTH: string;
  titleEN: string;
  detailTH: string;
  detailEN: string;
  createdAt: string;
  images: string[];
  pinned: boolean;
};

type RawRecord = Record<string, unknown>;

const toText = (value: unknown): string =>
  typeof value === "string" ? value : "";

const toIdText = (value: unknown): string => {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return "";
};

const toBoolean = (value: unknown): boolean => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return ["1", "true", "yes", "y", "pin", "pinned"].includes(normalized);
  }

  return false;
};

const isExplicitlyInactive = (value: unknown): boolean => {
  if (typeof value === "boolean") return !value;
  if (typeof value === "number") return value === 0;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return ["0", "false", "no", "n", "inactive", "disable", "disabled"].includes(normalized);
  }

  return false;
};

const pick = (item: RawRecord, keys: string[]): unknown => {
  for (const key of keys) {
    if (item[key] !== undefined && item[key] !== null) return item[key];
  }

  return "";
};

const stripHtml = (value: string): string =>
  value
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getResultList = (response: unknown): RawRecord[] => {
  if (Array.isArray(response)) return response as RawRecord[];

  if (response && typeof response === "object") {
    const record = response as Record<string, unknown>;

    if (Array.isArray(record.result)) return record.result as RawRecord[];
    if (Array.isArray(record.data)) return record.data as RawRecord[];
  }

  return [];
};

const normalizeHighlight = (
  item: RawRecord,
  index: number,
  galleryMap: Map<string, string[]>
): Highlight => {
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
  return {
    id: id || String(index + 1),
    typeID: toText(pick(item, ["typeID", "int_saksiam_editoria_typeID"])),
    categoryTH: toText(pick(item, ["typeNameTH"])),
    categoryEN: toText(pick(item, ["typeNameEN"])),
    titleTH: toText(pick(item, ["titleTH", "int_saksiam_editoria_titieTH"])),
    titleEN: toText(pick(item, ["titleEN", "int_saksiam_editoria_titieEN"])),
    detailTH: stripHtml(
      toText(pick(item, ["descriptionTH", "int_saksiam_editoria_descriptionTH"]))
    ),
    detailEN: stripHtml(
      toText(pick(item, ["descriptionEN", "int_saksiam_editoria_descriptionEN"]))
    ),
    createdAt: toText(
      pick(item, ["approvedate", "createAt", "int_saksiam_editoria_approvedate"])
    ),
    images: getImagesForEditorial(item, galleryMap),
    pinned: toBoolean(pick(item, ["pin", "pinned", "int_saksiam_editoria_pin"])),
  };
};

export async function GET() {
  try {
    const [mainResponse, typeResponse, galleryMap] = await Promise.all([
      apiFetch<unknown>("/api/editoriaapimain"),
      apiFetch<unknown>("/api/editorialtypeapi"),
      fetchGalleryMap(),
    ]);

    const activeTypeIds = new Set(
      getResultList(typeResponse)
        .filter(
          (item) =>
            !isExplicitlyInactive(pick(item, ["active", "int_saksiam_Typeeditoria_active"]))
        )
        .map((item) =>
          toIdText(
            pick(item, ["id", "editorialtypeID", "typeeditoriaID", "int_saksiam_Typeeditorial_id"])
          )
        )
        .filter(Boolean)
    );

    const usedIds = new Set<string>();
    const highlights = getResultList(mainResponse)
      .map((item, index) => normalizeHighlight(item, index, galleryMap))
      .filter((item) => (item.titleTH || item.titleEN) && activeTypeIds.has(item.typeID))
      .filter((item) => {
        if (usedIds.has(item.id)) return false;
        usedIds.add(item.id);
        return true;
      })
      .slice(0, 10);

    return NextResponse.json({ highlights });
  } catch (error) {
    console.error("News activity highlight API error:", error);
    return NextResponse.json({ highlights: [] }, { status: 502 });
  }
}
