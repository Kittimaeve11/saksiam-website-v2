import { buildImageUrl, toText } from "./imageUrl";
import type { MissionApiItem, MissionItem } from "./type";

export const stripMissionHtml = (value: string): string =>
  value
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const normalizeMission = (item: MissionApiItem): MissionItem => ({
  id: toText(item.mission_ID),
  titleTH: stripMissionHtml(toText(item.topicTH)),
  titleEN: stripMissionHtml(toText(item.topicEN)),
  detailTH: stripMissionHtml(toText(item.titleTH)),
  detailEN: stripMissionHtml(toText(item.titleEN)),
  image: buildImageUrl(toText(item.picture)),
});
