import { NextResponse } from "next/server";
import { apiFetch } from "../client";
import { getEditorialViewMap } from "../editoria-views/store";
import { fetchGalleryMap, getImagesForEditorial } from "../../Utils/editorialGallery";

type EditorialItem = {
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
  views: number;
  pinned: boolean;
};

type EditorialType = {
  id: string;
  nameTH: string;
  nameEN: string;
  active: boolean;
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

const isExplicitlyInactive = (value: unknown): boolean => {
  if (typeof value === "boolean") return !value;
  if (typeof value === "number") return value === 0;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return ["0", "false", "no", "n", "inactive", "disable", "disabled"].includes(normalized);
  }

  return false;
};

const toIdText = (value: unknown): string => {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return "";
};

const toTimestamp = (value: string): number => {
  const timestamp = new Date(value.replace(" ", "T")).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
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

const normalizeEditorial = (
  item: RawRecord,
  index: number,
  viewMap: Record<string, number>,
  galleryMap: Map<string, string[]>
): EditorialItem => {
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
  const normalizedId = id || String(index + 1);

  return {
    id: normalizedId,
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
    views: viewMap[normalizedId] || 0,
    pinned: toBoolean(pick(item, ["pin", "pinned", "int_saksiam_editoria_pin"])),
  };
};

const sortEditorials = (items: EditorialItem[]): EditorialItem[] =>
  [...items].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return toTimestamp(b.createdAt) - toTimestamp(a.createdAt);
  });

const normalizeEditorialType = (item: RawRecord): EditorialType => ({
  id: toText(pick(item, ["id", "editorialtypeID", "typeeditoriaID", "int_saksiam_Typeeditorial_id"])),
  nameTH: toText(pick(item, ["nameTH", "editorialtypenameTH", "int_saksiam_Typeeditoria_nameTH"])),
  nameEN: toText(pick(item, ["nameEN", "editorialtypenameEN", "int_saksiam_Typeeditoria_nameEN"])),
  active: !isExplicitlyInactive(
    pick(item, ["active", "int_saksiam_Typeeditoria_active"])
  ),
});

export async function GET() {
  try {
    const [editoriaResponse, typeResponse, galleryMap] = await Promise.all([
      apiFetch<unknown>("/api/editoriaapi"),
      apiFetch<unknown>("/api/editorialtypeapi"),
      fetchGalleryMap(),
    ]);

    const editorialTypes = getResultList(typeResponse)
      .map(normalizeEditorialType)
      .filter((item) => item.id && item.active && (item.nameTH || item.nameEN));

    const activeTypeIds = new Set(editorialTypes.map((item) => item.id));
    const viewMap = await getEditorialViewMap();
    const editorials = sortEditorials(
      getResultList(editoriaResponse)
        .map((item, index) => normalizeEditorial(item, index, viewMap, galleryMap))
        .filter((item) => (item.titleTH || item.titleEN) && activeTypeIds.has(item.typeID))
    );

    return NextResponse.json({ editorials, editorialTypes });
  } catch (error) {
    console.error("Editorial API error:", error);
    return NextResponse.json({ editorials: [], editorialTypes: [] }, { status: 502 });
  }
}
