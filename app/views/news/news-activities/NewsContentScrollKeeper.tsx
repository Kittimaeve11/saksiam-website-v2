"use client";

import { ReactNode, useEffect, useLayoutEffect } from "react";

const NEWS_CONTENT_SCROLL_KEY = "saksiam-news-content-scroll";
const MAX_SCROLL_AGE = 15000;

const getPageKey = () => `${window.location.pathname}${window.location.search}`;

const saveScroll = () => {
  if (window.location.pathname !== "/news") return;

  window.sessionStorage.setItem(
    NEWS_CONTENT_SCROLL_KEY,
    JSON.stringify({
      page: getPageKey(),
      y: window.scrollY,
      time: Date.now(),
    })
  );
};

export function NewsContentScrollTracker() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    saveScroll();
    window.addEventListener("scroll", saveScroll, { passive: true });

    return () => {
      saveScroll();
      window.removeEventListener("scroll", saveScroll);
    };
  }, []);

  return null;
}

export function NewsContentScrollRestorer({
  children,
}: {
  children: ReactNode;
}) {
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const raw = window.sessionStorage.getItem(NEWS_CONTENT_SCROLL_KEY);
    if (!raw) return;

    try {
      const data = JSON.parse(raw) as {
        page?: string;
        y?: number;
        time?: number;
      };
      const shouldRestore =
        data.page === getPageKey() &&
        typeof data.y === "number" &&
        data.y > 0 &&
        typeof data.time === "number" &&
        Date.now() - data.time < MAX_SCROLL_AGE;

      if (!shouldRestore) {
        window.sessionStorage.removeItem(NEWS_CONTENT_SCROLL_KEY);
        return;
      }

      const restore = () => {
        const maxScroll = Math.max(
          0,
          document.documentElement.scrollHeight - window.innerHeight
        );

        window.scrollTo(0, Math.min(data.y!, maxScroll));
      };

      restore();
      window.requestAnimationFrame(restore);
      window.setTimeout(() => {
        restore();
        window.sessionStorage.removeItem(NEWS_CONTENT_SCROLL_KEY);
      }, 80);
    } catch {
      window.sessionStorage.removeItem(NEWS_CONTENT_SCROLL_KEY);
    }
  }, []);

  return children;
}
