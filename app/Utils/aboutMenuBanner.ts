import type { AboutMenuBannerItem } from "./type";
import { buildImageUrl, toText } from "./imageUrl";

export const ABOUT_MENU_BANNER_MOBILE_MEDIA = "(max-width: 899px)";

export type AboutMenuBannerImages = {
  pc: string;
  mobile: string;
  key: string;
};

export function getAboutMenuBannerEndpoint(num?: number): string {
  return num ? `/api/bannerapi/${num}` : "";
}

export function normalizeAboutMenuBanner(
  item: AboutMenuBannerItem | null | undefined
): AboutMenuBannerItem | null {
  if (!item) return null;

  return {
    ...item,
    id: toText(item.id),
    name: toText(item.name),
    picturePC: toText(item.picturePC),
    pictureMoblie: toText(item.pictureMoblie),
    type: toText(item.type),
    link: toText(item.link),
    active: toText(item.active),
    createAt: toText(item.createAt),
    savename: toText(item.savename),
    updateAt: item.updateAt === null ? null : toText(item.updateAt),
  };
}

export function getAboutMenuBannerImages(
  item: AboutMenuBannerItem | null | undefined
): AboutMenuBannerImages {
  const pc = buildImageUrl(item?.picturePC || "");
  const mobile = buildImageUrl(item?.pictureMoblie || item?.picturePC || "");

  return {
    pc,
    mobile,
    key: `${pc}|${mobile}`,
  };
}

export function getCurrentBannerImageSrc(
  images: AboutMenuBannerImages,
  mobileMedia = ABOUT_MENU_BANNER_MOBILE_MEDIA
): string {
  if (typeof window === "undefined") return images.pc || images.mobile;

  return window.matchMedia(mobileMedia).matches
    ? images.mobile || images.pc
    : images.pc || images.mobile;
}
