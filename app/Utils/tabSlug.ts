const NEWS_LIST_PREFIX = "/news-activities-list-tab-";
const FAQ_PREFIX = "/faq-tab-";

export const ALL_TAB_SLUG = "All";

export const toTabSlug = (value: string): string => {
  const text = value.trim();

  if (!text || text.toLowerCase() === "all") return ALL_TAB_SLUG;

  return text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const normalizeTabSlug = (value: string | null | undefined): string => {
  if (!value) return ALL_TAB_SLUG;

  const slug = toTabSlug(decodeURIComponent(value));
  return slug || ALL_TAB_SLUG;
};

export const isSameTabSlug = (
  slug: string | null | undefined,
  label: string | null | undefined
): boolean => normalizeTabSlug(slug).toLowerCase() === toTabSlug(label || "").toLowerCase();

export const getNewsListTabPath = (slug: string): string =>
  `${NEWS_LIST_PREFIX}${normalizeTabSlug(slug)}`;

export const getFaqTabPath = (slug: string): string =>
  `${FAQ_PREFIX}${normalizeTabSlug(slug)}`;
