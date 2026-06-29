import type { Director } from "@/app/components/cards/DirectorCard/DirectorCard";
import { buildImageUrl, toText } from "./imageUrl";
import type { DirectorApiItem } from "./type";

export const isDirectorActive = (
  value: string | null | undefined
): boolean => toText(value) !== "0";

export const getDirectorOrder = (item: DirectorApiItem): number => {
  const order = Number(item.order);
  const id = Number(item.id);

  if (Number.isFinite(order)) return order;
  return Number.isFinite(id) ? id : Number.MAX_SAFE_INTEGER;
};

export const normalizeDirector = (item: DirectorApiItem): Director => ({
  id: toText(item.id),
  nameTH: toText(item.nameTH),
  nameEN: toText(item.nameEN),
  positionTH: toText(item.positionTH),
  positionEN: toText(item.positionEN),
  picture: buildImageUrl(toText(item.picture)),
  tag: toText(item.tag),
});

export const normalizeCommitteeTag = (value: string): string =>
  value.replace(/\s+/g, "");
