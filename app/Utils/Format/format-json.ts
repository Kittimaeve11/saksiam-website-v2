export const safeParse = (val: string) => {
  try {
    return JSON.parse(val);
  } catch {
    return val;
  }
};
export const safeParses = (val: string) => {
    try {

        let parsed = JSON.parse(val);

        // กรณี parse รอบแรกแล้วยังเป็น string JSON อีก
        if (typeof parsed === 'string') {
            parsed = JSON.parse(parsed);
        }

        return parsed;

    } catch {
        return val;
    }
};
export const formatNumberInText = (text: string) => {
    return text.replace(/\b\d{4,}\b/g, (num) => {
        const number = Number(num);

        if (isNaN(number)) return num;

        return number.toLocaleString('en-US');
    });
};
export const formatTextList = (val?: string) => {
    if (!val) return [];

    const parsed = safeParse(val);

    const data = Array.isArray(parsed)
        ? parsed
        : String(parsed)
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);

    return data.map((item) => formatNumberInText(item));
};