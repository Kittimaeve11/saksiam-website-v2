import { NextResponse } from "next/server";
import { apiFetch } from "../../client";

type RawRecord = Record<string, unknown>;

type PolicyDetail = {
  id: string;
  titleTH: string;
  titleEN: string;
  detailTH: string;
  detailEN: string;
};

const toText = (value: unknown): string =>
  typeof value === "string" ? value : "";

const pick = (item: RawRecord, keys: string[]): unknown => {
  for (const key of keys) {
    if (item[key] !== undefined && item[key] !== null) return item[key];
  }

  return "";
};

const getRecord = (response: unknown): RawRecord | null => {
  if (Array.isArray(response)) return (response[0] as RawRecord) || null;

  if (response && typeof response === "object") {
    const record = response as RawRecord;

    if (record.data && typeof record.data === "object" && !Array.isArray(record.data)) {
      return record.data as RawRecord;
    }

    if (Array.isArray(record.data)) return (record.data[0] as RawRecord) || null;
    if (Array.isArray(record.result)) return (record.result[0] as RawRecord) || null;
  }

  return null;
};

const cleanHtml = (value: unknown): string => {
  const text = toText(value).trim();

  if (!text) return "";

  try {
    const parsed = JSON.parse(text);
    return typeof parsed === "string" ? parsed : text;
  } catch {
    return text.replace(/^"|"$/g, "");
  }
};

const normalizePolicy = (item: RawRecord): PolicyDetail => ({
  id: toText(pick(item, ["policyNum", "policyID", "id"])),
  titleTH: toText(pick(item, ["nameTH", "titleTH"])),
  titleEN: toText(pick(item, ["nameEN", "titleEN"])),
  detailTH: cleanHtml(pick(item, ["detailTH", "descriptionTH"])),
  detailEN: cleanHtml(pick(item, ["detailEN", "descriptionEN"])),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ segment: string }> }
) {
  try {
    const { segment } = await params;
    const response = await apiFetch<unknown>(
      `/api/policyapi/${encodeURIComponent(segment)}`
    );
    const record = getRecord(response);

    if (!record) {
      return NextResponse.json({ policy: null }, { status: 404 });
    }

    return NextResponse.json({ policy: normalizePolicy(record) });
  } catch (error) {
    console.error("Policy detail API error:", error);
    return NextResponse.json({ policy: null }, { status: 502 });
  }
}
