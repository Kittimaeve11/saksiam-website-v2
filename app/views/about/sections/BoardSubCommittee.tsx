"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Box, Grid, Typography } from "@mui/material";

import { apiFetch, getCachedApiResponse } from "@/app/api/client";
import type { DirectorApiItem } from "@/app/Utils/type";
import { useLocale } from "@/app/providers/LocaleContext";
import { buildImageUrl } from "@/app/Utils/imageUrl";

import DirectorCard from "../../../components/cards/DirectorCard/DirectorCard";
import type { Director } from "../../../components/cards/DirectorCard/DirectorCard";
import DirectorCardSkeleton from "../../../components/cards/DirectorCard/DirectorCardSkeleton";

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

const normalize = (value: string): string => value.replace(/\s+/g, "");
const ABOUT_TARGET_CLASS = "about-target-pending";
const ABOUT_TARGET_KEY = "saksiam-about-target";

export default function BoardSubCommittee() {
  const { messages } = useLocale();
  const searchParams = useSearchParams();
  const endpoint = "/api/directorsapi";
  const cached = getCachedApiResponse<DirectorApiItem[]>(endpoint);
  const initialDirectors = (cached?.data || cached?.result || [])
    .map(normalizeDirector)
    .filter((item) => item.id && (item.nameTH || item.nameEN));
  const [directors, setDirectors] = useState<Director[]>(initialDirectors);
  const [loading, setLoading] = useState(!cached);
  const targetSection = searchParams.get("section");
  const fetchedEndpointRef = useRef("");
  const shouldFadeContentRef = useRef(!cached);

  useEffect(() => {
    let active = true;
    let frame = 0;
    let scrollFrame = 0;

    const scrollToTarget = () => {
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
        scrollFrame = requestAnimationFrame(attemptScroll);
      };

      frame = requestAnimationFrame(attemptScroll);
    };

    const fetchDirectors = async () => {
      try {
        const cached = getCachedApiResponse<DirectorApiItem[]>(endpoint);
        if (cached) {
          const directors = (cached.data || cached.result || [])
            .map(normalizeDirector)
            .filter((item) => item.id && (item.nameTH || item.nameEN));

          setDirectors(directors);
          setLoading(false);
          scrollToTarget();
          return;
        }

        const res = await apiFetch<DirectorApiItem[]>(endpoint);
        const directors = (res.data || res.result || [])
          .map(normalizeDirector)
          .filter((item) => item.id && (item.nameTH || item.nameEN));

        if (active) setDirectors(directors);
      } catch (error) {
        console.error("fetch subcommittee directors error:", error);
        if (active) setDirectors([]);
      } finally {
        if (active) {
          setLoading(false);
          scrollToTarget();
        }
      }
    };

    if (fetchedEndpointRef.current !== endpoint) {
      fetchedEndpointRef.current = endpoint;
      fetchDirectors();
    } else if (!loading) {
      scrollToTarget();
    }

    return () => {
      active = false;
      cancelAnimationFrame(frame);
      cancelAnimationFrame(scrollFrame);
    };
  }, [endpoint, loading, targetSection]);

  const groupedCommittees = useMemo(
    () =>
      committees
        .map((committee) => {
          const committeeKey = normalize(committee.tagTH);
          const members = directors
            .filter((director) =>
              normalize(director.tag || "").includes(committeeKey)
            )
            .sort((a, b) => Number(a.id) - Number(b.id));

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
                {group.members.map((director) => (
                  <Grid key={director.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <DirectorCard director={director} />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
}
