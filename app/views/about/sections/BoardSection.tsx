"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { useLocale } from "@/app/providers/LocaleContext";
import { apiFetch, getCachedApiResponse } from "@/app/api/client";
import type { DirectorApiItem } from "@/app/Utils/type";
import { buildImageUrl } from "@/app/Utils/imageUrl";

import DirectorCard from "../../../components/cards/DirectorCard/DirectorCard";
import type { Director } from "../../../components/cards/DirectorCard/DirectorCard";

import DirectorCardSkeleton from "../../../components/cards/DirectorCard/DirectorCardSkeleton";

const toText = (value: string | number | null | undefined): string => {
  if (typeof value === "number") return String(value);
  return typeof value === "string" ? value.trim() : "";
};

const toImageUrl = (src: string): string => {
  return buildImageUrl(src);
};

const normalizeDirector = (item: DirectorApiItem): Director => ({
  id: toText(item.id),
  nameTH: toText(item.nameTH),
  nameEN: toText(item.nameEN),
  positionTH: toText(item.positionTH),
  positionEN: toText(item.positionEN),
  picture: toImageUrl(toText(item.picture)),
  tag: toText(item.tag),
});

export default function BoardSection() {
  const { locale } = useLocale();
  const endpoint = "/api/directorsapi";
  const cached = getCachedApiResponse<DirectorApiItem[]>(endpoint);
  const initialDirectors = (cached?.data || cached?.result || [])
    .map(normalizeDirector)
    .filter((item) => item.id && (item.nameTH || item.nameEN));
  const [directors, setDirectors] = useState<Director[]>(initialDirectors);
  const [loading, setLoading] = useState(!cached);
  const shouldFadeContentRef = useRef(!cached);

  useEffect(() => {
    const fetchDirectors = async () => {
      try {
        const cached = getCachedApiResponse<DirectorApiItem[]>(endpoint);
        if (cached) {
          const directors = (cached.data || cached.result || [])
            .map(normalizeDirector)
            .filter((item) => item.id && (item.nameTH || item.nameEN));

          setDirectors(directors);
          setLoading(false);
          return;
        }

        const res = await apiFetch<DirectorApiItem[]>(endpoint);
        const directors = (res.data || res.result || [])
          .map(normalizeDirector)
          .filter((item) => item.id && (item.nameTH || item.nameEN));

        setDirectors(directors);
      } catch (error) {
        console.error("fetch directors error:", error);
        setDirectors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDirectors();
  }, [endpoint]);

  const featured = useMemo(
    () => directors.find((item) => item.id === "1") || null,
    [directors]
  );

  const others = useMemo(
    () =>
      directors
        .filter((item) => item.id !== "1")
        .sort((a, b) => Number(a.id) - Number(b.id)),
    [directors]
  );

  if (!loading && !featured && others.length === 0) return null;

  return (
    <Box id="board" component="section" sx={{ py: { xs: 6, md: 1 } }}>
      <Grid
        container
        sx={{
          width: "100%",
          maxWidth: "lg",
          mx: "auto",
          px: { xs: 2.5, sm: 4, md: 1 },
        }}
      >
        <Grid size={12}>
          <Typography
            component="h2"
            sx={{
              color: "var(--color-primary)",
              fontSize: { xs: 28, md: 36 },
              fontWeight: 800,
              textAlign: "center",
              mb: { xs: 3, md: 4 },
              lineHeight: 1.25,
            }}
          >
            {locale === "en" ? "Board of Directors" : "คณะกรรมการบริษัท"}
          </Typography>
        </Grid>

        {loading && (
          <>
            <Grid
              container
              size={12}
              sx={{
                justifyContent: "center",
                mb: { xs: 5, md: 7 },
              }}
            >
              <Grid size={{ xs: 12, md: 5 }}>
                <DirectorCardSkeleton featured />
              </Grid>
            </Grid>

            <Grid
              container
              size={12}
              spacing={{ xs: 5, md: 7 }}
              sx={{ alignItems: "start" }}
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
                  <DirectorCardSkeleton />
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {!loading && featured && (
          <Grid
            className={shouldFadeContentRef.current ? "api-content-fade-in" : undefined}
            container
            size={12}
            sx={{
              justifyContent: "center",
              mb: { xs: 5, md: 7 },
            }}
          >
            <Grid size={{ xs: 12, md: 5 }}>
              <DirectorCard director={featured} featured />
            </Grid>
          </Grid>
        )}

        {!loading && (
          <Grid
            className={shouldFadeContentRef.current ? "api-content-fade-in" : undefined}
            container
            size={12}
            spacing={{ xs: 5, md: 7 }}
            sx={{ alignItems: "start" }}
          >
            {others.map((director) => (
              <Grid key={director.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <DirectorCard director={director} />
              </Grid>
            ))}
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
