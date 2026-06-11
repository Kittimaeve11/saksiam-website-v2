import { apiFetch } from "@/app/api/client";

export type WebsiteThemeApiItem = {
  id?: string | number;
  name?: string;
  nameTH?: string;
  nameEN?: string;
  theme?: string;
  themeName?: string;
  themeType?: string;
  mode?: string;
  type?: string | number;
  status?: string | number | boolean;
  active?: string | number | boolean;
  isopen?: string | number | boolean;
  isOpen?: string | number | boolean;
  mourning?: string | number | boolean;
  isMourning?: string | number | boolean;
  commemorate?: string | number | boolean;
  isCommemorate?: string | number | boolean;
  grayscale?: string | number | boolean;
  [key: string]: unknown;
};

const WEBSITE_THEME_ENDPOINTS = [
  "/api/website/theme-mode",
];

const activeValues = new Set(["1", "true", "yes", "y", "on", "open", "active"]);
const mourningWords = ["mourning", "commemorate", "memorial", "grayscale", "blackwhite", "ไว้อาลัย"];

const normalize = (value: unknown): string =>
  String(value ?? "")
    .trim()
    .toLowerCase();

const isActiveValue = (value: unknown): boolean => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  return activeValues.has(normalize(value));
};

const hasMourningWord = (value: unknown): boolean => {
  const text = normalize(value);
  return mourningWords.some((word) => text.includes(word));
};

const toRecords = (value: unknown): WebsiteThemeApiItem[] => {
  if (Array.isArray(value)) return value as WebsiteThemeApiItem[];

  if (value && typeof value === "object") {
    const item = value as Record<string, unknown>;
    const nested =
      item.data ||
      item.result ||
      item.rows ||
      item.items ||
      item.website ||
      item.setting;

    if (
      nested &&
      nested !== value &&
      (Array.isArray(nested) || typeof nested === "object")
    ) {
      return toRecords(nested);
    }

    return [value as WebsiteThemeApiItem];
  }

  return [];
};

const isMourningRecord = (item: WebsiteThemeApiItem): boolean => {
  const explicitMourning =
    normalize(item.mode) === "grayscale" ||
    isActiveValue(item.mourning) ||
    isActiveValue(item.isMourning) ||
    isActiveValue(item.commemorate) ||
    isActiveValue(item.isCommemorate) ||
    isActiveValue(item.grayscale);

  if (explicitMourning) return true;

  const nameLooksMourning =
    hasMourningWord(item.name) ||
    hasMourningWord(item.nameTH) ||
    hasMourningWord(item.nameEN) ||
    hasMourningWord(item.theme) ||
    hasMourningWord(item.themeName) ||
    hasMourningWord(item.themeType) ||
    hasMourningWord(item.mode);

  const active =
    isActiveValue(item.status) ||
    isActiveValue(item.active) ||
    isActiveValue(item.isopen) ||
    isActiveValue(item.isOpen);

  return nameLooksMourning && active;
};

export async function getWebsiteMourningMode(): Promise<boolean> {
  for (const endpoint of WEBSITE_THEME_ENDPOINTS) {
    try {
      const response = await apiFetch<unknown>(endpoint);
      const records = toRecords(response.data ?? response.result ?? response);

      if (records.some(isMourningRecord)) return true;
    } catch {
      // Try the next known website-theme endpoint shape.
    }
  }

  return false;
}
