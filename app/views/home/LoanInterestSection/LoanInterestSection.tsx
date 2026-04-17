"use client";

import { Box, Container } from "@mui/material";
import LoanInterestForm from "./LoanInterestForm";
import LoanBranchCTA from "./LoanBranchCTA";

export default function LoanInterestSection({
  provinces,
  amphures,
  tambons,
  services,
}: any) {
  return (
    <Container maxWidth='lg'>
      <Box
        sx={{
          width: "100%",
          maxWidth: "lg",

          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",

          gap: { xs: 6, md: 10 },
        }}
      >
        {/* FORM */}
        <Box sx={{ flex: 1, maxWidth: "600px", width: "100%" }}>
          <LoanInterestForm
            provinces={provinces}
            amphures={amphures}
            tambons={tambons}
            services={services}   // ✅ ต้องส่งมา
          />
        </Box>

        {/* CTA */}
        <Box
          sx={{
            flex: 1,
            maxWidth: "500px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <LoanBranchCTA />
        </Box>
      </Box>
    </Container>
  );
}