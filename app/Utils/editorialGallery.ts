import { apiFetch } from "../api/client";
import { buildImageUrl } from "./imageUrl";

type RawRecord = Record<string, unknown>;

const ownerKeys = [
  "editoriaID",
  "editoriaId",
  "editoriaNum",
  "editoria_id",
  "editoria_num",
  "int_saksiam_editoria_id",
  "int_saksiam_editoria_num",
  "int_saksiam_editoria_Num",
  "int_saksiam_gallery_editoriaID",
  "int_saksiam_gallery_editoriaId",
  "int_saksiam_gallery_editoria_id",
  "int_saksiam_gallery_editoria_num",
  "newsID",
  "newsId",
  "dataID",
  "refID",
];

const imageKeys = [
  "image",
  "imageURL",
  "imageUrl",
  "images",
  "picture",
  "picturePC",
  "thumbnail",
  "file",
  "filename",
  "filepath",
  "path",
  "gallery",
  "galleryList",
  "gallary",
  "gallaryList",
  "galleryImage",
  "gallery_image",
  "int_saksiam_editoria_gallary",
  "int_saksiam_gallery_image",
  "int_saksiam_gallery_picture",
  "int_saksiam_gallery_file",
  "int_saksiam_gallery_path",
  "int_saksiam_gallery_name",
];

const sortKeys = [
  "sort",
  "sortorder",
  "order",
  "index",
  "int_saksiam_gallery_sort",
  "int_saksiam_gallery_order",
];

const toText = (value: unknown): string => {
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return typeof value === "string" ? value.trim() : "";
};

const toNumber = (value: unknown): number => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const pick = (item: RawRecord, keys: string[]): unknown => {
  for (const key of keys) {
    if (item[key] !== undefined && item[key] !== null) return item[key];
  }

  return "";
};

export const toEditorialImageUrl = (src: string): string => {
  return buildImageUrl(src);
};

export const parseGalleryValue = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value
      .flatMap((item) => {
        if (typeof item === "object" && item !== null) {
          return getGalleryImagesFromRecord(item as RawRecord);
        }

        return [String(item)];
      })
      .filter(Boolean);
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parseGalleryValue(parsed) : value ? [value] : [];
    } catch {
      return value ? [value] : [];
    }
  }

  return [];
};

export const getResultList = (response: unknown): RawRecord[] => {
  if (Array.isArray(response)) return response as RawRecord[];

  if (response && typeof response === "object") {
    const record = response as Record<string, unknown>;
    const directArrays = [
      record.result,
      record.data,
      record.gallery,
      record.galleries,
      record.galleryList,
      record.gallaryList,
    ];

    for (const value of directArrays) {
      if (Array.isArray(value)) return value as RawRecord[];
    }

    if (record.data && typeof record.data === "object") {
      const dataRecord = record.data as Record<string, unknown>;
      for (const value of Object.values(dataRecord)) {
        if (Array.isArray(value)) return value as RawRecord[];
      }
      return [dataRecord as RawRecord];
    }

    return [record as RawRecord];
  }

  return [];
};

const getGalleryImagesFromRecord = (item: RawRecord): string[] => {
  const images = imageKeys.flatMap((key) => parseGalleryValue(item[key]));

  return images
    .map(toEditorialImageUrl)
    .filter((src, index, list) => src && list.indexOf(src) === index);
};

const getGalleryOwnerIds = (item: RawRecord): string[] =>
  ownerKeys
    .map((key) => toText(item[key]))
    .filter((value, index, list) => value && list.indexOf(value) === index);

export const getEditorialGalleryKeys = (item: RawRecord): string[] =>
  ownerKeys
    .map((key) => toText(item[key]))
    .filter((value, index, list) => value && list.indexOf(value) === index);

export const getFallbackEditorialImages = (item: RawRecord): string[] =>
  parseGalleryValue(
    pick(item, [
      "galleryList",
      "gallaryList",
      "gallery",
      "gallary",
      "int_saksiam_editoria_gallary",
    ])
  )
    .map(toEditorialImageUrl)
    .filter(Boolean);

export const getImagesForEditorial = (
  item: RawRecord,
  galleryMap: Map<string, string[]>
): string[] => {
  for (const key of getEditorialGalleryKeys(item)) {
    const images = galleryMap.get(key);
    if (images?.length) return images;
  }

  return getFallbackEditorialImages(item);
};

export async function fetchGalleryMap(): Promise<Map<string, string[]>> {
  try {
    const response = await apiFetch<unknown>("/api/galleryapi");
    const map = new Map<string, string[]>();

    getResultList(response)
      .sort((a, b) => toNumber(pick(a, sortKeys)) - toNumber(pick(b, sortKeys)))
      .forEach((item) => {
        const images = getGalleryImagesFromRecord(item);
        if (!images.length) return;

        getGalleryOwnerIds(item).forEach((ownerId) => {
          const current = map.get(ownerId) || [];
          map.set(ownerId, [...current, ...images]);
        });
      });

    return map;
  } catch (error) {
    console.error("Fetch gallery list error:", error);
    return new Map();
  }
}

export async function fetchGalleryImagesByEditorial(
  editorialKey: string
): Promise<string[]> {
  if (!editorialKey) return [];

  try {
    const response = await apiFetch<unknown>(`/api/galleryapi/${editorialKey}`);
    return getResultList(response)
      .flatMap(getGalleryImagesFromRecord)
      .filter((src, index, list) => src && list.indexOf(src) === index);
  } catch (error) {
    console.error("Fetch gallery detail error:", error);
    return [];
  }
}
