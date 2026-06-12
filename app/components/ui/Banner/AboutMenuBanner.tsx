"use client";

import { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";

import { apiFetch, getCachedApiResponse } from "@/app/api/client";
import type { AboutMenuBannerItem } from "@/app/Utils/type";
import AboutMenuBannerSkeleton from "./AboutMenuBannerSkeleton";
import { buildImageUrl } from "@/app/Utils/imageUrl";

type Props = {
  num?: number;
  data?: AboutMenuBannerItem | null;
  loading?: boolean;
};

const getImageUrl = (path: string) => {
  return buildImageUrl(path);
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
  const [fadeImage, setFadeImage] = useState(false);
  const fetchedEndpointRef = useRef("");
  const shouldFadeContentRef = useRef((Boolean(num) && !cached) || loading);
  const resolvedData = num ? bannerData : data || null;
  const resolvedLoading = num ? fetchLoading : loading;
  const pcImage = getImageUrl(resolvedData?.picturePC || "");
  const mobileImage = getImageUrl(resolvedData?.pictureMoblie || resolvedData?.picturePC || "");
  const imageKey = `${pcImage}|${mobileImage}`;
  const imageReady = readyImageKey === imageKey;

  useEffect(() => {
    let fetchActive = true;
    let imageActive = true;
    let image: HTMLImageElement | null = null;
    let imageFallbackTimer: ReturnType<typeof setTimeout> | null = null;
    let fetchFallbackTimer: ReturnType<typeof setTimeout> | null = null;

    const fetchBanner = async () => {
      if (!num) return;
      const endpoint = `/api/bannerapi/${num}`;
      const cached = getCachedApiResponse<AboutMenuBannerItem | null>(endpoint);
      if (cached) {
        setFetchLoading(false);
        setBannerData(cached.data || null);
        return;
      }

      try {
        setFetchLoading(true);
        fetchFallbackTimer = setTimeout(() => {
          if (fetchActive) setFetchLoading(false);
        }, 5000);

        const res = await apiFetch<AboutMenuBannerItem | null>(endpoint);

        if (!res.status) throw new Error(res.message || "Banner API error");
        if (fetchActive) {
          if (fetchFallbackTimer) clearTimeout(fetchFallbackTimer);
          setFetchLoading(false);
          setBannerData(res.data || null);
        }
      } catch (error) {
        console.error("About menu banner fetch error:", error);
        if (fetchActive) {
          if (fetchFallbackTimer) clearTimeout(fetchFallbackTimer);
          setFetchLoading(false);
          setBannerData(null);
        }
      }
    };

    if (
      endpoint &&
      (fetchedEndpointRef.current !== endpoint || (fetchLoading && !bannerData))
    ) {
      fetchedEndpointRef.current = endpoint;
      fetchBanner();
    }

    const imageSrc =
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 899px)").matches
        ? mobileImage || pcImage
        : pcImage || mobileImage;

    if (imageSrc && imageKey.trim()) {
      image = new window.Image();
      image.src = imageSrc;

      if (image.complete) {
        setReadyImageKey(imageKey);
        setFadeImage(false);
      } else {
        setReadyImageKey("");
        setFadeImage(true);

        image.onload = () => {
          if (imageActive) setReadyImageKey(imageKey);
        };
        image.onerror = () => {
          if (imageActive) {
            setReadyImageKey(imageKey);
            setFadeImage(false);
          }
        };
        imageFallbackTimer = setTimeout(() => {
          if (imageActive) {
            setReadyImageKey(imageKey);
            setFadeImage(false);
          }
        }, 450);
      }
    }

    return () => {
      fetchActive = false;
      imageActive = false;
      if (imageFallbackTimer) clearTimeout(imageFallbackTimer);
      if (fetchFallbackTimer) clearTimeout(fetchFallbackTimer);
      if (fetchLoading && !bannerData && fetchedEndpointRef.current === endpoint) {
        fetchedEndpointRef.current = "";
      }
      if (image) {
        image.onload = null;
        image.onerror = null;
      }
    };
  }, [bannerData, endpoint, fetchLoading, imageKey, mobileImage, num, pcImage]);

  if (resolvedLoading) return <AboutMenuBannerSkeleton />;
  if (!resolvedData || (!pcImage && !mobileImage)) return null;

  return (
    <Box
      sx={{
        width: "100%",
        aspectRatio: {
          xs: "678 / 1032",
          md: "16 / 9",
        },
        borderRadius: { xs: "18px", md: "28px" },
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
          height: "100%",
          lineHeight: 0,
          opacity: imageReady ? 1 : 0.01,
          transition: fadeImage ? "opacity 0.24s ease" : "none",
        }}
      >
        <Box component="source" media="(max-width: 899px)" srcSet={mobileImage || pcImage} />
        <Box
          component="img"
          src={pcImage || mobileImage}
          alt={resolvedData.name || ""}
          draggable={false}
          onLoad={() => setReadyImageKey(imageKey)}
          onError={() => {
            setReadyImageKey(imageKey);
            setFadeImage(false);
          }}
          onDragStart={(event) => event.preventDefault()}
          sx={{
            width: "100%",
            height: "100%",
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
