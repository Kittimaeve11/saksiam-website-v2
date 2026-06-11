"use client";

import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

import { apiFetch, getCachedApiResponse } from "@/app/api/client";
import type { MissionApiItem, MissionItem } from "@/app/Utils/type";
import MissionCard, { MissionCardSkeleton } from "./MissionCard";

const PHOTO_BASE_URL = process.env.NEXT_PUBLIC_API_PHOTO || "";

const toText = (value: string | number | null | undefined): string => {
  if (typeof value === "number") return String(value);
  return typeof value === "string" ? value.trim() : "";
};

const toImageUrl = (src: string): string => {
  if (!src) return "";
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) {
    return src;
  }

  return `${PHOTO_BASE_URL}${src}`;
};

const stripHtml = (value: string): string =>
  value
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const normalizeMission = (item: MissionApiItem, index: number): MissionItem => ({
  id:
    toText(item.id || item.missionID || item.mission_ID || item.int_saksiam_mission_id) ||
    String(index + 1),
  titleTH: stripHtml(toText(item.topicTH || item.nameTH || item.mission_nameTH)),
  titleEN: stripHtml(toText(item.topicEN || item.nameEN || item.mission_nameEN)),
  detailTH: stripHtml(toText(item.detailTH || item.descriptionTH || item.mission_detailTH || item.titleTH)),
  detailEN: stripHtml(toText(item.detailEN || item.descriptionEN || item.mission_detailEN || item.titleEN)),
  image: toImageUrl(toText(item.image || item.picture || item.icon || item.mission_picture)),
});

const chunkByRows = <T,>(list: T[]): T[][] => [
  list.slice(0, 4),   // 4
  list.slice(4, 7),   // 3
  list.slice(7, 9),   // 2
  list.slice(9, 10),  // 1
].filter((row) => row.length);

export default function MissionSection() {
  const endpoint = "/api/missionapi";
  const cached = getCachedApiResponse<MissionApiItem[]>(endpoint);
  const initialItems = (cached?.data || cached?.result || [])
    .map(normalizeMission)
    .filter((item) => (item.titleTH || item.titleEN) && (item.detailTH || item.detailEN));
  const [items, setItems] = useState<MissionItem[]>(initialItems);
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    let active = true;
    const cached = getCachedApiResponse<MissionApiItem[]>(endpoint);
    if (cached) {
      const missions = (cached.data || cached.result || [])
        .map(normalizeMission)
        .filter((item) => (item.titleTH || item.titleEN) && (item.detailTH || item.detailEN));

      setItems(missions);
      setLoading(false);
      return;
    }

    const fetchMission = async () => {
      try {
        setLoading(true);
        const res = await apiFetch<MissionApiItem[]>(endpoint);
        const missions = (res.data || res.result || [])
          .map(normalizeMission)
          .filter((item) => (item.titleTH || item.titleEN) && (item.detailTH || item.detailEN));

        if (active) setItems(missions);
      } catch (error) {
        console.error("Mission API error:", error);
        if (active) setItems([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchMission();

    return () => {
      active = false;
    };
  }, [endpoint]);

  if (!loading && !items.length) return null;

  const displayItems = loading
    ? Array.from({ length: 10 })
    : items.slice(0, 10);
  const rows = chunkByRows(displayItems);

  return (
    <Box component="section" sx={{ width: "100%", py: { xs: 4, md: 5 } }}>
      <Typography
        component="h2"
        sx={{
          color: "var(--color-primary)",
          fontSize: { xs: 32, md: 36 },
          fontWeight: 800,
          textAlign: "center",
          mb: { xs: 3, md: 4 },
          lineHeight: 1.25,
        }}
      >
        พันธกิจ
      </Typography>

      <Box
        sx={{
          display: { xs: "grid", lg: "none" },
          gridTemplateColumns: {
            xs: "minmax(0, min(100%, 278px))",
            sm: "repeat(2, minmax(0, 278px))",
            md: "repeat(3, minmax(0, 278px))",
          },
          justifyContent: "center",
          gap: { xs: 2.5, sm: 3, md: 3.5 },
        }}
      >
        {displayItems.map((item, index) => (
          <Box
            key={loading ? `responsive-${index}` : (item as MissionItem).id}
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {loading ? (
              <MissionCardSkeleton />
            ) : (
              <MissionCard item={item as MissionItem} />
            )}
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          display: { xs: "none", lg: "flex" },
          flexDirection: "column",
          gap: 3.5,
        }}
      >
        {rows.map((row, rowIndex) => (
          <Box
            key={rowIndex}
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 3.5,
            }}
          >
            {row.map((item, index) => (
              <Box
                key={loading ? `${rowIndex}-${index}` : (item as MissionItem).id}
                sx={{
                  width: "calc((100% - 84px) / 4)",
                  maxWidth: 278,
                  display: "flex",
                }}
              >
                {loading ? (
                  <MissionCardSkeleton />
                ) : (
                  <MissionCard item={item as MissionItem} />
                )}
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
