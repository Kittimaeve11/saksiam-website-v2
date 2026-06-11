import { NextResponse } from "next/server";
import { apiFetch } from "../client";

type RawRecord = Record<string, unknown>;

type PolicyItem = {
  id: string;
  titleTH: string;
  titleEN: string;
};

const toText = (value: unknown): string =>
  typeof value === "string" ? value : "";

const pick = (item: RawRecord, keys: string[]): unknown => {
  for (const key of keys) {
    if (item[key] !== undefined && item[key] !== null) return item[key];
  }

  return "";
};

const getResultList = (response: unknown): RawRecord[] => {
  if (Array.isArray(response)) return response as RawRecord[];

  if (response && typeof response === "object") {
    const record = response as RawRecord;

    if (Array.isArray(record.result)) return record.result as RawRecord[];
    if (Array.isArray(record.data)) return record.data as RawRecord[];
  }

  return [];
};

const normalizePolicy = (item: RawRecord, index: number): PolicyItem => {
  const policyNum = toText(pick(item, ["policyNum", "policyID", "id"]));

  return {
    id: policyNum || String(index + 1),
    titleTH: toText(pick(item, ["nameTH", "titleTH"])),
    titleEN: toText(pick(item, ["nameEN", "titleEN"])),
  };
};

export async function GET() {
  try {
    const response = await apiFetch<unknown>("/api/policyapi");
    const policies = getResultList(response)
      .map(normalizePolicy)
      .filter((item) => item.id && (item.titleTH || item.titleEN));

    return NextResponse.json({
      status: "success",
      total: policies.length,
      data: policies,
    });
  } catch (error) {
    console.error("Policies API error:", error);
    return NextResponse.json({ status: "error", total: 0, data: [] }, { status: 502 });
  }
}
