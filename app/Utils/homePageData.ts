import { apiFetch } from "../api/client";
import { getEditorialViewMap } from "../api/editoria-views/store";
import type { HomeBannerItem } from "../views/home/HomeBanner/HomeBanner";
import type { HomeNewsItem } from "../views/home/News/NewsSection";
import type { TestimonialItem } from "../views/home/TestimonialSection/TestimonialSection";
import type {
  BannerApiItem,
  NewsApiItem,
  TestimonialApiData,
  TestimonialApiItem,
} from "./type";
import { fetchGalleryMap, getImagesForEditorial } from "./editorialGallery";

const PHOTO_BASE_URL = process.env.NEXT_PUBLIC_API_PHOTO || "";

const toText = (value: string | number | null | undefined): string =>
  typeof value === "string" ? value.trim() : "";

const toNumber = (value: number | string | null | undefined): number => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const toImageUrl = (src: string): string => {
  if (!src) return "";
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) {
    return src;
  }

  return `${PHOTO_BASE_URL}${src}`;
};

const stripHtml = (value: string): string =>
  value
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

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
  index: number,
  viewMap: Record<string, number>,
  galleryMap: Map<string, string[]>
): HomeNewsItem => {
  const id =
    toText(
      item.id ||
        item.editoriaID ||
        item.editoriaId ||
        item.editoriaNum ||
        item.int_saksiam_editoria_id
    ) || String(index + 1);

  return {
    id,
    categoryTH: toText(item.typeNameTH || item.categoryTH),
    categoryEN: toText(item.typeNameEN || item.categoryEN),
    titleTH: toText(item.titleTH || item.int_saksiam_editoria_titieTH),
    titleEN: toText(item.titleEN || item.int_saksiam_editoria_titieEN),
    detailTH: stripHtml(
      toText(item.descriptionTH || item.int_saksiam_editoria_descriptionTH)
    ),
    detailEN: stripHtml(
      toText(item.descriptionEN || item.int_saksiam_editoria_descriptionEN)
    ),
    createdAt: toText(
      item.approvedate || item.createAt || item.int_saksiam_editoria_approvedate
    ),
    images: getImagesForEditorial(item as Record<string, unknown>, galleryMap),
    views: viewMap[id] || 0,
  };
};

const normalizeBanner = (item: BannerApiItem, index: number): HomeBannerItem => ({
  id: toNumber(item.id || item.int_saksiam_banner_ID) || index + 1,
  pc: toImageUrl(toText(item.picturePC || item.int_saksiam_banner_picturePC)),
  mobile: toImageUrl(
    toText(
      item.pictureMoblie ||
        item.pictureMobile ||
        item.int_saksiam_banner_pictureMoblie
    )
  ),
  link: toText(item.link || item.int_saksiam_banner_link),
});

const normalizeTestimonial = (
  item: TestimonialApiItem,
  index: number
): TestimonialItem => {
  const link = toText(
    item.videoUrl ||
      item.link ||
      item.linkVedio ||
      item.vedio_link ||
      item.int_saksiam_vedio_link
  );
  const videoId = extractYoutubeId(
    toText(
      item.videoId ||
        item.youtubeID ||
        item.vedio_youtubeID ||
        item.int_saksiam_vedio_youtubeID
    ) || link
  );

  return {
    id:
      toNumber(item.id || item.vedioID || item.videoID || item.int_saksiam_vedio_id) ||
      index + 1,
    title: toText(
      item.title || item.nameTH || item.vedio_nameTH || item.int_saksiam_vedio_nameTH
    ),
    videoUrl: toEmbedUrl(videoId, link),
    videoId,
  };
};

export async function getHomeData() {
  const [bannerResponse, newsResponse, testimonialResponse, viewMapResponse, galleryMapResponse] = await Promise.allSettled([
    apiFetch<BannerApiItem[]>("/api/bannerhomeapi"),
    apiFetch<NewsApiItem[]>("/api/editoriaapimain"),
    apiFetch<TestimonialApiData>("/api/Reviewapi"),
    getEditorialViewMap(),
    fetchGalleryMap(),
  ]);
  const viewMap =
    viewMapResponse.status === "fulfilled" ? viewMapResponse.value : {};
  const galleryMap =
    galleryMapResponse.status === "fulfilled" ? galleryMapResponse.value : new Map<string, string[]>();

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
            .map((item, index) => normalizeNews(item, index, viewMap, galleryMap))
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
