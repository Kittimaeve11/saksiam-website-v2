"use client";

/* ====================================================== */
import { Box, Typography } from "@mui/material";

/* ====================================================== */
export type TabItem<T = string> = {
  label: string;
  value: T;
};

type Props<T = string> = {
  tabs: TabItem<T>[];
  value: T;
  onChange: (val: T) => void;
  gap?: number;
};

/* ====================================================== */
export default function Tabs<T extends string = string>({
  tabs,
  value,
  onChange,
  gap = 6,
}: Props<T>) {
  const activeIndex = tabs.findIndex((t) => t.value === value);
  const tabWidth = 100 / tabs.length;

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mb: 5 }}>
      <Box
        sx={{
          position: "relative",
          display: "flex",
          borderRadius: "999px",
          border: "1px solid var(--gray-100)",
          background: "#fff",
          overflow: "hidden",
          width: "fit-content",
          p: `${gap}px`,
        }}
      >
        {/* 🔥 SLIDER */}
        <Box
          sx={{
            position: "absolute",
            top: gap,
            bottom: gap,
            left: `calc(${activeIndex * tabWidth}% + ${gap}px)`,
            width: `calc(${tabWidth}% - ${gap * 2}px)`,
            borderRadius: "999px",
            background: "var(--light-blue-50)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />

        {/* 🔥 ITEMS */}
        {tabs.map((t) => {
          const isActive = value === t.value;

          return (
            <Box
              key={String(t.value)}
              onClick={() => onChange(t.value)}
              sx={{
                position: "relative",
                zIndex: 1,
                px: { xs: 3, md: 6 },
                py: 1.5,
                cursor: "pointer",
                minWidth: { xs: 100, md: 160 },

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                color: isActive
                  ? "var(--light-blue-500)"
                  : "var(--gray-500)",

                fontWeight: 600,
                transition: "color 0.25s ease",
              }}
            >
              <Typography sx={{ fontSize: "16px" }}>
                {t.label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}