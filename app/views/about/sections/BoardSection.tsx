"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { useLocale } from "@/app/providers/LocaleContext";
import { apiFetch, getCachedApiResponse } from "@/app/api/client";
import type { DirectorApiItem } from "@/app/Utils/type";
import {
  getDirectorOrder,
  isDirectorActive,
  normalizeDirector,
} from "@/app/Utils/directorData";

import DirectorCard from "../../../components/cards/DirectorCard/DirectorCard";
import type { Director } from "../../../components/cards/DirectorCard/DirectorCard";
import DirectorCardSkeleton from "../../../components/cards/DirectorCard/DirectorCardSkeleton";
import ScrollReveal, {
  usePageRevealOnce,
} from "@/app/components/ui/ScrollReveal/ScrollReveal";

const DIRECTORS_ENDPOINT = "/api/directorsapi";

const toDirectors = (items: DirectorApiItem[]): Director[] =>
  items
    .filter((item) => isDirectorActive(item.active))
    .sort((a, b) => getDirectorOrder(a) - getDirectorOrder(b))
    .map(normalizeDirector)
    .filter((item) => item.id && (item.nameTH || item.nameEN));

export default function BoardSection() {
  const { locale } = useLocale();
  const cached = getCachedApiResponse<DirectorApiItem[]>(DIRECTORS_ENDPOINT);
  const shouldReveal = usePageRevealOnce("about-board-directors");
  const [directors, setDirectors] = useState<Director[]>(() =>
    toDirectors(cached?.data || [])
  );
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    let active = true;

    const fetchDirectors = async () => {
      try {
        const cached = getCachedApiResponse<DirectorApiItem[]>(DIRECTORS_ENDPOINT);
        if (cached) {
          if (active) {
            setDirectors(toDirectors(cached.data || []));
            setLoading(false);
          }
          return;
        }

        const response = await apiFetch<DirectorApiItem[]>(DIRECTORS_ENDPOINT);

        if (active) {
          setDirectors(toDirectors(response.data || []));
        }
      } catch (error) {
        console.error("fetch directors error:", error);
        if (active) setDirectors([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchDirectors();

    return () => {
      active = false;
    };
  }, []);

  const featured = useMemo(
    () => directors.find((item) => item.id === "1") || null,
    [directors]
  );

  const others = useMemo(
    () => directors.filter((item) => item.id !== "1"),
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
        <Grid key={loading ? "board-heading-loading" : "board-heading-ready"} size={12}>
          <ScrollReveal disabled={loading || !shouldReveal}>
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
          </ScrollReveal>
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
            container
            size={12}
            sx={{
              justifyContent: "center",
              mb: { xs: 5, md: 7 },
            }}
          >
            <Grid size={{ xs: 12, md: 5 }}>
              <ScrollReveal disabled={!shouldReveal}>
                <DirectorCard director={featured} featured />
              </ScrollReveal>
            </Grid>
          </Grid>
        )}

        {!loading && (
          <Grid
            container
            size={12}
            spacing={{ xs: 5, md: 7 }}
            sx={{ alignItems: "start" }}
          >
            {others.map((director) => (
              <Grid key={director.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <ScrollReveal disabled={!shouldReveal}>
                  <DirectorCard director={director} />
                </ScrollReveal>
              </Grid>
            ))}
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
