"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function MapInteractionController() {
  const map = useMap();

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    map.scrollWheelZoom.disable();

    const container = map.getContainer();

    const handleMouseEnter = () => {
      timer = setTimeout(() => {
        map.scrollWheelZoom.enable();
      }, 1000);
    };

    const handleMouseLeave = () => {
      if (timer) clearTimeout(timer);

      map.scrollWheelZoom.disable();
    };

    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener(
        "mouseenter",
        handleMouseEnter
      );

      container.removeEventListener(
        "mouseleave",
        handleMouseLeave
      );

      if (timer) clearTimeout(timer);
    };
  }, [map]);

  return null;
}