import { buildImageUrl, toText } from "./imageUrl";
import type { EditorialTypeApiItem, NewsApiItem } from "./type";

export type EditorialItem = {
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

export type EditorialTypeItem = {
  id: string;
  nameTH: string;
  nameEN: string;
};

export const stripEditorialHtml = (value: string): string =>
  value
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const toEditorialTimestamp = (value: string): number => {
  const timestamp = new Date(value.replace(" ", "T")).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
};

export const isEditorialActive = (value: string | null | undefined): boolean =>
  toText(value) !== "0";

export const isEditorialPinned = (value: string | null | undefined): boolean =>
  toText(value) === "1";

export const normalizeEditorialType = (
  item: EditorialTypeApiItem
): EditorialTypeItem => ({
  id: toText(item.editorialtypeID || item.id),
  nameTH: toText(item.nameTH || item.editorialtypenameTH),
  nameEN: toText(item.nameEN || item.editorialtypenameEN),
});

export const normalizeEditorial = (item: NewsApiItem): EditorialItem => ({
  id: toText(item.editoriaNum),
  typeID: toText(item.typeID),
  categoryTH: toText(item.typeNameTH),
  categoryEN: toText(item.typeNameEN),
  titleTH: toText(item.titleTH),
  titleEN: toText(item.titleEN),
  detailTH: stripEditorialHtml(toText(item.descriptionTH)),
  detailEN: stripEditorialHtml(toText(item.descriptionEN)),
  createdAt: toText(item.approvedate || item.createAt),
  images: (item.gallery || []).map((src) => buildImageUrl(toText(src))).filter(Boolean),
  pinned: isEditorialPinned(item.pin),
});

export const normalizeEditorialDetail = (item: NewsApiItem): EditorialItem => ({
  ...normalizeEditorial(item),
  detailTH: toText(item.descriptionTH),
  detailEN: toText(item.descriptionEN),
});

export const sortEditorials = <T extends { createdAt: string; pinned?: boolean }>(
  items: T[]
): T[] =>
  [...items].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return toEditorialTimestamp(b.createdAt) - toEditorialTimestamp(a.createdAt);
  });
