"use client";

import { useEffect, useState } from "react";
import { Box } from "@mui/material";

import { apiFetch, getCachedApiResponse } from "@/app/api/client";
import type { AboutMenuBannerItem } from "@/app/Utils/type";
import AboutMenuBannerSkeleton from "./AboutMenuBannerSkeleton";

const BASE_URL = process.env.NEXT_PUBLIC_API_PHOTO || "";

type Props = {
  num?: number;
  data?: AboutMenuBannerItem | null;
  loading?: boolean;
};

const getImageUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/")) {
    return path;
  }

  return `${BASE_URL}/${path}`;
};

export default function AboutMenuBanner({ num, data, loading = false }: Props) {
  const endpoint = num ? `/api/bannerapi/${num}` : "";
  const cached = endpoint
    ? getCachedApiResponse<AboutMenuBannerItem | null>(endpoint)
    : null;
  const [bannerData, setBannerData] = useState<AboutMenuBannerItem | null>(
    cached?.data || null
  );
  const [fetchLoading, setFetchLoading] = useState(Boolean(num) && !cached);
  const [readyImageKey, setReadyImageKey] = useState("");

  useEffect(() => {
    if (!num) return;
    const endpoint = `/api/bannerapi/${num}`;
    const cached = getCachedApiResponse<AboutMenuBannerItem | null>(endpoint);
    if (cached) {
      setBannerData(cached.data || null);
      setFetchLoading(false);
      return;
    }

    let active = true;

    const fetchBanner = async () => {
      try {
        setFetchLoading(true);
        const res = await apiFetch<AboutMenuBannerItem | null>(endpoint);

        if (!res.status) throw new Error(res.message || "Banner API error");
        if (active) setBannerData(res.data || null);
      } catch (error) {
        console.error("About menu banner fetch error:", error);
        if (active) setBannerData(null);
      } finally {
        if (active) setFetchLoading(false);
      }
    };

    fetchBanner();

    return () => {
      active = false;
    };
  }, [num]);

  const resolvedData = num ? bannerData : data || null;
  const resolvedLoading = num ? fetchLoading : loading;
  const pcImage = getImageUrl(resolvedData?.picturePC || "");
  const mobileImage = getImageUrl(resolvedData?.pictureMoblie || resolvedData?.picturePC || "");
  const imageKey = `${pcImage}|${mobileImage}`;
  const imageReady = readyImageKey === imageKey;

  if (resolvedLoading) return <AboutMenuBannerSkeleton />;
  if (!resolvedData || (!pcImage && !mobileImage)) return null;

  return (
    <Box
      sx={{
        width: "100%",
        overflow: "hidden",
        lineHeight: 0,
      }}
    >
      {!imageReady && <AboutMenuBannerSkeleton />}

      <Box
        component="picture"
        className={imageReady ? "fade-in" : undefined}
        sx={{
          display: imageReady ? "block" : "none",
          width: "100%",
          lineHeight: 0,
        }}
      >
        <Box component="source" media="(max-width: 899px)" srcSet={mobileImage || pcImage} />
        <Box
          component="img"
          src={pcImage || mobileImage}
          alt={resolvedData.name || ""}
          draggable={false}
          onLoad={() => setReadyImageKey(imageKey)}
          onDragStart={(event) => event.preventDefault()}
          sx={{
            width: "100%",
            height: "auto",
            display: "block",
            objectFit: "contain",
            userSelect: "none",
            WebkitUserDrag: "none",
          }}
        />
      </Box>
    </Box>
  );
}
