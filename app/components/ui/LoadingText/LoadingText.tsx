"use client";

import { Box } from "@mui/material";
import type { ReactNode } from "react";

type LoadingTextProps = {
  text?: ReactNode;
  className?: string;
};

export default function LoadingText({
  text = "Loading",
  className,
}: LoadingTextProps) {
  return (
    <Box
      component="span"
      className={["loading-text", className].filter(Boolean).join(" ")}
      sx={{
        display: "inline-flex",
        alignItems: "baseline",
        whiteSpace: "nowrap",
      }}
    >
      <span>{text}</span>
      <span className="loading-dots" aria-hidden="true">
        <span>.</span>
        <span>.</span>
        <span>.</span>
      </span>
    </Box>
  );
}
