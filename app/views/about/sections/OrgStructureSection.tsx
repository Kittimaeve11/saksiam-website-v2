//โครงสร้างองค์กร
"use client";

import { useEffect, useState } from "react";
import { Container } from "@mui/material";

import { apiFetch, getCachedApiResponse } from "@/app/api/client";
import type { AboutMenuBannerItem } from "@/app/Utils/type";
import AboutMenuBanner from "@/app/components/ui/Banner/AboutMenuBanner";

export default function OrgStructureSection() {
  const endpoint = "/api/bannerapi/8";
  const cached = getCachedApiResponse<AboutMenuBannerItem | null>(endpoint);
  const [data, setData] = useState<AboutMenuBannerItem | null>(cached?.data || null);
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    let active = true;
    let loadingFallbackTimer: ReturnType<typeof setTimeout> | null = null;
    const cached = getCachedApiResponse<AboutMenuBannerItem | null>(endpoint);
    if (cached) {
      setData(cached.data || null);
      setLoading(false);
      return;
    }

    const fetchBanner = async () => {
      try {
        setLoading(true);
        loadingFallbackTimer = setTimeout(() => {
          if (active) setLoading(false);
        }, 5000);

        const res = await apiFetch<AboutMenuBannerItem | null>(
          endpoint
        );

        if (!res.status) {
          throw new Error(res.message || "Banner API error");
        }

        if (active) {
          if (loadingFallbackTimer) clearTimeout(loadingFallbackTimer);
          setData(res.data || null);
        }
      } catch (error) {
        console.error("Org structure banner fetch error:", error);

        if (active) {
          if (loadingFallbackTimer) clearTimeout(loadingFallbackTimer);
          setData(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchBanner();

    return () => {
      active = false;
      if (loadingFallbackTimer) clearTimeout(loadingFallbackTimer);
    };
  }, [endpoint]);

  return (
    <Container maxWidth="lg">
      <AboutMenuBanner
        data={data}
        loading={loading}
      />
    </Container>
  );
}
