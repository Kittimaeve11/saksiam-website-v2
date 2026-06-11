import { apiFetch } from "../api/client";
import { fetchGalleryMap, getImagesForEditorial } from "./editorialGallery";

export type NewsPageItem = {
  id: string | number;
  typeID?: string;
  categoryTH: string;
  categoryEN: string;
  titleTH: string;
  titleEN: string;
  detailTH: string;
  detailEN: string;
  createdAt: string;
  images: string[];
  pinned?: boolean;
};

export type NewsEditorialType = {
  id: string;
  nameTH: string;
  nameEN: string;
};

type EditorialTypeApiItem = {
  id?: string | number;
  editorialtypeID?: string | number;
  typeeditoriaID?: string | number;
  int_saksiam_Typeeditorial_id?: string | number;
  nameTH?: string;
  nameEN?: string;
  editorialtypenameTH?: string;
  editorialtypenameEN?: string;
  int_saksiam_Typeeditoria_nameTH?: string;
  int_saksiam_Typeeditoria_nameEN?: string;
  active?: boolean | number | string;
  int_saksiam_Typeeditoria_active?: boolean | number | string;
};

type EditorialApiItem = {
  id?: string | number;
  editoriaID?: string | number;
  editoriaId?: string | number;
  editoriaNum?: string | number;
  int_saksiam_editoria_id?: string | number;
  typeID?: string | number;
  int_saksiam_editoria_typeID?: string | number;
  typeNameTH?: string;
  typeNameEN?: string;
  titleTH?: string;
  titleEN?: string;
  int_saksiam_editoria_titieTH?: string;
  int_saksiam_editoria_titieEN?: string;
  descriptionTH?: string;
  descriptionEN?: string;
  int_saksiam_editoria_descriptionTH?: string;
  int_saksiam_editoria_descriptionEN?: string;
  approvedate?: string;
  createAt?: string;
  int_saksiam_editoria_approvedate?: string;
  pin?: boolean | number | string;
  pinned?: boolean | number | string;
  int_saksiam_editoria_pin?: boolean | number | string;
};

const toText = (value: string | number | null | undefined): string => {
  if (typeof value === "number") return String(value);
  return typeof value === "string" ? value.trim() : "";
};

const isInactive = (value: boolean | number | string | null | undefined): boolean => {
  if (typeof value === "boolean") return !value;
  if (typeof value === "number") return value === 0;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return ["0", "false", "no", "n", "inactive", "disable", "disabled"].includes(
      normalized
    );
  }

  return false;
};

const toBoolean = (value: boolean | number | string | null | undefined): boolean => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return ["1", "true", "yes", "y", "pin", "pinned"].includes(normalized);
  }

  return false;
};

const stripHtml = (value: string): string =>
  value
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const toTimestamp = (value: string): number => {
  const timestamp = new Date(value.replace(" ", "T")).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
};

const normalizeType = (item: EditorialTypeApiItem): NewsEditorialType => ({
  id: toText(
    item.id ||
      item.editorialtypeID ||
      item.typeeditoriaID ||
      item.int_saksiam_Typeeditorial_id
  ),
  nameTH: toText(
    item.nameTH || item.editorialtypenameTH || item.int_saksiam_Typeeditoria_nameTH
  ),
  nameEN: toText(
    item.nameEN || item.editorialtypenameEN || item.int_saksiam_Typeeditoria_nameEN
  ),
});

const normalizeNews = (
  item: EditorialApiItem,
  index: number,
  galleryMap: Map<string, string[]>
): NewsPageItem => ({
  id:
    toText(
      item.id ||
        item.editoriaID ||
        item.editoriaId ||
        item.editoriaNum ||
        item.int_saksiam_editoria_id
    ) || String(index + 1),
  typeID: toText(item.typeID || item.int_saksiam_editoria_typeID),
  categoryTH: toText(item.typeNameTH),
  categoryEN: toText(item.typeNameEN),
  titleTH: toText(item.titleTH || item.int_saksiam_editoria_titieTH),
  titleEN: toText(item.titleEN || item.int_saksiam_editoria_titieEN),
  detailTH: stripHtml(
    toText(item.descriptionTH || item.int_saksiam_editoria_descriptionTH)
  ),
  detailEN: stripHtml(
    toText(item.descriptionEN || item.int_saksiam_editoria_descriptionEN)
  ),
  createdAt: toText(
    item.approvedate || item.createAt || item.int_saksiam_editoria_approvedate
  ),
  images: getImagesForEditorial(item as Record<string, unknown>, galleryMap),
  pinned: toBoolean(item.pin || item.pinned || item.int_saksiam_editoria_pin),
});

export async function getNewsPageData(): Promise<{
  news: NewsPageItem[];
  highlights: NewsPageItem[];
  editorialTypes: NewsEditorialType[];
}> {
  try {
    const [typeResponse, newsResponse, highlightResponse, galleryMap] = await Promise.all([
      apiFetch<EditorialTypeApiItem[]>("/api/editorialtypeapi"),
      apiFetch<EditorialApiItem[]>("/api/editoriaapi"),
      apiFetch<EditorialApiItem[]>("/api/editoriaapimain"),
      fetchGalleryMap(),
    ]);

    const editorialTypes = (typeResponse.data || typeResponse.result || [])
      .filter((item) => !isInactive(item.active || item.int_saksiam_Typeeditoria_active))
      .map(normalizeType)
      .filter((item) => item.id && (item.nameTH || item.nameEN));

    const activeTypeIds = new Set(editorialTypes.map((item) => item.id));
    const news = (newsResponse.data || newsResponse.result || [])
      .map((item, index) => normalizeNews(item, index, galleryMap))
      .filter((item) => item.typeID && activeTypeIds.has(item.typeID))
      .filter((item) => (item.titleTH || item.titleEN) && item.images.length)
      .sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return toTimestamp(b.createdAt) - toTimestamp(a.createdAt);
      });

    const highlights = (highlightResponse.data || highlightResponse.result || [])
      .map((item, index) => normalizeNews(item, index, galleryMap))
      .filter((item) => item.images.length);

    return { news, highlights, editorialTypes };
  } catch (error) {
    console.error("Fetch news error:", error);
    return { news: [], highlights: [], editorialTypes: [] };
  }
}
