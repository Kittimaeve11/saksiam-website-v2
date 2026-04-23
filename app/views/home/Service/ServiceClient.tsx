"use client";

/* ======================================================
   IMPORT
====================================================== */
import { Box, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ServiceCard from "./ServiceCard";
import ServiceSkeletonCard from "./ServiceSkeletonCard";
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
export default function ServiceClient() {
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
        if (!res.ok) throw new Error(`API error: ${res.status}`);

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
     ERROR / EMPTY
  ====================================================== */
  if (error)
    return (
      <div style={{ textAlign: "center", color: "red" }}>
        {error}
      </div>
    );

  if (!loading && !services.length)
    return <div style={{ textAlign: "center" }}>ไม่มีข้อมูล</div>;

  /* ======================================================
     UI
  ====================================================== */
  return (
    <Container maxWidth="lg">
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
      <Box
        sx={{
          display: "grid",
          gap: 3,

          gridTemplateColumns: "1fr",

          "@media (min-width:724px)": {
            gridTemplateColumns: "1fr 1fr",
          },

          "@media (min-width:1166px)": {
            gridTemplateColumns: "1fr 1fr 1fr",
          },
        }}
      >
        {/* ================= SKELETON ================= */}
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <ServiceSkeletonCard key={`skeleton-${i}`} />
          ))}

        {/* ================= REAL DATA ================= */}
        {!loading &&
          services.map((item, index) => {
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
              <Box
                key={item.id}
                className="fade-in"
                sx={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <ServiceCard
                  image={item.image}
                  title={title}
                  description={description}
                />
              </Box>
            );
          })}
      </Box>
    </Container>
  );
}