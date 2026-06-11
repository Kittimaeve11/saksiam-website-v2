"use client";

import { Box, Container, Typography } from "@mui/material";

import EachBanner from "@/app/components/ui/Banner/EachBanner";
import Breadcrumb from "@/app/components/ui/Breadcrumb/Breadcrumb";
import { useLocale } from "@/app/providers/LocaleContext";

type AboutHeaderProps = {
  title: string;
  bannerNum: number;
  hideTitle?: boolean;
};

export default function AboutHeader({
  title,
  bannerNum,
  hideTitle = false,
}: AboutHeaderProps) {
  const { messages } = useLocale();

  return (
    <Box sx={{ position: "relative" }}>
      {/* ======================================================
          BANNER
      ====================================================== */}
      <Box sx={{ position: "relative" }}>
        <EachBanner num={bannerNum} />

        {!hideTitle && (
          <Box
            sx={{
              position: "absolute",

              /* ======================================================
                 DESKTOP = LEFT CENTER
                 MOBILE = TOP CENTER
              ====================================================== */
              left: {
                xs: "50%",
                md: "6%",
              },

              top: {
                xs: "12%",
                sm: "14%",
                md: "50%",
              },

              transform: {
                xs: "translateX(-50%)",
                md: "translateY(-50%)",
              },

              width: {
                xs: "92%",
                sm: "88%",
                md: "650px",
                lg: "750px",
              },

              zIndex: 5,

              textAlign: {
                xs: "center",
                md: "left",
              },
            }}
          >
            {/* ======================================================
                TITLE
            ====================================================== */}
            <Typography
              component="h1"
              sx={{
                color: "#fff",

                fontSize: {
                  xs: "clamp(40px,10vw,64px)",
                  sm: "clamp(52px,9vw,78px)",
                  md: "3.5rem",
                  lg: "4.5rem",
                },

                fontWeight: 800,

                lineHeight: 1.05,

                letterSpacing: "-0.02em",

                textShadow: `
                    0 2px 4px rgba(0,0,0,0.45),
                    0 6px 16px rgba(0,0,0,0.30),
                    0 12px 32px rgba(0,0,0,0.18)
                  `,
              }}
            >
              {title}
            </Typography>

            {/* ======================================================
                YELLOW LINE
            ====================================================== */}
            <Box
              sx={{
                width: {
                  xs: 120,
                  md: 160,
                },

                height: 6,

                background: "#ffd000",

                mt: 2,

                mx: {
                  xs: "auto",
                  md: 0,
                },

                borderRadius: 999,

                boxShadow: `
                  0 0 12px rgba(255,193,7,.45),
                  0 4px 12px rgba(0,0,0,.2)
                `,
              }}
            />
          </Box>
        )}
      </Box>

      {/* ======================================================
          BREADCRUMB
      ====================================================== */}
      <Container maxWidth="xl">
        <Breadcrumb
          items={[
            { label: messages.common.home, type: "link", href: "/" },
            { label: messages.common.back, type: "back" },
            { label: title, type: "current" },
          ]}
        />
      </Container>
    </Box>
  );
}
