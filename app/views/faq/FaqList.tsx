"use client";

/* ====================================================== */
import { useState } from "react";
import { Box } from "@mui/material";
import FaqCard from "./FaqCard";

/* ====================================================== */
type FAQ = {
  id: number;
  category: "loan" | "contact";
  questionTH: string;
  questionEN: string;
  answerTH: string;
  answerEN: string;
};

type Props = {
  data: FAQ[];
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
    <Box>
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