import { timeData } from "@/app/api/service/route";

export const normalizeContactTime = (
  value: string | null
): string | null => {
  if (!value || value === "0") return null;

  const option = timeData.find(
    (item) =>
      String(item.id) === String(value) ||
      item.valuename === value
  );

  return option?.valuename ?? value;
};