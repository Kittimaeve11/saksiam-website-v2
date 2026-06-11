import { Box, Container } from "@mui/material";

import EachBanner from "@/app/components/ui/Banner/EachBanner";
import FaqContent from "@/app/views/faq/FaqContent";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Box
      sx={{
        backgroundColor: "white",
        minHeight: "100vh",
        backgroundSize: "100% auto",
      }}
    >
      <EachBanner num={4} />

      <Container maxWidth="xl">
        <FaqContent />
      </Container>
    </Box>
  );
}
