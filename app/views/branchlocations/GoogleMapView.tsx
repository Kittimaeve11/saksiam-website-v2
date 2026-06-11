"use client";

import React, { useEffect, useRef, useState } from "react";
import { LongdoMap, Marker, Popup } from "longdomap-react";
import { Box } from "@mui/material";
import { branchlocationsItem } from "@/app/Utils/type";
import { dataBranchType } from "@/app/Utils/branchType";

interface GoogleMapProps {
  selectedMarker: branchlocationsItem | null;
  branches: branchlocationsItem[];
  onSelectMarker: (item: branchlocationsItem) => void;
}

const DEFAULT_CENTER = {
  lon: 100.08701,
  lat: 17.62269,
};
const DEFAULT_ZOOM = 8;
const SELECTED_ZOOM = 15;

type MapPoint = {
  lon: number;
  lat: number;
};

type LongdoOverlay = {
  location: () => MapPoint;
};

type LongdoMapInstance = {
  location: {
    (): MapPoint;
    (target: MapPoint, animate?: boolean): void;
  };
  zoom: (zoom: number) => void;
  Overlays: {
    clear: () => void;
  };
  Ui: Record<
    | "DPad"
    | "Zoombar"
    | "Geolocation"
    | "Terrain"
    | "LayerSelector"
    | "Crosshair"
    | "Scale",
    { visible: (value: boolean) => void }
  >;
  Event: {
    bind: (eventName: string, callback: (overlay: LongdoOverlay) => void) => void;
  };
};

const GoogleMapView: React.FC<GoogleMapProps> = ({
  branches = [],
  selectedMarker,
  onSelectMarker
}) => {
  const mapRef = useRef<LongdoMapInstance | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const branchesRef = useRef<branchlocationsItem[]>([]);
  const onSelectMarkerRef = useRef<(b: branchlocationsItem) => void>(() => { });
  const moveMapSafe = (map: LongdoMapInstance, target: MapPoint) => {
    let attempts = 0;

    const tryMove = () => {
      attempts++;

      map.location(target, true);

      const current = map.location();

      const isMoved =
        Math.abs(current.lon - target.lon) < 0.0001 &&
        Math.abs(current.lat - target.lat) < 0.0001;

      if (isMoved) {
        return;
      }

      if (attempts < 10) {
        setTimeout(tryMove, 200);
      }
    };

    tryMove();
  };
  const moveMapWithLock = (map: LongdoMapInstance, target: MapPoint, zoom: number) => {
    const scrollY = window.scrollY;

    setTimeout(() => {
      moveMapSafe(map, target);
      map.zoom(zoom);

      // 🔥 restore scroll
      window.scrollTo({
        top: scrollY,
        behavior: "auto",
      });
    }, 0);
  };


  useEffect(() => {
    // =========================
    // 🔁 sync ref (ต้องทำก่อน)
    // =========================
    onSelectMarkerRef.current = onSelectMarker;
    branchesRef.current = branches;

    // =========================
    // 🚫 guard map
    // =========================
    if (!mapReady || !mapRef.current) return;

    const map = mapRef.current;

    // =========================
    // 1. focus selectedMarker
    // =========================
    if (selectedMarker) {
      const lon = Number(selectedMarker.lng);
      const lat = Number(selectedMarker.lat);

      if (Number.isNaN(lon) || Number.isNaN(lat)) return;
      moveMapWithLock(map, { lon, lat }, SELECTED_ZOOM);
      return;
    }

    // =========================
    // 2. center จาก branches
    // =========================
    if (branches.length > 0) {
      map.Overlays.clear(); // ✅ clear ทุกครั้งที่ data เปลี่ยน

      const validBranches = branches.filter(
        (b) =>
          !Number.isNaN(Number(b.lat)) &&
          !Number.isNaN(Number(b.lng))
      );

      if (validBranches.length === 0) return;

      const avgLat =
        validBranches.reduce((sum, b) => sum + Number(b.lat), 0) /
        validBranches.length;

      const avgLon =
        validBranches.reduce((sum, b) => sum + Number(b.lng), 0) /
        validBranches.length;
      moveMapWithLock(
        map,
        { lon: avgLon, lat: avgLat },
        validBranches.length === 1 ? SELECTED_ZOOM : DEFAULT_ZOOM
      );

      return;
    }
    map.location(DEFAULT_CENTER, true);
    map.zoom(DEFAULT_ZOOM);

  }, [
    selectedMarker?.id,
    branches,
    mapReady,
    onSelectMarker // ✅ ต้องใส่ ไม่งั้น ref ไม่ update
  ]);


  const getTitle = (item: branchlocationsItem) => {
    const type = Number(item.type);

    const label = dataBranchType.find(t => t.id === type)?.labelname || "";

    return type === 1 || type === 2
      ? `${label}${item.name}`.trim()
      : item.name;
  };
  return (
    <Box
      sx={{
        borderRadius: 4,
        overflow: "hidden",
        height: {
          xs: 400,
          md: 650,
        },
      }}
    >
      <LongdoMap
       
        apiKey={process.env.NEXT_PUBLIC_API_KEYLOCATIONMAP!}
        location={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        mapObj={(map) => {
          const longdoMap = map as unknown as LongdoMapInstance;

          mapRef.current = longdoMap;
          longdoMap.Ui.DPad.visible(false);
          longdoMap.Ui.Zoombar.visible(false);
          longdoMap.Ui.Geolocation.visible(false);
          longdoMap.Ui.Terrain.visible(false);
          longdoMap.Ui.LayerSelector.visible(false);
          longdoMap.Ui.Crosshair.visible(false);
          longdoMap.Ui.Scale.visible(false);


          longdoMap.Event.bind("overlayClick", (overlay) => {
            const pos = overlay.location();
            const found = branchesRef.current.find(
              (b) =>
                Math.abs(Number(b.lat) - pos.lat) < 0.0001 &&
                Math.abs(Number(b.lng) - pos.lon) < 0.0001
            );

            if (!found) {
              return;
            }
            onSelectMarkerRef.current({
              ...found,
              lat: Number(found.lat),
              lng: Number(found.lng),
            });
          });

          setMapReady(true);
        }}
          height="100%"
      >

        {Array.isArray(branches) &&
          branches.map((item) => {
            const lon = Number(item.lng);
            const lat = Number(item.lat);
            if (Number.isNaN(lon) || Number.isNaN(lat)) return null;
            const isSelected = selectedMarker?.id === item.id;

            return (
              <Marker
                key={`${item.id}-${branches.length}`}
                position={{ lon, lat }}
                icon={{
                  url: isSelected ? "/Icons/pin-active.png" : "/Icons/pin.png",
                  offset: { x: 0, y: 0 },
                }}
                title={getTitle(item)}
                detail={`
  <div style="
    font-family: sans-serif;
    line-height:1.5;
    padding:8px;
    min-width:220px;
  ">
    <div style="color:#555;font-size:12px;">
      ${item.detail || ""}
    </div>

    <div style="margin-top:6px;font-size:12px;">
      ${[
                    item.address,
                    item.districtname ? `ต.${item.districtname}` : "",
                    item.amphurname ? `อ.${item.amphurname}` : "",
                    item.provincename ? `จ.${item.provincename}` : "",
                    item.zipcode || "",
                  ].filter(Boolean).join(" ")}
    </div>

    ${item.tel
                    ? `<div style="margin-top:4px;font-size:12px;">📞 ${item.tel}</div>`
                    : ""
                  }

    ${item.lat && item.lng
                    ? `<a 
            href="https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}" 
            target="_blank"
            style="
              display:block;
              margin-top:8px;
              padding:6px;
              text-align:center;
              background:#1976d2;
              color:#fff;
              border-radius:6px;
              text-decoration:none;
              font-size:12px;
            "
          >
             ดูเส้นทาง
          </a>`
                    : ""
                  }

  </div>
`}

                draggable={false}
                visibleRange={{ min: 1, max: 20 }}

              />
            );
          })}

        {/* ─── Popup ของ marker ที่ถูกเลือก ─── */}
        {selectedMarker &&
          !Number.isNaN(Number(selectedMarker.lng)) &&
          !Number.isNaN(Number(selectedMarker.lat)) && (
            <Popup
              position={{
                lon: Number(selectedMarker.lng),
                lat: Number(selectedMarker.lat),
              }}
              title={getTitle(selectedMarker)}
              detail={`
  <div style="
    font-family: sans-serif;
    line-height:1.5;
    padding:8px;
    min-width:220px;
  ">
    <div style="color:#555;font-size:12px;">
      ${selectedMarker.detail || ""}
    </div>

    <div style="margin-top:6px;font-size:12px;">
      ${[
                  selectedMarker.address,
                  selectedMarker.districtname ? `ต.${selectedMarker.districtname}` : "",
                  selectedMarker.amphurname ? `อ.${selectedMarker.amphurname}` : "",
                  selectedMarker.provincename ? `จ.${selectedMarker.provincename}` : "",
                  selectedMarker.zipcode || "",
                ].filter(Boolean).join(" ")}
    </div>

    ${selectedMarker.tel
                  ? `<div style="margin-top:4px;font-size:12px;">📞 ${selectedMarker.tel}</div>`
                  : ""
                }

    ${selectedMarker.lat && selectedMarker.lng
                  ? `<a 
            href="https://www.google.com/maps/dir/?api=1&destination=${selectedMarker.lat},${selectedMarker.lng}" 
            target="_blank"
            style="
              display:block;
              margin-top:8px;
              padding:6px;
              text-align:center;
              background:#1976d2;
              color:#fff;
              border-radius:6px;
              text-decoration:none;
              font-size:12px;
            "
          >
          ดูเส้นทาง
          </a>`
                  : ""
                }

  </div>
`}
            />
          )}

      </LongdoMap>

    </Box>
  );
};

export default GoogleMapView;
