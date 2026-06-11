export const formatDistance = (distance?: number | null) => {
  if (!distance) return "";

  if (distance < 1000) {
    return `${Math.round(distance)} ม.`;
  }

  return `${(distance / 1000).toFixed(1)} กม.`;
};