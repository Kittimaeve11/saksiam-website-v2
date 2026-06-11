"use client";

import Image from "next/image";
import { Box, Card, CardContent, Skeleton, Typography } from "@mui/material";
import { FaBullseye } from "react-icons/fa";

import { useLocale } from "@/app/providers/LocaleContext";
import type { MissionItem } from "@/app/Utils/type";

type Props = {
  item: MissionItem;
};

const isRemoteImage = (src: string) =>
  src.startsWith("http://") || src.startsWith("https://");

export function MissionCardSkeleton() {
  return (
    <Card
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: 278,
        minHeight: { xs: 260, md: 286 },
        borderRadius: "22px",
        border: "1px solid rgba(216, 218, 220, 0.9)",
        bgcolor: "#fff",
        boxShadow: "0 14px 36px rgba(16, 24, 40, 0.06)",
        overflow: "hidden",
      }}
    >
      <CardContent
        sx={{
          p: { xs: 2.5, md: 3 },
          "&:last-child": { pb: { xs: 2.5, md: 3 } },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Skeleton
          variant="circular"
          sx={{
            width: { xs: 74, md: 86 },
            height: { xs: 74, md: 86 },
            mb: { xs: 1.5, md: 2 },
          }}
        />
        <Skeleton width="78%" height={32} sx={{ mb: 1.5 }} />
        <Box sx={{ width: "100%" }}>
          <Skeleton width="100%" height={20} />
          <Skeleton width="94%" height={20} />
          <Skeleton width="88%" height={20} />
          <Skeleton width="72%" height={20} />
        </Box>
      </CardContent>
    </Card>
  );
}

export default function MissionCard({ item }: Props) {
  const { locale } = useLocale();
  const title = locale === "en" ? item.titleEN || item.titleTH : item.titleTH || item.titleEN;
  const detail = locale === "en" ? item.detailEN || item.detailTH : item.detailTH || item.detailEN;

  return (
    <Card
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: 278,
        // height: "100%",
        minHeight: { xs: 260, md: 286 },

        borderRadius: "22px",
        border: "1px solid rgba(216, 218, 220, 0.9)",
        bgcolor: "#fff",
        boxShadow: "0 14px 36px rgba(16, 24, 40, 0.06)",

        overflow: "hidden",

        transition:
          "transform .32s ease, box-shadow .32s ease, border-color .32s ease",

        "&:hover": {
          // transform: "translateY(-5px)",

          borderColor: "rgba(91, 141, 237, 0.38)",
          boxShadow: "0 20px 44px rgba(16, 24, 40, 0.12)",
        },
      }}
    >

      <CardContent
        sx={{
          p: { xs: 2.5, md: 3 },
          "&:last-child": { pb: { xs: 2.5, md: 3 } },

          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            width: { xs: 74, md: 86 },
            height: { xs: 74, md: 86 },
            mb: { xs: 1.5, md: 2 },
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            bgcolor: item.image ? "transparent" : "var(--color-primary)",
            color: "#fff",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {item.image ? (
            <Image
              src={item.image}
              alt={title}
              fill
              unoptimized={isRemoteImage(item.image)}
              sizes="50px"
              style={{ objectFit: "contain" }}
            />
          ) : (
            <FaBullseye size={28} />
          )}
        </Box>

        <Typography
          component="h3"
          sx={{
            color: "var(--color-primary)",
            fontSize: { xs: 18, md: 18 },
            fontWeight: 800,
            lineHeight: 1.35,
            mb: 1.5,
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            color: "#667085",
            fontSize: { xs: 14, md: 14 },
            lineHeight: 1.75,
            textAlign: "left",
            width: "100%",
          }}
        >
          {detail}
        </Typography>
      </CardContent>
    </Card>
  );
}
