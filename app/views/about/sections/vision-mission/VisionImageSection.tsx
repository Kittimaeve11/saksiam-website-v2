import { Box, Container } from "@mui/material";

import AboutMenuBanner from "@/app/components/ui/Banner/AboutMenuBanner";

export default function VisionImageSection() {
  return (
    <Box component="section" sx={{ py: { xs: 3, md: 4 } }}>
      <Container maxWidth="lg">
        <AboutMenuBanner num={15} />
      </Container>
    </Box>
  );
}
