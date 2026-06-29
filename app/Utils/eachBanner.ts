import { buildImageUrl, toText } from "./imageUrl";

export const EACH_BANNER_MOBILE_MEDIA = "(max-width: 899px)";

export type EachBannerItem = {
  id?: string;
  name?: string;
  picturePC?: string;
  pictureMoblie?: string;
  link?: string;
  active?: string;
};

export type EachBannerImages = {
  pc: string;
  mobile: string;
  key: string;
};

export function getEachBannerEndpoint(num: number): string {
  return `/api/bannerapi/${num}`;
}

export function normalizeEachBanner(
  item: EachBannerItem | null | undefined
): EachBannerItem | null {
  if (!item) return null;

  return {
    id: toText(item.id),
    name: toText(item.name),
    picturePC: toText(item.picturePC),
    pictureMoblie: toText(item.pictureMoblie),
    link: toText(item.link),
    active: toText(item.active),
  };
}

export function getEachBannerImages(
  item: EachBannerItem | null | undefined
): EachBannerImages {
  const pc = buildImageUrl(item?.picturePC || "");
  const mobile = buildImageUrl(item?.pictureMoblie || item?.picturePC || "");

  return {
    pc,
    mobile,
    key: `${pc}|${mobile}`,
  };
}

export function getCurrentEachBannerImageSrc(
  images: EachBannerImages,
  mobileMedia = EACH_BANNER_MOBILE_MEDIA
): string {
  if (typeof window === "undefined") return images.pc || images.mobile;

  return window.matchMedia(mobileMedia).matches
    ? images.mobile || images.pc
    : images.pc || images.mobile;
}

export function isEachBannerActive(item: EachBannerItem | null | undefined): boolean {
  return item?.active !== "0";
}
