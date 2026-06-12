"use client";

import Image from "next/image";
import { Box, Grid, Typography } from "@mui/material";
import { useLocale } from "@/app/providers/LocaleContext";

export { default as DirectorCardSkeleton } from "./DirectorCardSkeleton";

export type Director = {
  id: string;
  nameTH: string;
  nameEN: string;
  positionTH: string;
  positionEN: string;
  picture: string;
  tag?: string;
};

type DirectorCardProps = {
  director: Director;
  featured?: boolean;
};

const isRemoteImage = (src: string): boolean =>
  src.startsWith("http://") || src.startsWith("https://");

export default function DirectorCard({
  director,
  featured = false,
}: DirectorCardProps) {
  const { locale } = useLocale();

  const name = locale === "en" ? director.nameEN : director.nameTH;

  const position =
    locale === "en" ? director.positionEN : director.positionTH;

  const imageSrc = director.picture || "/images/placeholder.jpg";

  return (
    <Box>
      <Grid
        container
        sx={{
          width: "87%",
          maxWidth: featured ? 428 : 342,
          mx: "auto",
          textAlign: "center",
        }}
      >
        <Grid
          size={12}
          sx={{
            position: "relative",
            width: "100%",
            mb: featured ? { xs: 5.25, md: 5.75 } : { xs: 4.25, md: 4.75 },
            overflow: "visible",

            "&:hover .director-position-overlay, &:focus-within .director-position-overlay":
              {
                opacity: 1,
              },

            "&:hover .director-position-text, &:focus-within .director-position-text":
              {
                opacity: 1,
                transform: "translateY(0)",
              },
          }}
        >
          <Image
            src={imageSrc}
            alt={name}
            width={428}
            height={643}
            unoptimized={isRemoteImage(imageSrc)}
            sizes={
              featured
                ? "(max-width: 600px) calc(100vw - 48px), 428px"
                : "(max-width: 600px) calc(100vw - 64px), 342px"
            }
            style={{
              width: "100%",
              height: "auto",
              display: "block",
            }}
          />

          <Box
            className="director-position-overlay"
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 1,
              borderRadius: featured
                ? { xs: "46px", md: "58px" }
                : { xs: "34px", md: "44px" },
              overflow: "hidden",
              opacity: 0,
              background:
                "linear-gradient(180deg, rgba(5, 42, 96, 0) 28%, rgba(4, 44, 103, 0.72) 72%, rgba(0, 53, 117, 0.92) 100%)",
              transition: "opacity .34s ease",
              pointerEvents: "none",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              px: featured ? { xs: 3, md: 4 } : { xs: 2.25, md: 3 },
              pb: featured
                ? { xs: 8.5, md: 10.5 }
                : { xs: 6.5, md: 7.5 },
            }}
          >
            <Typography
              className="director-position-text"
              sx={{
                color: "#fff",
                fontSize: featured
                  ? { xs: 14, md: 16 }
                  : { xs: 12.5, md: 14 },
                fontWeight: 600,
                lineHeight: 1.75,
                textAlign: "center",
                textShadow: "0 2px 8px rgba(0, 24, 58, 0.35)",
                opacity: 0,
                transform: "translateY(18px)",
                transition:
                  "opacity .34s ease .06s, transform .42s cubic-bezier(.22,1,.36,1) .04s",
              }}
            >
              {position}
            </Typography>
          </Box>

          <Box
            sx={{
              position: "absolute",
              left: "50%",
              bottom: featured
                ? { xs: -30, md: -34 }
                : { xs: -22, md: -26 },
              width: featured
                ? { xs: "118%", md: "140%" }
                : { xs: "114%", md: "140%" },
              aspectRatio: "865 / 188",
              zIndex: 2,
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              px: featured ? { xs: 6, md: 8 } : { xs: 4.5, md: 6 },
              backgroundImage: "url('/background/tagName.png')",
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
              backgroundPosition: "center",
              pointerEvents: "none",
            }}
          >
            <Typography
              sx={{
                color: "#fff",
                fontSize: featured
                  ? { xs: 24, md: 30 }
                  : { xs: 16, md: 20 },
                fontWeight: 800,
                lineHeight: 1.2,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                textShadow: "0 1px 2px rgba(0, 0, 0, 0.16)",
              }}
            >
              {name}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
