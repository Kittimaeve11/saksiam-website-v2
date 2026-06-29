import { apiFetch } from "../api/client";
import { getEditorialViewMap } from "../api/editoria-views/store";
import type { HomeBannerItem } from "../views/home/HomeBanner/HomeBanner";
import type {
  BannerApiItem,
  HomeNewsItem,
  NewsApiItem,
  TestimonialApiData,
  TestimonialApiItem,
  TestimonialItem,
} from "./type";
import { buildImageUrl, toText } from "./imageUrl";
import { normalizeEditorial } from "./editorialData";

const toNumber = (value: number | string | null | undefined): number => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const extractYoutubeId = (value: string): string => {
  if (!value) return "";
  if (/^[A-Za-z0-9_-]{6,20}$/.test(value)) return value;

  const match = value.match(
    /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/)([A-Za-z0-9_-]{6,20})/
  );

  return match?.[1] || "";
};

const toEmbedUrl = (videoId: string, link: string): string => {
  const id = videoId || extractYoutubeId(link);
  return id ? `https://www.youtube.com/embed/${id}` : link;
};

const normalizeNews = (
  item: NewsApiItem,
  viewMap: Record<string, number>
): HomeNewsItem => {
  const editorial = normalizeEditorial(item);

  return {
    id: editorial.id,
    categoryTH: editorial.categoryTH,
    categoryEN: editorial.categoryEN,
    titleTH: editorial.titleTH,
    titleEN: editorial.titleEN,
    detailTH: editorial.detailTH,
    detailEN: editorial.detailEN,
    createdAt: editorial.createdAt,
    images: editorial.images,
    views: viewMap[editorial.id] || 0,
  };
};

const normalizeBanner = (item: BannerApiItem, index: number): HomeBannerItem => ({
  id: toNumber(item.id) || index + 1,
  pc: buildImageUrl(toText(item.picturePC)),
  mobile: buildImageUrl(toText(item.pictureMoblie)),
  link: toText(item.link),
});

const normalizeTestimonial = (
  item: TestimonialApiItem,
  index: number
): TestimonialItem => {
  const link = toText(item.link);
  const videoId = extractYoutubeId(toText(item.youtubeID) || link);

  return {
    id: toNumber(item.id) || index + 1,
    title: toText(item.title),
    videoUrl: toEmbedUrl(videoId, link),
    videoId,
  };
};

export async function getHomeData() {
  const [bannerResponse, newsResponse, testimonialResponse, viewMapResponse] = await Promise.allSettled([
    apiFetch<BannerApiItem[]>("/api/bannerhomeapi"),
    apiFetch<NewsApiItem[]>("/api/editoriaapimain"),
    apiFetch<TestimonialApiData>("/api/Reviewapi"),
    getEditorialViewMap(),
  ]);
  const viewMap =
    viewMapResponse.status === "fulfilled" ? viewMapResponse.value : {};

  return {
    banners:
      bannerResponse.status === "fulfilled"
        ? (bannerResponse.value.data || [])
            .map(normalizeBanner)
            .filter((item) => item.pc || item.mobile)
        : [],
    news:
      newsResponse.status === "fulfilled"
        ? (newsResponse.value.data || [])
            .map((item) => normalizeNews(item, viewMap))
            .filter((item) => (item.titleTH || item.titleEN) && item.images.length)
        : [],
    testimonials:
      testimonialResponse.status === "fulfilled"
        ? (testimonialResponse.value.data?.data || [])
            .map(normalizeTestimonial)
            .filter((item) => item.videoUrl && item.videoId)
        : [],
  };
}
