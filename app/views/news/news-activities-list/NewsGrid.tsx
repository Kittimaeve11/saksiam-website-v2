"use client";

/* ====================================================== */
import { Box } from "@mui/material";
import NewsCardItem from "@/app/components/cards/NewsCard/NewsCardItem";

/* ====================================================== */
type Props = {
  data: any[];
};

/* ====================================================== */
export default function NewsGrid({ data }: Props) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2,1fr)",
          md: "repeat(3,1fr)", // 🔥 ปรับให้เหมาะกับ card ใหม่
        },
        gap: 5, // 🔥 เพิ่มระยะให้ดูโปรขึ้น
        mt: 4,
      }}
    >
      {data.map((item) => (
        <NewsCardItem key={item.id} item={item} />
      ))}
    </Box>
  );
}