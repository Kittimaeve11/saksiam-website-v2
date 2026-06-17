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
      }}
    >
      <EachBanner num={4} />

      <Container
        maxWidth={false}
        sx={{
          position: "relative",
          overflow: "hidden",
          px: { xs: 2, md: 3 },
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            zIndex: 0,
            backgroundImage:
              'url("/background/23655cd5-6444-4153-bd07-b3f71a81e34c.png")',
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center bottom",
            backgroundSize: "100% auto",
            pointerEvents: "none",
          },
        }}
      >
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <FaqContent />
        </Box>
      </Container>
    </Box>
  );
}
