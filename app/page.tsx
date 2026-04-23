"use client";

/* ======================================================
   IMPORT
====================================================== */
import { useEffect, useState } from "react";
import { Box, Typography, Fade } from "@mui/material";

import HomeBanner from "./views/home/HomeBanner/HomeBanner";
import ServiceClient from "./views/home/Service/ServiceClient";
import LoanInterestSection from "./views/home/LoanInterestSection/LoanInterestSection";
import NewsSection from "./views/home/News/NewsSection";
import TestimonialSection from "./views/home/TestimonialSection/TestimonialSection";
import HomeIntroSection from "./views/home/HomeIntroSection/HomeIntroSection";

import { useLocale } from "@/app/providers/LocaleContext";

/* ======================================================
   TYPE
====================================================== */
type DataType = {
  provinces: any[];
  amphures: any[];
  tambons: any[];
  services: any[];
};

/* ======================================================
   COMPONENT
====================================================== */
export default function Page() {
  const { messages } = useLocale();

  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<DataType>({
    provinces: [],
    amphures: [],
    tambons: [],
    services: [],
  });

  /* ======================================================
     🔥 ONE useEffect (fade + fetch)
  ====================================================== */
  useEffect(() => {
    const run = async () => {
      try {
        const [p, a, t] = await Promise.all([
          fetch("/data/thai_provinces.json").then((r) => r.json()),
          fetch("/data/thai_amphures.json").then((r) => r.json()),
          fetch("/data/thai_tambons.json").then((r) => r.json()),
        ]);

        let services: any[] = [];

        try {
          const res = await fetch("/api/service");
          if (res.ok) {
            const s = await res.json();
            services = s?.services || [];
          }
        } catch {
          console.warn("⚠️ service API fail");
        }

        setData({
          provinces: p,
          amphures: a,
          tambons: t,
          services,
        });
      } catch (err) {
        console.error("🔥 FETCH ERROR:", err);
      } finally {
        // 🔥 trigger fade หลังทุกอย่างพร้อม
        setMounted(true);
      }
    };

    run();
  }, []);

  /* ======================================================
     UI
  ====================================================== */
  return (
    <Fade in={mounted} timeout={800}>
      <Box>
        {/* ================= BANNER ================= */}
        <HomeBanner />

        {/* ================= BRAND BAR ================= */}
        <Box
          sx={{
            width: "100%",
            background:
              "linear-gradient(135deg, #243865 10%, #4871CB 100%)",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box sx={{ textAlign: "center", color: "#fff", my: 2 }}>
            <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
              {messages?.brand?.name}
            </Typography>

            <Typography sx={{ opacity: 0.9 }}>
              “{messages?.brand?.slogan}”
            </Typography>
          </Box>
        </Box>

        {/* ================= SERVICE ================= */}
        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: `
                linear-gradient(rgba(255,255,255,0.5), rgba(255,255,255,0.5)),
                linear-gradient(180deg, rgba(255,255,255,0) 59%, rgba(255,255,255,1) 85%),
                url('/Service/ServiceBackGrund.png')
              `,
              backgroundSize: "cover",
              zIndex: 0,
            }}
          />

          <Box sx={{ position: "relative", zIndex: 1, py: 8 }}>
            <ServiceClient />
          </Box>
        </Box>

        {/* ================= FORM ================= */}
        {/* <Box sx={{ background: "#FDFDFD", py: 12 }}>
          <LoanInterestSection
            provinces={data.provinces}
            amphures={data.amphures}
            tambons={data.tambons}
            services={data.services}
          />
        </Box> */}

        {/* ================= NEWS ================= */}
        <Box sx={{ backgroundColor: "#E9F0FB", py: 5 }}>
          {/* <NewsSection /> */}
        </Box>

        {/* ================= EXTRA ================= */}
        {/* <TestimonialSection />
        <HomeIntroSection /> */}
      </Box>
    </Fade>
  );
}