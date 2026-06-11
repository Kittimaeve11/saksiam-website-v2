import { NextResponse } from "next/server";
import { apiFetch } from "../client";

type RawRecord = Record<string, unknown>;

type Testimonial = {
  id: number;
  title: string;
  videoUrl: string;
  videoId: string;
  publishedAt: string;
};

const toText = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";

const toNumber = (value: unknown): number => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
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
    const record = response as RawRecord;

    if (Array.isArray(record.result)) return record.result as RawRecord[];
    if (Array.isArray(record.data)) return record.data as RawRecord[];

    if (record.data && typeof record.data === "object") {
      const dataRecord = record.data as RawRecord;

      if (Array.isArray(dataRecord.result)) return dataRecord.result as RawRecord[];
      if (Array.isArray(dataRecord.data)) return dataRecord.data as RawRecord[];
    }
  }

  return [];
};

const extractYoutubeId = (value: string): string => {
  if (!value) return "";

  const directId = /^[A-Za-z0-9_-]{6,20}$/.test(value);
  if (directId) return value;

  const match = value.match(
    /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/)([A-Za-z0-9_-]{6,20})/
  );

  return match?.[1] || "";
};

const toEmbedUrl = (videoId: string, link: string): string => {
  const id = videoId || extractYoutubeId(link);
  return id ? `https://www.youtube.com/embed/${id}` : link;
};

const normalizeTestimonial = (item: RawRecord, index: number): Testimonial => {
  const link = toText(
    pick(item, [
      "videoUrl",
      "link",
      "linkVedio",
      "vedio_link",
      "int_saksiam_vedio_link",
    ])
  );
  const videoId = extractYoutubeId(
    toText(
      pick(item, [
        "videoId",
        "youtubeID",
        "vedio_youtubeID",
        "int_saksiam_vedio_youtubeID",
      ])
    ) || link
  );

  return {
    id:
      toNumber(
        pick(item, ["id", "vedioID", "videoID", "int_saksiam_vedio_id"])
      ) || index + 1,
    title: toText(
      pick(item, [
        "title",
        "nameTH",
        "vedio_nameTH",
        "int_saksiam_vedio_nameTH",
      ])
    ),
    videoUrl: toEmbedUrl(videoId, link),
    videoId,
    publishedAt: toText(
      pick(item, [
        "publishedAt",
        "creationdate",
        "int_saksiam_vedio_creationdate",
        "createAt",
      ])
    ),
  };
};

export async function GET() {
  try {
    const response = await apiFetch<unknown>("/api/Reviewapi");
    const testimonials = getResultList(response)
      .map(normalizeTestimonial)
      .filter((item) => item.videoUrl && item.videoId);

    return NextResponse.json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    console.error("Testimonial API error:", error);
    return NextResponse.json(
      {
        success: false,
        data: [],
      },
      { status: 502 }
    );
  }
}
