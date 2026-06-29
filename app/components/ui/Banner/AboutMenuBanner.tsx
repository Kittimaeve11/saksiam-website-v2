"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Box } from "@mui/material";

import { apiFetch, getCachedApiResponse } from "@/app/api/client";
import {
  ABOUT_MENU_BANNER_MOBILE_MEDIA,
  getAboutMenuBannerEndpoint,
  getAboutMenuBannerImages,
  getCurrentBannerImageSrc,
  normalizeAboutMenuBanner,
} from "@/app/Utils/aboutMenuBanner";
import type { AboutMenuBannerItem } from "@/app/Utils/type";
import AboutMenuBannerSkeleton from "./AboutMenuBannerSkeleton";

type Props = {
  num?: number;
  data?: AboutMenuBannerItem | null;
  loading?: boolean;
  objectFit?: "contain" | "cover";
  mobileMedia?: string;
  naturalSize?: boolean;
  aspectRatio?: Record<string, string>;
};

export default function AboutMenuBanner({
  num,
  data,
  loading = false,
  objectFit = "contain",
  mobileMedia = ABOUT_MENU_BANNER_MOBILE_MEDIA,
  naturalSize = false,
  aspectRatio,
}: Props) {
  const endpoint = useMemo(() => getAboutMenuBannerEndpoint(num), [num]);
  const cachedResponse = endpoint
    ? getCachedApiResponse<AboutMenuBannerItem | null>(endpoint)
    : null;

  const [bannerData, setBannerData] = useState<AboutMenuBannerItem | null>(() =>
    normalizeAboutMenuBanner(cachedResponse?.data)
  );
  const [fetchLoading, setFetchLoading] = useState(Boolean(num) && !cachedResponse);
  const [readyImageKey, setReadyImageKey] = useState("");
  const [fadeImage, setFadeImage] = useState(false);
  const fetchedEndpointRef = useRef("");
  const shouldFadeContentRef = useRef((Boolean(num) && !cachedResponse) || loading);

  const resolvedData = useMemo(
    () => (num ? bannerData : normalizeAboutMenuBanner(data)),
    [bannerData, data, num]
  );
  const resolvedLoading = num ? fetchLoading : loading;
  const images = useMemo(() => getAboutMenuBannerImages(resolvedData), [resolvedData]);
  const imageReady = Boolean(images.key) && readyImageKey === images.key;

  useEffect(() => {
    if (!endpoint) return;

    let active = true;
    let fallbackTimer: ReturnType<typeof setTimeout> | null = null;

    async function fetchBanner() {
      const cached = getCachedApiResponse<AboutMenuBannerItem | null>(endpoint);

      if (cached) {
        setFetchLoading(false);
        setBannerData(normalizeAboutMenuBanner(cached.data));
        return;
      }

      try {
        setFetchLoading(true);
        fallbackTimer = setTimeout(() => {
          if (active) setFetchLoading(false);
        }, 5000);

        const response = await apiFetch<AboutMenuBannerItem | null>(endpoint);

        if (!response.status) {
          throw new Error(response.message || "Banner API error");
        }

        if (!active) return;

        if (fallbackTimer) clearTimeout(fallbackTimer);
        setFetchLoading(false);
        setBannerData(normalizeAboutMenuBanner(response.data));
      } catch (error) {
        console.error("About menu banner fetch error:", error);

        if (!active) return;

        if (fallbackTimer) clearTimeout(fallbackTimer);
        setFetchLoading(false);
        setBannerData(null);
      }
    }

    if (fetchedEndpointRef.current !== endpoint || (fetchLoading && !bannerData)) {
      fetchedEndpointRef.current = endpoint;
      fetchBanner();
    }

    return () => {
      active = false;
      if (fallbackTimer) clearTimeout(fallbackTimer);

      if (fetchLoading && !bannerData && fetchedEndpointRef.current === endpoint) {
        fetchedEndpointRef.current = "";
      }
    };
  }, [bannerData, endpoint, fetchLoading]);

  useEffect(() => {
    const imageSrc = getCurrentBannerImageSrc(images, mobileMedia);

    if (!imageSrc || !images.key.trim()) {
      setReadyImageKey("");
      setFadeImage(false);
      return;
    }

    let active = true;
    const image = new window.Image();
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

    return () => {
      active = false;
      image.onload = null;
      image.onerror = null;
    };
  }, [images, mobileMedia]);

  if (resolvedLoading) return <AboutMenuBannerSkeleton />;
  if (!resolvedData || (!images.pc && !images.mobile)) return null;

  return (
    <Box
      sx={{
        width: "100%",
        ...(naturalSize
          ? {}
          : {
              aspectRatio: aspectRatio || {
                xs: "678 / 1032",
                md: "16 / 9",
              },
            }),
        borderRadius: naturalSize ? 0 : { xs: "18px", md: "28px" },
        overflow: "hidden",
        lineHeight: 0,
        position: "relative",
      }}
    >
      {!imageReady && (
        <Box
          aria-hidden="true"
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background:
              "linear-gradient(90deg, var(--gray-50) 0%, var(--gray-100) 45%, var(--gray-50) 100%)",
            backgroundSize: "220% 100%",
            animation: "aboutBannerPulse 1.4s ease-in-out infinite",
            "@keyframes aboutBannerPulse": {
              "0%": { backgroundPosition: "100% 0" },
              "100%": { backgroundPosition: "-100% 0" },
            },
          }}
        />
      )}

      <Box
        component="picture"
        className={
          imageReady && (fadeImage || shouldFadeContentRef.current)
            ? "api-content-fade-in"
            : undefined
        }
        sx={{
          display: "block",
          width: "100%",
          height: naturalSize ? "auto" : "100%",
          lineHeight: 0,
          opacity: imageReady ? 1 : 0,
          transition: fadeImage ? "opacity 0.24s ease" : "none",
        }}
      >
        <Box component="source" media={mobileMedia} srcSet={images.mobile || images.pc} />
        <Box
          component="img"
          src={images.pc || images.mobile}
          alt={resolvedData.name || ""}
          draggable={false}
          onLoad={() => setReadyImageKey(images.key)}
          onError={() => {
            setReadyImageKey(images.key);
            setFadeImage(false);
          }}
          onDragStart={(event) => event.preventDefault()}
          sx={{
            width: "100%",
            height: naturalSize ? "auto" : "100%",
            display: "block",
            objectFit: naturalSize ? "initial" : objectFit,
            userSelect: "none",
            WebkitUserDrag: "none",
          }}
        />
      </Box>
    </Box>
  );
}
