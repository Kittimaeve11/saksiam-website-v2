import { apiFetch, type ApiFetchOptions } from "../api/client";
import { buildImageUrl, toText } from "./imageUrl";
import type { NewsApiItem } from "./type";

type EditorialGalleryRecord = Pick<NewsApiItem, "editoriaNum" | "gallery">;

export const toEditorialImageUrl = (src: string): string => buildImageUrl(src);

export const parseGalleryValue = (value: string[] | null | undefined): string[] =>
  (value || []).map((src) => toText(src)).filter(Boolean);

export const getEditorialGalleryKeys = (
  item: EditorialGalleryRecord
): string[] => {
  const key = toText(item.editoriaNum);
  return key ? [key] : [];
};

export const getFallbackEditorialImages = (
  item: EditorialGalleryRecord
): string[] =>
  parseGalleryValue(item.gallery)
    .map(toEditorialImageUrl)
    .filter(Boolean);

export const getImagesForEditorial = (
  item: EditorialGalleryRecord,
  galleryMap: Map<string, string[]>
): string[] => {
  const key = toText(item.editoriaNum);
  const mappedImages = key ? galleryMap.get(key) : null;

  return mappedImages?.length ? mappedImages : getFallbackEditorialImages(item);
};

export async function fetchGalleryMap(
  options?: ApiFetchOptions
): Promise<Map<string, string[]>> {
  try {
    const response = await apiFetch<NewsApiItem[]>("/api/editoriaapimain", options);
    const map = new Map<string, string[]>();

    (response.data || []).forEach((item) => {
      const key = toText(item.editoriaNum);
      const images = getFallbackEditorialImages(item);

      if (key && images.length) {
        map.set(key, images);
      }
    });

    return map;
  } catch (error) {
    console.error("Fetch editorial gallery map error:", error);
    return new Map();
  }
}

export async function fetchGalleryImagesByEditorial(
  editorialKey: string
): Promise<string[]> {
  const key = toText(editorialKey);
  if (!key) return [];

  try {
    const response = await apiFetch<NewsApiItem[]>("/api/editoriaapimain");
    const item = (response.data || []).find((record) => record.editoriaNum === key);

    return item ? getFallbackEditorialImages(item) : [];
  } catch (error) {
    console.error("Fetch editorial gallery detail error:", error);
    return [];
  }
}
