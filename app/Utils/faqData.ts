import { apiFetch } from "@/app/api/client";
import type {
  FaqApiItem,
  FaqItem,
  FaqTypeApiItem,
  FaqTypeItem,
} from "@/app/Utils/type";

const toText = (value: string | number | null | undefined): string => {
  if (typeof value === "number") return String(value);
  return typeof value === "string" ? value.trim() : "";
};

const isInactive = (
  value: boolean | number | string | null | undefined
): boolean => {
  if (typeof value === "boolean") return !value;
  if (typeof value === "number") return value === 0;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return ["0", "false", "no", "n", "inactive", "disable", "disabled"].includes(
      normalized
    );
  }

  return false;
};

const normalizeFaqType = (
  item: FaqTypeApiItem
): FaqTypeItem & { active: boolean } => ({
  id: toText(item.faqtypeID || item.typeID || item.id || item.int_saksiam_typefqa_id),
  nameTH: toText(item.faqtypenameTH || item.typeNameTH || item.nameTH),
  nameEN: toText(item.faqtypenameEN || item.typeNameEN || item.nameEN),
  active: !isInactive(
    item.active || item.faqtypeactive || item.int_saksiam_typefqa_active
  ),
});

const normalizeFaq = (item: FaqApiItem, index: number): FaqItem => ({
  id: Number(toText(item.id || item.fqaID || item.faqQuestionID || item.int_saksiam_fqa_id)) || index + 1,
  category: toText(item.faqtypeID || item.typeID || item.int_saksiam_fqa_type),
  questionTH: toText(item.questionTH || item.int_saksiam_fqa_questionTH),
  questionEN: toText(item.questionEN || item.int_saksiam_fqa_questionEN),
  answerTH: toText(item.answerTH || item.answersTH || item.int_saksiam_fqa_answersTH),
  answerEN: toText(item.answerEN || item.answersEN || item.int_saksiam_fqa_answersEN),
});

export async function getFaqData(): Promise<{
  faq: FaqItem[];
  faqTypes: FaqTypeItem[];
}> {
  try {
    const [faqResponse, typeResponse] = await Promise.all([
      apiFetch<FaqApiItem[]>("/api/faqapi"),
      apiFetch<FaqTypeApiItem[]>("/api/faqtypeapi"),
    ]);

    const faqTypes = (typeResponse.data || typeResponse.result || [])
      .map(normalizeFaqType)
      .filter((item) => item.id && item.active && (item.nameTH || item.nameEN));

    const activeTypeIds = new Set(faqTypes.map((item) => item.id));
    const faq = (faqResponse.data || faqResponse.result || [])
      .map(normalizeFaq)
      .filter(
        (item) =>
          item.category &&
          activeTypeIds.has(item.category) &&
          (item.questionTH || item.questionEN)
      );

    return { faq, faqTypes };
  } catch (error) {
    console.error("FAQ page fetch error:", error);
    return { faq: [], faqTypes: [] };
  }
}
