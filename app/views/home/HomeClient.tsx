"use client";

/* ======================================================
   IMPORT
====================================================== */
import { Box, Typography } from "@mui/material";

import ServiceClient from "./Service/ServiceClient";
import LoanInterestSection from "./LoanInterestSection/LoanInterestSection";
import NewsSection from "./News/NewsSection";

import { useLocale } from "@/app/providers/LocaleContext";

/* ======================================================
   TYPE
====================================================== */
type Props = {
  provinces: any[];
  amphures: any[];
  tambons: any[];
  services: any[];
};

/* ======================================================
   COMPONENT
====================================================== */
export default function HomeClient({
  provinces,
  amphures,
  tambons,
  services,
}: Props) {
  const { messages } = useLocale();

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
        }}
      >
        <Box sx={{ textAlign: "center", color: "#fff", my: 2 }}>
          <Typography
            sx={{
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            {messages?.brand?.name}
          </Typography>

          <Typography
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
      <Box sx={{ position: "relative", width: "100%" }}>
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
          }}
        />

        <Box sx={{ position: "relative", zIndex: 1, py: 8 }}>
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