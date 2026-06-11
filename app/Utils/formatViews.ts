const formatOneDecimal = (value: number): string => {
  const fixed = value.toFixed(1);
  return fixed.endsWith(".0") ? fixed.slice(0, -2) : fixed;
};

export const formatViews = (
  views: number | undefined,
  locale: "th" | "en"
): string => {
  const value = Math.max(0, Number(views) || 0);

  if (locale === "th") {
    if (value >= 1_000_000) {
      return `${formatOneDecimal(value / 1_000_000)} ล้าน ครั้ง`;
    }
    if (value >= 100_000) {
      return `${formatOneDecimal(value / 100_000)} แสน ครั้ง`;
    }
    if (value >= 10_000) {
      return `${formatOneDecimal(value / 10_000)} หมื่น ครั้ง`;
    }
    if (value >= 1_000) {
      return `${formatOneDecimal(value / 1_000)} พัน ครั้ง`;
    }

    return `${value.toLocaleString("th-TH")} ครั้ง`;
  }

  if (value >= 1_000_000_000) {
    return `${formatOneDecimal(value / 1_000_000_000)}B views`;
  }
  if (value >= 1_000_000) {
    return `${formatOneDecimal(value / 1_000_000)}M views`;
  }
  if (value >= 1_000) {
    return `${formatOneDecimal(value / 1_000)}K views`;
  }

  return `${value.toLocaleString("en-US")} views`;
};
