"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const chromeHiddenRoutes = new Set([
  "/contact-inquiry",
  "/contact-inquiry-project",
]);

type ChromeVisibilityProps = {
  children: ReactNode;
};

export default function ChromeVisibility({ children }: ChromeVisibilityProps) {
  const pathname = usePathname();

  if (chromeHiddenRoutes.has(pathname)) return null;

  return <>{children}</>;
}
