import { NextResponse } from "next/server";
import { apiFetch } from "../client";

type FAQ = {
  id: number;
  category: string;
  questionTH: string;
  questionEN: string;
  answerTH: string;
  answerEN: string;
};

type FAQType = {
  id: string;
  nameTH: string;
  nameEN: string;
  active: boolean;
};

type RawRecord = Record<string, unknown>;

const toText = (value: unknown): string =>
  typeof value === "string" ? value : "";

const isExplicitlyInactive = (value: unknown): boolean => {
  if (typeof value === "boolean") return !value;
  if (typeof value === "number") return value === 0;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return ["0", "false", "no", "n", "inactive", "disable", "disabled"].includes(normalized);
  }

  return false;
};

const pick = (item: RawRecord, keys: string[]): unknown => {
  for (const key of keys) {
    if (item[key] !== undefined && item[key] !== null) return item[key];
  }

  return "";
};

const getResultList = (response: unknown): RawRecord[] => {
  if (Array.isArray(response)) return response as RawRecord[];

  if (response && typeof response === "object") {
    const record = response as Record<string, unknown>;

    if (Array.isArray(record.result)) return record.result as RawRecord[];
    if (Array.isArray(record.data)) return record.data as RawRecord[];
  }

  return [];
};

const normalizeFaq = (item: RawRecord, index: number): FAQ => {
  const id = toText(pick(item, ["id", "fqaID", "faqQuestionID", "int_saksiam_fqa_id"]));
  const typeId = toText(
    pick(item, ["faqtypeID", "typeID", "int_saksiam_fqa_type"])
  );

  return {
    id: Number(id) || index + 1,
    category: typeId,
    questionTH: toText(
      pick(item, ["questionTH", "int_saksiam_fqa_questionTH"])
    ),
    questionEN: toText(
      pick(item, ["questionEN", "int_saksiam_fqa_questionEN"])
    ),
    answerTH: toText(pick(item, ["answerTH", "answersTH", "int_saksiam_fqa_answersTH"])),
    answerEN: toText(pick(item, ["answerEN", "answersEN", "int_saksiam_fqa_answersEN"])),
  };
};

const normalizeFaqType = (item: RawRecord): FAQType => ({
  id: toText(pick(item, ["faqtypeID", "typeID", "id", "int_saksiam_typefqa_id"])),
  nameTH: toText(pick(item, ["faqtypenameTH", "typeNameTH", "nameTH"])),
  nameEN: toText(pick(item, ["faqtypenameEN", "typeNameEN", "nameEN"])),
  active: !isExplicitlyInactive(
    pick(item, ["active", "faqtypeactive", "int_saksiam_typefqa_active"])
  ),
});

export async function GET() {
  try {
    const [faqResponse, typeResponse] = await Promise.all([
      apiFetch<unknown>("/api/faqapi"),
      apiFetch<unknown>("/api/faqtypeapi"),
    ]);

    const faqTypes = getResultList(typeResponse)
      .map(normalizeFaqType)
      .filter((item) => item.id && item.active && (item.nameTH || item.nameEN));

    const activeTypeIds = new Set(faqTypes.map((item) => item.id));

    const faq = getResultList(faqResponse)
      .map(normalizeFaq)
      .filter(
        (item) =>
          item.category &&
          activeTypeIds.has(item.category) &&
          (item.questionTH || item.questionEN)
      );

    return NextResponse.json({ faq, faqTypes });
  } catch (error) {
    console.error("FAQ API error:", error);
    return NextResponse.json({ faq: [], faqTypes: [] }, { status: 502 });
  }
}
