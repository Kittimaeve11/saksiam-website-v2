import { Box, Typography } from "@mui/material";

export default function CorporatePhilosophySection() {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 4, md: 5 },

        // เว้นพื้นที่ด้านล่างให้ Banner ลอยขึ้นมาได้
        pb: { xs: 12, md: 20 },

        textAlign: "center",

        position: "relative",

        // สำคัญ: ให้ข้อความอยู่เหนือ Banner
        zIndex: 10,
      }}
    >
      <Typography
        component="h2"
        sx={{
          color: "var(--color-primary)",
          fontSize: { xs: 28, md: 36 },
          fontWeight: 800,
          mb: 1.5,

          position: "relative",
          zIndex: 10,
        }}
      >
        ปรัชญาองค์กร
      </Typography>

      <Typography
        sx={{
          color: "var(--color-secondary-hover)",
          fontSize: { xs: 18, md: 24 },
          fontWeight: 800,
          lineHeight: 1.5,

          position: "relative",
          zIndex: 10,
        }}
      >
        สร้างรากฐาน สร้างงาน สร้างคน
      </Typography>
    </Box>
  );
}