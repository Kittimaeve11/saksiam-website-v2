"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Box, Grow } from "@mui/material";

const visitedRevealPages = new Set<string>();

type ScrollRevealProps = {
  children: ReactNode;
  delay?: number;
  disabled?: boolean;
  timeout?: number;
};

export function usePageRevealOnce(pageKey: string) {
  const [shouldReveal] = useState(() => {
    const shouldRevealPage = !visitedRevealPages.has(pageKey);

    if (shouldRevealPage) {
      visitedRevealPages.add(pageKey);
    }

    return shouldRevealPage;
  });

  return shouldReveal;
}

export default function ScrollReveal({
  children,
  delay = 0,
  disabled = false,
  timeout = 520,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [revealed, setRevealed] = useState(false);
  const visible = disabled || revealed;

  useEffect(() => {
    if (disabled) return;

    const node = ref.current;
    if (!node || visible) return;
    let delayTimer: ReturnType<typeof setTimeout> | null = null;

    if (!("IntersectionObserver" in window)) {
      delayTimer = setTimeout(() => {
        setRevealed(true);
      }, delay);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        delayTimer = setTimeout(() => {
          setRevealed(true);
        }, delay);
        observer.disconnect();
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.12,
      }
    );

    observer.observe(node);

    return () => {
      if (delayTimer) clearTimeout(delayTimer);
      observer.disconnect();
    };
  }, [delay, disabled, visible]);

  return (
    <Box ref={ref} sx={{ width: "100%" }}>
      <Grow
        in={visible}
        style={{ transformOrigin: "50% 100%" }}
        {...(visible ? { timeout } : {})}
      >
        <Box sx={{ width: "100%" }}>{children}</Box>
      </Grow>
    </Box>
  );
}
