const ABSOLUTE_URL_PATTERN = /^https?:\/\//i;

export function buildImageUrl(src: string, baseUrl = process.env.NEXT_PUBLIC_API_PHOTO || ""): string {
  const value = src.trim();
  const base = baseUrl.trim();

  if (!value) return "";
  if (ABSOLUTE_URL_PATTERN.test(value) || value.startsWith("/")) return value;
  if (!base) return value;

  return `${base.replace(/\/+$/, "")}/${value.replace(/^\/+/, "")}`;
}
