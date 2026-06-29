const ABSOLUTE_URL_PATTERN = /^https?:\/\//i;

export function toText(value: unknown): string {
  if (typeof value === "number") return String(value);
  return typeof value === "string" ? value.trim() : "";
}

export function buildImageUrl(src: string, baseUrl = process.env.NEXT_PUBLIC_API_PHOTO || ""): string {
  const value = src.trim();
  const base = baseUrl.trim();

  if (!value) return "";
  if (ABSOLUTE_URL_PATTERN.test(value) || value.startsWith("/")) return value;
  if (!base) return value;

  return `${base.replace(/\/+$/, "")}/${value.replace(/^\/+/, "")}`;
}

export function buildApiImageUrl(
  src: string | number | null | undefined,
  baseUrl = process.env.NEXT_PUBLIC_API_PHOTO || process.env.NEXT_PUBLIC_API_URL || ""
): string {
  const value = toText(src);
  const base = baseUrl.trim();

  if (!value) return "";
  if (ABSOLUTE_URL_PATTERN.test(value)) return value;
  if (!base) return value;

  return value.startsWith("/")
    ? `${base.replace(/\/+$/, "")}${value}`
    : `${base.replace(/\/+$/, "")}/${value.replace(/^\/+/, "")}`;
}
