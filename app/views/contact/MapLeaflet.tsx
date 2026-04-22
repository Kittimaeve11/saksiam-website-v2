"use client";

/* ====================================================== */
import {
  MapContainer,
  TileLayer,
  Marker,
  ZoomControl,
} from "react-leaflet";
import { useEffect, useState } from "react";
import type { Icon, LatLngExpression } from "leaflet";
import { Link as MuiLink } from "@mui/material";
import "leaflet/dist/leaflet.css";

/* ====================================================== */
const position: LatLngExpression = [17.6226885, 100.0870427];
const GOOGLE_MAP_URL = "https://maps.app.goo.gl/UJ1ktCnqjmXtsqEJA";

/* ====================================================== */
export default function MapLeaflet() {
  const [icon, setIcon] = useState<Icon | null>(null);

  useEffect(() => {
    import("leaflet").then((L) => {
      const customIcon = new L.Icon({
        iconUrl: "/Icons/image.png",
        iconSize: [50, 50],
        iconAnchor: [25, 50],
      });

      setIcon(customIcon);
    });
  }, []);

  if (!icon) return null;

  return (
    <div
      style={{
        width: "100%",
        height: "400px", // 🔥 fix error leaflet
        position: "relative",
      }}
    >
      {/* ================= MAP ================= */}
      <MapContainer
        center={position}
        zoom={18}
        zoomControl={false}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
        />

        {/* 🔥 ปุ่มซูม */}
        <ZoomControl position="bottomright" />

        {/* 🔥 MARKER คลิกแล้วไป Google */}
        <Marker
          position={position}
          icon={icon}
          eventHandlers={{
            click: () => {
              window.open(GOOGLE_MAP_URL, "_blank");
            },
          }}
        />
      </MapContainer>

      {/* ================= INFO BOX ================= */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          background: "#fff",
          borderRadius: "12px",
          padding: "16px",
          width: "320px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          zIndex: 1001,
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 16 }}>
          บริษัท ศักดิ์สยามลิสซิ่ง จำกัด (มหาชน)
        </div>

        <div style={{ fontSize: 14, color: "#666", marginTop: 8 }}>
          49/47 ถนน เจษฎาบดินทร์<br />
          ตำบลท่าอิฐ อำเภอเมืองอุตรดิตถ์<br />
          จังหวัดอุตรดิตถ์ 53000
        </div>

        {/* 🔥 ใช้ MUI Link */}
        <MuiLink
          href={GOOGLE_MAP_URL}
          target="_blank"
          underline="none"
          sx={{
            mt: 1.5,
            display: "inline-block",
            background: "#1a73e8",
            color: "#fff",
            px: 2,
            py: 1,
            borderRadius: "8px",
            fontSize: 14,
            fontWeight: 500,
            "&:hover": {
              background: "#1558b0",
            },
          }}
        >
          นำทาง
        </MuiLink>
      </div>
    </div>
  );
}