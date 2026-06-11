"use client";

/* ====================================================== */
import { useState } from "react";
import { Box } from "@mui/material";
import type { FaqItem } from "@/app/Utils/type";
import FaqCard from "./FaqCard";

type Props = {
  data: FaqItem[];
};

/* ====================================================== */
export default function FaqList({ data }: Props) {
  const [open, setOpen] = useState<number | null>(null);

  /* ======================================================
     HANDLE TOGGLE
  ====================================================== */
  const handleToggle = (id: number) => {
    setOpen((prev) => (prev === id ? null : id));
  };

  /* ======================================================
     RENDER
  ====================================================== */
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { xs: "100%", md: "100%" },
        mx: "auto",
      }}
    >
      {data.map((item, index) => {
        const isLast = index === data.length - 1;

        return (
          <FaqCard
            key={item.id}
            item={item}
            isOpen={open === item.id}
            onToggle={handleToggle}
            isLast={isLast}
          />
        );
      })}
    </Box>
  );
}
