"use client";

/* ====================================================== */
import { apiFetch, getCachedApiResponse } from "@/app/api/client";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import EachBannerSkeleton from "./EachBannerskeleton";
import { buildImageUrl } from "@/app/Utils/imageUrl";

/* ====================================================== */
interface EachBanneritem {
  id: number;
  name: string;
  picturePC: string;
  pictureMoblie: string;
  type: string;
  link: string;
  active: string;
  createAt: string;
  updateAt: string;
}

/* ====================================================== */
const EachBanner = ({ num }: { num: number }) => {
  const endpoint = `/api/bannerapi/${num}`;
  const cached = getCachedApiResponse<EachBanneritem | null>(endpoint);
  const [data, setData] = useState<EachBanneritem | null>(cached?.data || null);
  const [loading, setLoading] = useState(!cached);
  const [imageReady, setImageReady] = useState(false);
  const [fadeImage, setFadeImage] = useState(false);
  const fetchedEndpointRef = useRef("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const pcImage = buildImageUrl(data?.picturePC || "");
  const mobileImage = buildImageUrl(data?.pictureMoblie || data?.picturePC || "");
  const imageSrc = data
    ? isMobile
      ? mobileImage || pcImage
      : pcImage || mobileImage
    : "";

  /* ======================================================
      FETCH
  ====================================================== */
  useEffect(() => {
    let fetchActive = true;
    let imageActive = true;
    let image: HTMLImageElement | null = null;
    let imageFallbackTimer: ReturnType<typeof setTimeout> | null = null;
    let fetchFallbackTimer: ReturnType<typeof setTimeout> | null = null;

    const fetchData = async () => {
      const cached = getCachedApiResponse<EachBanneritem | null>(endpoint);
      if (cached) {
        setLoading(false);
        setData(cached.data || null);
        return;
      }

      try {
        setLoading(true);
        fetchFallbackTimer = setTimeout(() => {
          if (fetchActive) setLoading(false);
        }, 5000);

        const res = await apiFetch<EachBanneritem | null>(endpoint);

        if (!res?.status) {
          throw new Error(res?.message || "API error");
        }

        if (fetchActive) {
          if (fetchFallbackTimer) clearTimeout(fetchFallbackTimer);
          setLoading(false);
          setData(res.data || null);
        }
      } catch (err) {
        console.error("fetch error:", err);
        if (fetchActive) {
          if (fetchFallbackTimer) clearTimeout(fetchFallbackTimer);
          setLoading(false);
          setData(null);
        }
      }
    };

    if (fetchedEndpointRef.current !== endpoint || (loading && !data)) {
      fetchedEndpointRef.current = endpoint;
      fetchData();
    }

    if (data && !imageSrc) {
      setImageReady(true);
      setFadeImage(false);
    } else if (imageSrc) {
      image = new window.Image();
      image.src = imageSrc;

      if (image.complete) {
        setImageReady(true);
        setFadeImage(false);
      } else {
        setImageReady(false);
        setFadeImage(true);

        image.onload = () => {
          if (imageActive) setImageReady(true);
        };
        image.onerror = () => {
          if (imageActive) {
            setImageReady(true);
            setFadeImage(false);
          }
        };
        imageFallbackTimer = setTimeout(() => {
          if (imageActive) {
            setImageReady(true);
            setFadeImage(false);
          }
        }, 1200);
      }
    }

    return () => {
      fetchActive = false;
      imageActive = false;
      if (imageFallbackTimer) clearTimeout(imageFallbackTimer);
      if (fetchFallbackTimer) clearTimeout(fetchFallbackTimer);
      if (loading && !data && fetchedEndpointRef.current === endpoint) {
        fetchedEndpointRef.current = "";
      }
      if (image) {
        image.onload = null;
        image.onerror = null;
      }
    };
  }, [data, endpoint, imageSrc, loading]);

  /* ====================================================== */
  if (loading) {
    return <EachBannerSkeleton />;
  }

  if (!data) return null;

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
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 1,
            }}
          >
            <EachBannerSkeleton />
          </Box>
        )}

        <Box
          component="img"
          className={fadeImage && imageReady ? "fade-in" : undefined}
          src={imageSrc}
          alt={data.name}
          draggable={false}
          onLoad={() => setImageReady(true)}
          onError={() => {
            setImageReady(true);
            setFadeImage(false);
          }}
          onDragStart={(e) => e.preventDefault()}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: {
              xs: "contain",
              md: "cover",
            },
            backgroundColor: "#fff",
            display: "block",
            opacity: imageReady ? undefined : 0,
            userSelect: "none",
            WebkitUserDrag: "none",
          }}
        />
      </Box>
    </Box>
  );
};

export default EachBanner;
