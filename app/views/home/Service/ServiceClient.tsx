"use client";

/* ======================================================
   IMPORT
====================================================== */

import { Box, Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import ServiceCard from "./ServiceCard";
import { useLocale } from "@/app/providers/LocaleContext";

/* ======================================================
   TYPE
====================================================== */

type Service = {
  id: number;
  image: string;
  titleTH: string;
  titleENG: string;
  descriptionTH: string;
  descriptionENG: string;
};

/* ======================================================
   COMPONENT
====================================================== */

export default function ServiceList() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { locale } = useLocale();

  /* ======================================================
     🔥 FIX: ลบเฉพาะ (นาโนไฟแนนซ์)
  ====================================================== */
  const removeNano = (text: string) => {
    return text.replace(/\s*\(นาโนไฟแนนซ์\)/g, "");
  };

  /* ======================================================
     FETCH API
  ====================================================== */
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/service");

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }

        const data = await res.json();
        setServices(data.services || []);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError("โหลดข้อมูลไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  /* ======================================================
     STATE UI
  ====================================================== */

  if (loading)
    return <div style={{ textAlign: "center" }}>Loading...</div>;

  if (error)
    return (
      <div style={{ textAlign: "center", color: "red" }}>
        {error}
      </div>
    );

  if (!services.length)
    return <div style={{ textAlign: "center" }}>ไม่มีข้อมูล</div>;

  /* ======================================================
     UI
  ====================================================== */

  return (
    <Container maxWidth='lg'>
      {/* TITLE */}
      <Box sx={{ textAlign: "center", mb: 7 }}>
        <Typography
          sx={{
            display: "inline-block",
            fontSize: 40,
            fontWeight: 800,
            background:
              "linear-gradient(90deg, #243865 0%, #4871CB 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {locale === "th" ? "บริการสินเชื่อ" : "Loan Services"}
        </Typography>
      </Box>

      {/* GRID */}
      <Box sx={{ px: { xs: 2, md: 3 } }}>
        <Grid container spacing={3}>
          {services.map((item) => {
            const titleRaw =
              locale === "th" ? item.titleTH : item.titleENG;

            const title =
              locale === "th"
                ? removeNano(titleRaw)
                : titleRaw;

            const description =
              locale === "th"
                ? item.descriptionTH
                : item.descriptionENG;

            return (
              <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <ServiceCard
                  image={item.image}
                  title={title}
                  description={description}
                />
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Container>
  );
}