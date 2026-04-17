// app/views/home/HomeClient.tsx

"use client";

/* ======================================================
   IMPORT
====================================================== */
import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

import ServiceClient from "./Service/ServiceClient";
import LoanInterestSection from "./LoanInterestSection/LoanInterestSection";
import NewsSection from "./News/NewsSection";

import { useLocale } from "@/app/providers/LocaleContext";

/* ======================================================
   COMPONENT
====================================================== */
export default function HomeClient() {
  const { messages } = useLocale();

  /* ======================================================
     STATE
  ====================================================== */
  const [provinces, setProvinces] = useState<any[]>([]);
  const [amphures, setAmphures] = useState<any[]>([]);
  const [tambons, setTambons] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);

  /* ======================================================
     LOAD DATA
  ====================================================== */
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [p, a, t, s] = await Promise.all([
          fetch("/data/thai_provinces.json").then((r) => r.json()),
          fetch("/data/thai_amphures.json").then((r) => r.json()),
          fetch("/data/thai_tambons.json").then((r) => r.json()),
          fetch("/api/service").then((r) => r.json()),
        ]);

        setProvinces(p);
        setAmphures(a);
        setTambons(t);
        setServices(s.services || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAllData();
  }, []);

  /* ======================================================
     UI
  ====================================================== */
  return (
    <>
      {/* ======================================================
         BRAND BAR
      ====================================================== */}
      <Box
        sx={{
          width: "100%",
          background:
            "linear-gradient(135deg, #243865 10%, #4871CB 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            color: "var(--neutral-white)",
            my: 2,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {messages?.brand?.name}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              opacity: 0.9,
              mt: 0.5,
            }}
          >
            “{messages?.brand?.slogan}”
          </Typography>
        </Box>
      </Box>

      {/* ======================================================
         SERVICE SECTION
      ====================================================== */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: `
              linear-gradient(rgba(255,255,255,0.5), rgba(255,255,255,0.5)),
              linear-gradient(
                180deg,
                rgba(255,255,255,0) 59%,
                rgba(255,255,255,1) 85%
              ),
              url('/Service/ServiceBackGrund.png')
            `,
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: 0,

            "&::after": {
              content: '""',
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: "6px",
              background: "#FDFDFD",
            },
          }}
        />

        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            py: 8,
          }}
        >
          <ServiceClient />
        </Box>
      </Box>

      {/* ======================================================
         LOAN FORM
      ====================================================== */}
      <Box
        sx={{
          width: "100%",
          background: "#FDFDFD",
          py: 12,
        }}
      >
        <LoanInterestSection
          provinces={provinces}
          amphures={amphures}
          tambons={tambons}
          services={services}
        />
      </Box>

      {/* ======================================================
         NEWS
      ====================================================== */}
      <Box
        sx={{
          backgroundColor: "#E9F0FB",
          py: 5,
        }}
      >
        <NewsSection />
      </Box>
    </>
  );
}