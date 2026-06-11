"use client";

import { Box, MenuItem, TextField, Typography } from "@mui/material";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import useLockPageScroll from "../../form/useLockPageScroll";

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

export default function Tabs<T extends string = string>({
  tabs,
  value,
  onChange,
  gap = 6,
}: Props<T>) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicator, setIndicator] = useState({ left: gap, width: 0 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useLockPageScroll(mobileMenuOpen);

  const updateIndicator = useCallback(() => {
    const active = tabRefs.current[String(value)];
    const container = containerRef.current;

    if (!active || !container) return;

    setIndicator({
      left: active.offsetLeft,
      width: active.offsetWidth,
    });
  }, [value]);

  useLayoutEffect(() => {
    updateIndicator();
  }, [tabs, value, gap, updateIndicator]);

  useEffect(() => {
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [updateIndicator]);

  return (
    <>
      <Box
        sx={{
          display: { xs: "flex", sm: "none" },
          justifyContent: "flex-start",
          width: "100%",
          mb: {
            xs: 3,
            md: 5,
          },
        }}
      >
        <TextField
          select
          size="small"
          value={String(value)}
          onChange={(event) => onChange(event.target.value as T)}
          sx={{
            width: "min(100%, 280px)",
            background: "#fff",
            "& .MuiOutlinedInput-root": {
              borderRadius: "999px",
              color: "var(--light-blue-700)",
              fontWeight: 600,
              "& fieldset": {
                borderColor: "var(--gray-100)",
              },
              "&:hover fieldset": {
                borderColor: "var(--light-blue-500)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "var(--light-blue-500)",
                borderWidth: 2,
              },
            },
            "& .MuiSelect-select": {
              py: 1.25,
              pl: 2.5,
              fontSize: "14px",
            },
          }}
          slotProps={{
            select: {
              onOpen: () => setMobileMenuOpen(true),
              onClose: () => setMobileMenuOpen(false),
              MenuProps: {
                disableScrollLock: true,
                slotProps: {
                  paper: {
                    sx: {
                      mt: 0.5,
                      borderRadius: "16px",


                    },
                  },
                },
              },
            },
          }}
        >
          {tabs.map((t) => (
            <MenuItem key={String(t.value)} value={String(t.value)}>
              <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
                {t.label}
              </Typography>
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Box
        sx={{
          display: { xs: "none", sm: "flex" },
          justifyContent: "center",
          width: "100%",
          mb: 5,
          px: { sm: 2, md: 0 },
          overflowX: "auto",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <Box
          ref={containerRef}
          role="tablist"
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: `${gap}px`,
            width: "fit-content",
            maxWidth: "100%",
            flexShrink: 0,
            p: `${gap}px`,
            borderRadius: "999px",
            border: "1px solid var(--gray-100)",
            background: "#fff",
          }}
        >
          <Box
            aria-hidden
            sx={{
              position: "absolute",
              top: `${gap}px`,
              bottom: `${gap}px`,
              left: indicator.left,
              width: indicator.width,
              borderRadius: "999px",
              background: "var(--light-blue-50)",
              transition:
                "left 0.32s cubic-bezier(0.4, 0, 0.2, 1), width 0.32s cubic-bezier(0.4, 0, 0.2, 1)",
              pointerEvents: "none",
            }}
          />

          {tabs.map((t) => {
            const isActive = value === t.value;

            return (
              <Box
                key={String(t.value)}
                ref={(node: HTMLButtonElement | null) => {
                  tabRefs.current[String(t.value)] = node;
                }}
                component="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onChange(t.value)}
                sx={{
                  appearance: "none",
                  border: 0,
                  outline: 0,
                  position: "relative",
                  zIndex: 1,
                  background: "transparent",
                  borderRadius: "999px",
                  px: { sm: 4, md: 5 },
                  py: { sm: 1.25, md: 1.5 },
                  minWidth: "max-content",
                  flex: "0 0 auto",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: isActive
                    ? "var(--light-blue-500)"
                    : "var(--gray-500)",
                  transition:
                    "background-color 0.25s ease, color 0.25s ease, box-shadow 0.25s ease",
                  "&:hover": {
                    // background: isActive ? "transparent" : "rgba(240, 246, 255, 0.72)",
                    color: "var(--light-blue-500)",
                  },
                  "&:focus-visible": {
                    boxShadow: "0 0 0 3px rgba(47, 128, 237, 0.18)",
                  },
                }}
              >
                <Typography
                  component="span"
                  sx={{
                    fontSize: { sm: "14px", md: "16px" },
                    fontWeight: 600,
                    lineHeight: 1.35,
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}
                >
                  {t.label}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    </>
  );
}
