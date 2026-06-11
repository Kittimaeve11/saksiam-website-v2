export type Policy = {
  id: string;
  titleTH: string;
  titleEN: string;
  detailTH: string;
  detailEN: string;
};

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const hasHtmlTag = (value: string): boolean => /<\/?[a-z][\s\S]*>/i.test(value);

export const toPolicyHtml = (value: string): string => {
  if (hasHtmlTag(value)) return value;

  return escapeHtml(value);
};
