"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Skeleton } from "@mui/material";

import { apiFetch, getCachedApiResponse } from "@/app/api/client";
import {
  EACH_BANNER_MOBILE_MEDIA,
  getCurrentEachBannerImageSrc,
  getEachBannerEndpoint,
  getEachBannerImages,
  isEachBannerActive,
  normalizeEachBanner,
  type EachBannerItem,
} from "@/app/Utils/eachBanner";
import EachBannerSkeleton from "./EachBannerskeleton";

type EachBannerProps = {
  num: number;
  mobileMedia?: string;
};

export default function EachBanner({
  num,
  mobileMedia = EACH_BANNER_MOBILE_MEDIA,
}: EachBannerProps) {
  const endpoint = useMemo(() => getEachBannerEndpoint(num), [num]);
  const cachedResponse = getCachedApiResponse<EachBannerItem | null>(endpoint);

  const [data, setData] = useState<EachBannerItem | null>(() =>
    normalizeEachBanner(cachedResponse?.data)
  );
  const [loading, setLoading] = useState(!cachedResponse);
  const [readyImageKey, setReadyImageKey] = useState("");
  const [fadeImage, setFadeImage] = useState(false);
  const fetchedEndpointRef = useRef("");

  const images = useMemo(() => getEachBannerImages(data), [data]);
  const imageReady = Boolean(images.key) && readyImageKey === images.key;

  useEffect(() => {
    let active = true;
    let fetchFallbackTimer: ReturnType<typeof setTimeout> | null = null;
    let image: HTMLImageElement | null = null;

    async function fetchBanner() {
      const cached = getCachedApiResponse<EachBannerItem | null>(endpoint);

      if (cached) {
        setLoading(false);
        setData(normalizeEachBanner(cached.data));
        return;
      }

      try {
        setLoading(true);
        fetchFallbackTimer = setTimeout(() => {
          if (active) setLoading(false);
        }, 5000);

        const response = await apiFetch<EachBannerItem | null>(endpoint);

        if (!response.status) {
          throw new Error(response.message || "Banner API error");
        }

        if (!active) return;

        if (fetchFallbackTimer) clearTimeout(fetchFallbackTimer);
        setLoading(false);
        setData(normalizeEachBanner(response.data));
      } catch (error) {
        console.error("Each banner fetch error:", error);

        if (!active) return;

        if (fetchFallbackTimer) clearTimeout(fetchFallbackTimer);
        setLoading(false);
        setData(null);
      }
    }

    if (fetchedEndpointRef.current !== endpoint || (loading && !data)) {
      fetchedEndpointRef.current = endpoint;
      fetchBanner();
    }

    const imageSrc = getCurrentEachBannerImageSrc(images, mobileMedia);

    if (!imageSrc || !images.key.trim()) {
      setReadyImageKey("");
      setFadeImage(false);
    } else {
      image = new window.Image();
      image.decoding = "async";
      image.src = imageSrc;

      if (image.complete) {
        setReadyImageKey(images.key);
        setFadeImage(false);
      } else {
        setReadyImageKey("");
        setFadeImage(true);

        image.onload = () => {
          if (active) setReadyImageKey(images.key);
        };
        image.onerror = () => {
          if (!active) return;

          setReadyImageKey(images.key);
          setFadeImage(false);
        };
      }
    }

    return () => {
      active = false;
      if (fetchFallbackTimer) clearTimeout(fetchFallbackTimer);

      if (loading && !data && fetchedEndpointRef.current === endpoint) {
        fetchedEndpointRef.current = "";
      }

      if (image) {
        image.onload = null;
        image.onerror = null;
      }
    };
  }, [data, endpoint, images, loading, mobileMedia]);

  if (loading) return <EachBannerSkeleton />;
  if (!data || !isEachBannerActive(data) || (!images.pc && !images.mobile)) return null;

  const picture = (
    <Box
      component="picture"
      sx={{
        display: "block",
        width: "100%",
        height: "100%",
        lineHeight: 0,
      }}
    >
      <Box component="source" media={mobileMedia} srcSet={images.mobile || images.pc} />
      <Box
        component="img"
        src={images.pc || images.mobile}
        alt={data.name || ""}
        draggable={false}
        onLoad={() => setReadyImageKey(images.key)}
        onError={() => {
          setReadyImageKey(images.key);
          setFadeImage(false);
        }}
        onDragStart={(event) => event.preventDefault()}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: {
            xs: "contain",
            md: "cover",
          },
          backgroundColor: "#fff",
          display: "block",
          opacity: imageReady ? 1 : 0,
          transition: fadeImage ? "opacity 0.24s ease" : "none",
          userSelect: "none",
          WebkitUserDrag: "none",
        }}
      />
    </Box>
  );

  return (
    <Box
      sx={{
        width: "100%",
        position: "relative",
        background: "#fff",
        overflow: "hidden",
        lineHeight: 0,
      }}
    >
      <Box
        sx={{
          width: "100%",
          aspectRatio: {
            xs: "678 / 1032",
            md: "3840 / 1191",
          },
          position: "relative",
          overflow: "hidden",
        }}
      >
        {!imageReady && (
          <Skeleton
            variant="rectangular"
            animation="wave"
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 1,
              width: "100%",
              height: "100%",
              borderRadius: 0,
              transform: "none",
              bgcolor: "var(--gray-50)",
            }}
          />
        )}

        {data.link ? (
          <Box
            component="a"
            href={data.link}
            aria-label={data.name || undefined}
            sx={{
              display: "block",
              width: "100%",
              height: "100%",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            {picture}
          </Box>
        ) : (
          picture
        )}
      </Box>
    </Box>
  );
}
