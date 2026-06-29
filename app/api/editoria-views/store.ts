import { apiFetch } from "../client";
import { toText } from "@/app/Utils/imageUrl";

type ViewStore = Record<string, number>;
type RawRecord = Record<string, unknown>;

const getNested = (value: unknown, keys: string[]): unknown => {
  let current = value;

  for (const key of keys) {
    if (!current || typeof current !== "object") return undefined;
    current = (current as RawRecord)[key];
  }

  return current;
};

const getLogRows = (response: unknown): RawRecord[] => {
  const candidates = [
    getNested(response, ["data", "logs"]),
    getNested(response, ["result", "logs"]),
    getNested(response, ["data"]),
    getNested(response, ["result"]),
    response,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate as RawRecord[];
  }

  return [];
};

const isEditorialLog = (item: RawRecord): boolean => {
  const datatype = toText(item.datatype || item.int_saksiam_log_datatype);
  const actionDetail = toText(
    item.actionDetail || item.int_saksiam_log_ActionDetail
  );
  const text = `${datatype} ${actionDetail}`.toLowerCase();

  if (text.includes("สาขา")) {
    return false;
  }

  return (
    text.includes("ข่าว") ||
    text.includes("กิจกรรม") ||
    text.includes("editorial") ||
    text.includes("news") ||
    text.includes("activity")
  );
};

const getEditorialLogId = (item: RawRecord): string => {
  const dataID = toText(item.dataID || item.int_saksiam_log_dataID);
  if (dataID && dataID !== "0") return dataID;

  const actionDetail = toText(
    item.actionDetail || item.int_saksiam_log_ActionDetail
  );
  const editorialCode = actionDetail.match(/\bED[A-Za-z0-9_-]+\b/);

  return editorialCode?.[0] || "";
};

export const getEditorialViewMap = async (): Promise<ViewStore> => {
  try {
    const response = await apiFetch<unknown>(
      "/api/website/showlogAPI?typeFilter=3&limit=0&offset=0"
    );
    const rows = getLogRows(response);

    return rows.reduce<ViewStore>((result, item) => {
      if (!isEditorialLog(item)) return result;

      const id = getEditorialLogId(item);
      if (!id) return result;

      result[id] = (result[id] || 0) + 1;
      return result;
    }, {});
  } catch (error) {
    console.error("Fetch editorial view logs error:", error);
    return {};
  }
};

export const getEditorialViews = async (
  id: string | number
): Promise<number> => {
  const viewMap = await getEditorialViewMap();
  return viewMap[String(id)] || 0;
};

export const incrementEditorialViews = async (
  id: string | number
): Promise<number> => getEditorialViews(id);
