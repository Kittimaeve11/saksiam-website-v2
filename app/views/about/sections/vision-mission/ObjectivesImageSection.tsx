import { Box, Container, Typography } from "@mui/material";

import AboutMenuBanner from "@/app/components/ui/Banner/AboutMenuBanner";

export default function ObjectivesImageSection() {
  return (
    <Box component="section" sx={{ py: { xs: 3, md: 4 } }}>
      <Container maxWidth="lg">
        {/* แสดงเฉพาะ Mobile และ Tablet ที่เล็กกว่า md */}
        <Box
          component="section"
          sx={{
            width: "100%",
            py: { xs: 4, md: 0 },
            display: { xs: "block", md: "none" },
          }}
        >
          <Typography
            component="h2"
            sx={{
              color: "var(--color-primary)",
              fontSize: { xs: 32, md: 36 },
              fontWeight: 800,
              textAlign: "center",
              // mb: { xs: 1, md: 0 },
              lineHeight: 1.25,
            }}
          >
            เป้าประสงค์
          </Typography>
        </Box>

        <AboutMenuBanner num={14} />
      </Container>
    </Box>
  );
}