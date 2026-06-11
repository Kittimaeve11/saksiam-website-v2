"use client";

/* ====================================================== */
import { apiFetch, getCachedApiResponse } from "@/app/api/client";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import EachBannerSkeleton from "./EachBannerskeleton";

/* ====================================================== */
const BASE_URL = process.env.NEXT_PUBLIC_API_PHOTO!;

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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  /* ======================================================
      FETCH
  ====================================================== */
  useEffect(() => {
    let active = true;
    const cached = getCachedApiResponse<EachBanneritem | null>(endpoint);
    if (cached) {
      setData(cached.data || null);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await apiFetch<EachBanneritem | null>(endpoint);

        if (!res?.status) {
          throw new Error(res?.message || "API error");
        }

        if (active) setData(res.data || null);
      } catch (err) {
        console.error("fetch error:", err);
        if (active) setData(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, [endpoint]);

  const imageSrc = data
    ? isMobile
      ? `${BASE_URL}/${data.pictureMoblie}`
      : `${BASE_URL}/${data.picturePC}`
    : "";

  useEffect(() => {
    setImageReady(false);
  }, [imageSrc]);

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
          className={imageReady ? "fade-in" : undefined}
          src={imageSrc}
          alt={data.name}
          draggable={false}
          onLoad={() => setImageReady(true)}
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
