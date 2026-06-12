"use client";

import { useEffect } from "react";
import { clearApiMemoryCache } from "../api/client";

export default function ApiCacheReset() {
  useEffect(() => {
    const clearCache = () => {
      clearApiMemoryCache();
    };

    window.addEventListener("beforeunload", clearCache);
    window.addEventListener("pagehide", clearCache);

    return () => {
      window.removeEventListener("beforeunload", clearCache);
      window.removeEventListener("pagehide", clearCache);
      clearCache();
    };
  }, []);

  return null;
}
