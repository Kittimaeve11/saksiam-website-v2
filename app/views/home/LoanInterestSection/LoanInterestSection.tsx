"use client";

/* ====================================================== */
import { Box, Container } from "@mui/material";
import LoanInterestForm from "./LoanInterestForm";
import LoanBranchCTA from "./LoanBranchCTA";

/* ====================================================== */
export default function LoanInterestSection({
  provinces,
  amphures,
  tambons,
  services,
}: any) {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          width: "100%",

          display: "flex",
          flexDirection: {
            xs: "column",
            lg: "row",
          },

          alignItems: {
            xs: "stretch", // 🔥 mobile เต็ม
            lg: "center",
          },

          justifyContent: "space-between",

          gap: {
            xs: 4,   // 🔥 mobile spacing น้อยลง
            sm: 6,
            lg: 10,
          },
        }}
      >
        {/* ================= FORM ================= */}
        <Box
          sx={{
            flex: 1,
            width: "100%",

            maxWidth: {
              xs: "100%",   // 🔥 เต็มจอ
              sm: "90%",    // 🔥 tablet นิดนึง
              lg: "600px",
            },

            mx: {
              xs: "auto",   // 🔥 center mobile
              lg: 0,
            },
          }}
        >
          <LoanInterestForm
            provinces={provinces}
            amphures={amphures}
            tambons={tambons}
            services={services}
          />
        </Box>

        {/* ================= CTA ================= */}
        <Box
          sx={{
            flex: 1,
            width: "100%",

            maxWidth: {
              xs: "100%",
              sm: "90%",
              lg: "500px",
            },

            mx: "auto",

            display: "flex",
            justifyContent: "center",

            // 🔥 เพิ่มระยะห่างตอนเป็น column
            mt: {
              xs: 4,   // 🔥 มือถือ (ห่างลง)
              sm: 6,
              lg: 0,   // desktop ไม่ต้อง
            },
          }}
        >
          <LoanBranchCTA />
        </Box>      </Box>
    </Container>
  );
}