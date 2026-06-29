"use client";

import { Box, Container } from "@mui/material";
import LoanInterestForm from "./LoanInterestForm";
import LoanBranchCTA from "./LoanBranchCTA";

export default function LoanInterestSection() {
  return (
    <Container maxWidth='lg'>
      <Box
        sx={{
          width: "100%",
          maxWidth: "lg",

          display: "flex",
          flexDirection: {
            xs: "column",
            lg: "row",
          },
          alignItems: "center",
          justifyContent: "space-between",

          gap: { xs: 6, md: 10 },
        }}
      >
        {/* FORM */}
        <Box
          sx={{
            flex: 1,
            maxWidth: "600px",
            width: "100%",
            position: "relative",
            isolation: "isolate",
            "&::before": {
              content: '""',
              display: { xs: "none", md: "block" },
              position: "absolute",
              width: { md: 170, lg: 200 },
              height: { md: 170, lg: 200 },
              top: { md: -34, lg: -42 },
              right: { md: -44, lg: -56 },
              borderRadius: "50%",
              background: "rgba(67, 105, 190, 0.28)",
              filter: "blur(52px)",
              opacity: 0.55,
              pointerEvents: "none",
              zIndex: -1,
            },
            "&::after": {
              content: '""',
              display: { xs: "none", md: "block" },
              position: "absolute",
              width: { md: 180, lg: 220 },
              height: { md: 180, lg: 220 },
              left: { md: -52, lg: -68 },
              bottom: { md: -48, lg: -64 },
              borderRadius: "50%",
              background: "rgba(251, 213, 63, 0.3)",
              filter: "blur(56px)",
              opacity: 0.52,
              pointerEvents: "none",
              zIndex: -1,
            },
          }}
        >
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <LoanInterestForm />
          </Box>
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
