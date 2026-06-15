"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  ZoomControl,
} from "react-leaflet";
import { useEffect, useState } from "react";
import type { Icon, LatLngExpression } from "leaflet";
import {
  Box,
  Link as MuiLink,
  Typography,
} from "@mui/material";
import NearMeIcon from "@mui/icons-material/NearMe";
import MapInteractionController from "./MapInteractionController";

import "leaflet/dist/leaflet.css";

/* ======================================================
   CONSTANTS
====================================================== */
const position: LatLngExpression = [17.6226885, 100.0870427];

const GOOGLE_MAP_URL =
  "https://maps.app.goo.gl/UJ1ktCnqjmXtsqEJA";

/* ======================================================
   COMPONENT
====================================================== */
export default function MapLeaflet() {
  const [icon, setIcon] = useState<Icon | null>(null);

  /* ======================================================
     LOAD LEAFLET ICON
  ====================================================== */
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
    <Box
      sx={{
        width: "100%",
        height: {
          xs: 500,
          sm: 520,
          md: 430,
          lg: 400,
        },

        position: "relative",
        overflow: "hidden",
        borderRadius: 3,
      }}
    >
      {/* ======================================================
          MAP
      ====================================================== */}
      <MapContainer
        center={position}
        zoom={18}
        zoomControl={false}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <MapInteractionController />

        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
        />

        <ZoomControl position="bottomright" />

        <Marker
          position={position}
          icon={icon}
          eventHandlers={{
            click: () => {
              window.open(
                GOOGLE_MAP_URL,
                "_blank",
                "noopener,noreferrer"
              );
            },
          }}
        />
      </MapContainer>

      {/* ======================================================
          INFO BOX
      ====================================================== */}
      <Box
        sx={{
          position: "absolute",

          top: {
            xs: 10,
            sm: 16,
            md: 20,
          },

          left: {
            xs: 10,
            sm: 16,
            md: 20,
          },

          /* ======================================================
             FIX IPAD WIDTH
             - ไม่ยืดเต็มจอ
             - จำกัดความกว้าง
          ====================================================== */
          width: {
            xs: "calc(100% - 20px)",
            sm: 360,
            md: 340,
          },

          maxWidth: {
            xs: "unset",
            sm: "85%",
            md: 340,
          },

          bgcolor: "#fff",
          borderRadius: 3,

          p: {
            xs: 1.8,
            sm: 2,
            md: 2.2,
          },

          boxShadow: "0 10px 30px rgba(0,0,0,0.20)",
          zIndex: 1001,
        }}
      >
        {/* ======================================================
           TITLE
        ====================================================== */}
        <Typography
          sx={{
            fontWeight: 700,

            fontSize: {
              xs: 14,
              sm: 15,
              md: 18,
            },

            lineHeight: 1.4,
            color: "#102E50",
          }}
        >
          บริษัท ศักดิ์สยามลิสซิ่ง จำกัด (มหาชน)
        </Typography>

        {/* ======================================================
           ADDRESS
        ====================================================== */}
        <Typography
          sx={{
            mt: 1,

            color: "#666",
            lineHeight: 1.7,

            fontSize: {
              xs: 12,
              sm: 13,
              md: 14,
            },
          }}
        >
          49/47 ถนนเจษฎาบดินทร์
          <br />
          ตำบลท่าอิฐ อำเภอเมืองอุตรดิตถ์
          <br />
          จังหวัดอุตรดิตถ์ 53000
        </Typography>

        {/* ======================================================
           BUTTON
        ====================================================== */}
        <Box
          sx={{
            mt: 1.5,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <MuiLink
            href={GOOGLE_MAP_URL}
            target="_blank"
            underline="none"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,

              bgcolor: "#1A73E8",
              color: "#fff",

              px: {
                xs: 1.8,
                md: 2,
              },

              py: {
                xs: 0.8,
                md: 1,
              },

              borderRadius: "20px",

              fontSize: {
                xs: 13,
                md: 14,
              },

              fontWeight: 600,

              boxShadow:
                "0 2px 6px rgba(0,0,0,0.15)",

              transition: "0.2s",

              "&:hover": {
                bgcolor: "#1558B0",
              },
            }}
          >
            <NearMeIcon
              sx={{
                fontSize: {
                  xs: 16,
                  md: 18,
                },
              }}
            />
            นำทาง
          </MuiLink>
        </Box>
      </Box>
    </Box>
  );
}