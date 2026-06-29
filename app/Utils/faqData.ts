import { apiFetch } from "@/app/api/client";
import { toText } from "@/app/Utils/imageUrl";
import type {
  FaqApiItem,
  FaqItem,
  FaqTypeApiItem,
  FaqTypeItem,
} from "@/app/Utils/type";

const toNullableText = (value: string | null | undefined): string | null => {
  if (value === null) return null;
  return toText(value) || null;
};

const isActive = (value: string | null | undefined): boolean => toText(value) !== "0";

const normalizeFaqType = (item: FaqTypeApiItem): FaqTypeItem => ({
  id: toText(item.id),
  faqtypeID: toText(item.faqtypeID),
  typefaqID: toText(item.typefaqID),
  nameTH: toText(item.nameTH),
  nameEN: toText(item.nameEN),
  faqtypenameTH: toText(item.faqtypenameTH),
  faqtypenameEN: toText(item.faqtypenameEN),
  active: toText(item.active),
  savename: toText(item.savename),
  createAt: toText(item.createAt),
  updateAt: toNullableText(item.updateAt),
  faqtypeorder: toNullableText(item.faqtypeorder),
  typefaqorder: toNullableText(item.typefaqorder),
});

const normalizeFaq = (item: FaqApiItem): FaqItem => ({
  id: toText(item.id),
  faqtypeID: toText(item.faqtypeID),
  typeID: toText(item.typeID),
  faqtypeNameTH: toText(item.faqtypeNameTH),
  faqtypeNameEN: toText(item.faqtypeNameEN),
  typeNameTH: toText(item.typeNameTH),
  typeNameEN: toText(item.typeNameEN),
  questionTH: toText(item.questionTH),
  questionEN: toText(item.questionEN),
  answersTH: toText(item.answersTH),
  answersEN: toText(item.answersEN),
  active: toText(item.active),
  savename: toText(item.savename),
  createAt: toText(item.createAt),
  updateAt: toNullableText(item.updateAt),
  fqaorder: toNullableText(item.fqaorder),
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

    const faqTypes = (typeResponse.data || [])
      .map(normalizeFaqType)
      .filter(
        (item) =>
          item.faqtypeID &&
          isActive(item.active) &&
          (item.nameTH || item.nameEN)
      );

    const activeTypeIds = new Set(faqTypes.map((item) => item.faqtypeID));
    const faq = (faqResponse.data || [])
      .map(normalizeFaq)
      .filter(
        (item) =>
          item.id &&
          item.faqtypeID &&
          isActive(item.active) &&
          activeTypeIds.has(item.faqtypeID) &&
          (item.questionTH || item.questionEN) &&
          (item.answersTH || item.answersEN)
      );

    return { faq, faqTypes };
  } catch (error) {
    console.error("FAQ page fetch error:", error);
    return { faq: [], faqTypes: [] };
  }
}
