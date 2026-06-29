"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Box, Grid, Typography } from "@mui/material";

import { apiFetch, getCachedApiResponse } from "@/app/api/client";
import type { DirectorApiItem } from "@/app/Utils/type";
import { useLocale } from "@/app/providers/LocaleContext";
import {
  getDirectorOrder,
  isDirectorActive,
  normalizeCommitteeTag,
  normalizeDirector,
} from "@/app/Utils/directorData";

import DirectorCard from "../../../components/cards/DirectorCard/DirectorCard";
import type { Director } from "../../../components/cards/DirectorCard/DirectorCard";
import DirectorCardSkeleton from "../../../components/cards/DirectorCard/DirectorCardSkeleton";
import ScrollReveal, {
  usePageRevealOnce,
} from "@/app/components/ui/ScrollReveal/ScrollReveal";

const DIRECTORS_ENDPOINT = "/api/directorsapi";
const ABOUT_TARGET_CLASS = "about-target-pending";
const ABOUT_TARGET_KEY = "saksiam-about-target";
const DIRECTORS_TIMEOUT_MS = 8000;

const committees = [
  {
    id: "audit-committee",
    labelKey: "audit_committee",
    tagTH: "คณะกรรมการตรวจสอบ",
  },
  {
    id: "risk-committee",
    labelKey: "risk_committee",
    tagTH: "คณะกรรมการบริหารความเสี่ยง",
  },
  {
    id: "nomination-committee",
    labelKey: "nomination_committee",
    tagTH: "คณะกรรมการสรรหา และพิจารณาค่าตอบแทน",
  },
  {
    id: "governance-committee",
    labelKey: "governance_committee",
    tagTH: "คณะกรรมการบรรษัทภิบาลและความยั่งยืน",
  },
] as const;

const toDirectors = (items: DirectorApiItem[]): Director[] =>
  items
    .filter((item) => isDirectorActive(item.active))
    .sort((a, b) => getDirectorOrder(a) - getDirectorOrder(b))
    .map(normalizeDirector)
    .filter((item) => item.id && (item.nameTH || item.nameEN));

export default function BoardSubCommittee() {
  const { messages } = useLocale();
  const searchParams = useSearchParams();
  const cached = getCachedApiResponse<DirectorApiItem[]>(DIRECTORS_ENDPOINT);
  const shouldReveal = usePageRevealOnce("about-board-subcommittee");
  const [directors, setDirectors] = useState<Director[]>(() =>
    toDirectors(cached?.data || [])
  );
  const [loading, setLoading] = useState(!cached);
  const targetSection = searchParams.get("section");
  const skipReveal = Boolean(targetSection) || !shouldReveal;
  const shouldFadeContentRef = useRef(!cached);
  const scrollFrameRef = useRef(0);

  const scrollToTarget = useCallback(() => {
    if (!targetSection) return;
    let tries = 0;

    const finishFooterTarget = () => {
      window.sessionStorage.removeItem(ABOUT_TARGET_KEY);
      document.documentElement.classList.remove(ABOUT_TARGET_CLASS);
    };

    const attemptScroll = () => {
      const isFooterTarget =
        document.documentElement.classList.contains(ABOUT_TARGET_CLASS);
      const target = document.getElementById(targetSection);

      if (target || tries >= 20) {
        target?.scrollIntoView({
          behavior: isFooterTarget ? "auto" : "smooth",
          block: "start",
        });

        if (isFooterTarget) {
          requestAnimationFrame(finishFooterTarget);
        }
        return;
      }

      tries += 1;
      scrollFrameRef.current = requestAnimationFrame(attemptScroll);
    };

    scrollFrameRef.current = requestAnimationFrame(attemptScroll);
  }, [targetSection]);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      controller.abort();
    }, DIRECTORS_TIMEOUT_MS);

    const fetchDirectors = async () => {
      try {
        const cached = getCachedApiResponse<DirectorApiItem[]>(DIRECTORS_ENDPOINT);
        if (cached) {
          if (active) {
            setDirectors(toDirectors(cached.data || []));
            setLoading(false);
            scrollToTarget();
          }
          return;
        }

        const response = await apiFetch<DirectorApiItem[]>(DIRECTORS_ENDPOINT, {
          signal: controller.signal,
        });

        if (active) setDirectors(toDirectors(response.data || []));
      } catch (error) {
        console.error("fetch subcommittee directors error:", error);
        if (active) setDirectors([]);
      } finally {
        window.clearTimeout(timeout);
        if (active) {
          setLoading(false);
          scrollToTarget();
        }
      }
    };

    fetchDirectors();

    return () => {
      active = false;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [scrollToTarget]);

  useEffect(() => {
    if (!loading) scrollToTarget();

    return () => {
      if (scrollFrameRef.current) cancelAnimationFrame(scrollFrameRef.current);
    };
  }, [loading, scrollToTarget]);

  const groupedCommittees = useMemo(
    () =>
      committees
        .map((committee) => {
          const committeeKey = normalizeCommitteeTag(committee.tagTH);
          const members = directors.filter((director) =>
            normalizeCommitteeTag(director.tag || "").includes(committeeKey)
          );

          return { ...committee, members };
        })
        .filter((group) => group.members.length > 0),
    [directors]
  );

  if (!loading && groupedCommittees.length === 0) return null;

  const getCommitteeLabel = (
    labelKey: (typeof committees)[number]["labelKey"]
  ) => messages.about[labelKey];

  const headingSx = {
    color: "var(--color-primary)",
    fontSize: { xs: 22, md: 36 },
    fontWeight: 800,
    textAlign: "center",
    mb: { xs: 3, md: 4 },
    lineHeight: 1.25,
  };

  const renderSkeletonGroup = (committee: (typeof committees)[number]) => (
    <Grid
      key={committee.id}
      id={committee.id}
      size={12}
      sx={{ mb: { xs: 6, md: 7 } }}
    >
      <Typography component="h3" sx={headingSx}>
        {getCommitteeLabel(committee.labelKey)}
      </Typography>

      <Grid
        container
        spacing={{ xs: 5, md: 7 }}
        sx={{ alignItems: "start", justifyContent: "flex-start" }}
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
            <DirectorCardSkeleton />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );

  return (
    <Box id="subcommittee" component="section" sx={{ py: { xs: 5, md: 1 } }}>
      <Grid
        container
        sx={{
          width: "100%",
          maxWidth: "lg",
          mx: "auto",
          px: { xs: 2.5, sm: 4, md: 1 },
        }}
      >
        {loading && committees.map(renderSkeletonGroup)}

        {!loading &&
          groupedCommittees.map((group) => (
            <Grid
              className={shouldFadeContentRef.current ? "api-content-fade-in" : undefined}
              key={group.id}
              id={group.id}
              size={12}
              sx={{ mb: { xs: 6, md: 7 } }}
            >
              <Typography component="h3" sx={headingSx}>
                {getCommitteeLabel(group.labelKey)}
              </Typography>

              <Grid
                container
                spacing={{ xs: 5, md: 7 }}
                sx={{ alignItems: "start", justifyContent: "flex-start" }}
              >
                {group.members.map((director, index) => (
                  <Grid key={director.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <ScrollReveal
                      delay={Math.min(index, 5) * 70}
                      disabled={skipReveal}
                    >
                      <DirectorCard director={director} />
                    </ScrollReveal>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
}
