"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";

import { apiFetch, getCachedApiResponse } from "@/app/api/client";
import type { MissionApiItem, MissionItem } from "@/app/Utils/type";
import { normalizeMission } from "@/app/Utils/missionData";
import MissionCard, { MissionCardSkeleton } from "./MissionCard";

const MISSION_ENDPOINT = "/api/missionapi";

const toMissionItems = (items: MissionApiItem[]): MissionItem[] =>
  items
    .map(normalizeMission)
    .filter(
      (item) =>
        item.id &&
        (item.titleTH || item.titleEN) &&
        (item.detailTH || item.detailEN)
    );

const chunkByRows = <T,>(list: T[]): T[][] => [
  list.slice(0, 4),
  list.slice(4, 7),
  list.slice(7, 9),
  list.slice(9, 10),
].filter((row) => row.length);

export default function MissionSection() {
  const cached = getCachedApiResponse<MissionApiItem[]>(MISSION_ENDPOINT);
  const [items, setItems] = useState<MissionItem[]>(() =>
    toMissionItems(cached?.data || [])
  );
  const [loading, setLoading] = useState(!cached);
  const shouldFadeContentRef = useRef(!cached);

  useEffect(() => {
    let active = true;
    const cached = getCachedApiResponse<MissionApiItem[]>(MISSION_ENDPOINT);

    if (cached) {
      setItems(toMissionItems(cached.data || []));
      setLoading(false);
      return;
    }

    const fetchMission = async () => {
      try {
        setLoading(true);
        const response = await apiFetch<MissionApiItem[]>(MISSION_ENDPOINT);

        if (active) setItems(toMissionItems(response.data || []));
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
  }, []);

  if (!loading && !items.length) return null;

  const displayItems = loading ? Array.from({ length: 10 }) : items.slice(0, 10);
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
        className={!loading && shouldFadeContentRef.current ? "api-content-fade-in" : undefined}
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
        className={!loading && shouldFadeContentRef.current ? "api-content-fade-in" : undefined}
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
