"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const SCROLL_RESTORE_KEY = "saksiam-scroll-restore";
const ABOUT_TARGET_KEY = "saksiam-about-target";
const RESTORE_CLASS = "scroll-restore-pending";
const REFRESH_FADE_CLASS = "page-refresh-fade-pending";
const ABOUT_TARGET_CLASS = "about-target-pending";
const RESTORE_MAX_AGE = 60000;
const RESTORE_SETTLE_TIMEOUT = 4500;
const RESTORE_STABLE_FRAMES = 14;

export default function NavigationRestore() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const showPage = () => {
      window.requestAnimationFrame(() => {
        document.documentElement.classList.remove(RESTORE_CLASS);
        document.documentElement.classList.remove(REFRESH_FADE_CLASS);
        document.documentElement.classList.remove(ABOUT_TARGET_CLASS);
      });
    };

    const footerTargetRaw = window.sessionStorage.getItem(ABOUT_TARGET_KEY);
    if (footerTargetRaw) {
      try {
        const footerTarget = JSON.parse(footerTargetRaw) as {
          href?: string;
          time?: number;
        };
        const footerHref =
          typeof footerTarget.href === "string" ? footerTarget.href : "";
        const isFreshFooterTarget =
          !!footerHref &&
          typeof footerTarget.time === "number" &&
          Date.now() - footerTarget.time < 10000;

        if (isFreshFooterTarget && footerHref.startsWith("/about")) {
          return;
        }

        if (isFreshFooterTarget) {
          window.requestAnimationFrame(() => {
            window.scrollTo({ top: 0, behavior: "auto" });
            window.requestAnimationFrame(() => {
              window.sessionStorage.removeItem(ABOUT_TARGET_KEY);
              showPage();
            });
          });
          return;
        }
      } catch {
        window.sessionStorage.removeItem(ABOUT_TARGET_KEY);
      }
    }

    const getPageKey = () => `${window.location.pathname}${window.location.search}`;
    let isRestoring = false;
    const saveScroll = () => {
      if (isRestoring) return;

      window.sessionStorage.setItem(
        SCROLL_RESTORE_KEY,
        JSON.stringify({
          page: getPageKey(),
          y: window.scrollY,
          time: Date.now(),
        })
      );
    };
    let saveFrame = 0;
    const saveScrollSoon = () => {
      if (saveFrame) return;
      saveFrame = window.requestAnimationFrame(() => {
        saveFrame = 0;
        saveScroll();
      });
    };

    const restoreScroll = () => {
      const raw = window.sessionStorage.getItem(SCROLL_RESTORE_KEY);
      if (!raw) {
        showPage();
        return;
      }

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
          Date.now() - data.time < RESTORE_MAX_AGE;

        if (!shouldRestore) {
          showPage();
          return;
        }

        if ("scrollRestoration" in window.history) {
          window.history.scrollRestoration = "manual";
        }

        isRestoring = true;
        const startedAt = Date.now();
        let tries = 0;
        let didShowPage = false;
        let lastHeight = 0;
        let stableFrames = 0;

        const finishRestore = () => {
          isRestoring = false;
          window.sessionStorage.removeItem(SCROLL_RESTORE_KEY);
          showPage();
        };

        const restoreWhenReady = () => {
          const documentHeight = document.documentElement.scrollHeight;
          const maxScroll = Math.max(0, documentHeight - window.innerHeight);
          const targetY = Math.min(data.y!, maxScroll);
          const canReachTarget = maxScroll >= data.y!;
          const timedOut = Date.now() - startedAt >= RESTORE_SETTLE_TIMEOUT;

          window.scrollTo(0, targetY);

          if (!didShowPage && (canReachTarget || tries >= 12 || timedOut)) {
            didShowPage = true;
            showPage();
          }

          if (documentHeight === lastHeight) {
            stableFrames += 1;
          } else {
            stableFrames = 0;
            lastHeight = documentHeight;
          }

          if ((didShowPage && stableFrames >= RESTORE_STABLE_FRAMES) || timedOut) {
            window.scrollTo(0, targetY);
            finishRestore();
            return;
          }

          tries += 1;
          window.requestAnimationFrame(restoreWhenReady);
        };

        restoreWhenReady();
      } catch {
        showPage();
      }
    };

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    restoreScroll();

    window.addEventListener("scroll", saveScrollSoon, { passive: true });
    window.addEventListener("beforeunload", saveScroll);
    window.addEventListener("pagehide", saveScroll);

    return () => {
      if (saveFrame) window.cancelAnimationFrame(saveFrame);
      window.removeEventListener("scroll", saveScrollSoon);
      window.removeEventListener("beforeunload", saveScroll);
      window.removeEventListener("pagehide", saveScroll);
    };
  }, [pathname, searchParams]);

  return null;
}
