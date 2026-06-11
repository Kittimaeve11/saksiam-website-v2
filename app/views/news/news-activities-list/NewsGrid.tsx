"use client";

/* ====================================================== */
import { Box } from "@mui/material";
import NewsCardItem from "@/app/components/cards/NewsCard/NewsCardItem";

/* ====================================================== */
type News = {
  id: string | number;
  categoryTH: string;
  categoryEN: string;
  titleTH: string;
  titleEN: string;
  createdAt: string;
  images: string[];
  views?: number;
};

type Props = {
  data: News[];
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
      md: "repeat(3,1fr)",
    },
    gap: 3,
    mt: 4,

    px: {
      xs: 2,
      sm: 3,
      md: 4,
      lg: 5,
    },
  }}
>
  {data.map((item) => (
    <NewsCardItem key={item.id} item={item} />
  ))}
</Box>
    
  );
}
