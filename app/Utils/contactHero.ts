import { apiFetch } from "@/app/api/client";
import { buildApiImageUrl } from "@/app/Utils/imageUrl";

type ContactHeroApiData = {
  images?: {
    cover?: string;
  };
};

export const CONTACT_HERO_FALLBACK_COVER = "/company/SAKsiam.jpg";

let cachedCoverImage: string | null = null;
let pendingCoverImage: Promise<string> | null = null;

export const getCachedContactCoverImage = () =>
  cachedCoverImage || CONTACT_HERO_FALLBACK_COVER;

export const getContactCoverImage = async () => {
  if (cachedCoverImage) return cachedCoverImage;
  if (pendingCoverImage) return pendingCoverImage;

  pendingCoverImage = apiFetch<ContactHeroApiData>("/api/contactapi")
    .then((response) => {
      if (response.status === false) {
        throw new Error(response.message || "Contact cover API error");
      }

      const coverImage = buildApiImageUrl(
        (response.data || response.result || {}).images?.cover
      );

      cachedCoverImage = coverImage || CONTACT_HERO_FALLBACK_COVER;
      return cachedCoverImage;
    })
    .catch(() => CONTACT_HERO_FALLBACK_COVER)
    .finally(() => {
      pendingCoverImage = null;
    });

  return pendingCoverImage;
};
