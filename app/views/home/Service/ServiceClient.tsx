"use client";

/* ======================================================
   IMPORT
====================================================== */

import { Box, Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import ServiceCard from "./ServiceCard";
import ServiceSkeletonCard from "./ServiceSkeletonCard";
import { useLocale } from "@/app/providers/LocaleContext";
import { apiFetch, getCachedApiResponse } from "@/app/api/client";
import { loanItem } from "@/app/Utils/type";
import { useRouter } from "next/navigation";

/* ======================================================
   COMPONENT
====================================================== */

export default function ServiceClient() {
  const endpoint = "/api/listloanappapi";
  const cached = getCachedApiResponse<loanItem[]>(endpoint);
  const [services, setServices] = useState<loanItem[]>(cached?.data || []);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState<string | null>(null);

  const { locale } = useLocale();
  const router = useRouter();

  /* ======================================================
     REMOVE NANO TEXT
  ====================================================== */

  const removeNano = (text: string) => {
    return text.replace(/\s*\(นาโนไฟแนนซ์\)/g, "");
  };

  /* ======================================================
     FETCH DATA
  ====================================================== */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cached = getCachedApiResponse<loanItem[]>(endpoint);
        if (cached) {
          setServices(cached.data || []);
          setLoading(false);
          return;
        }

        const res = await apiFetch<loanItem[]>(endpoint);

        if (!res.status) {
          throw new Error(res.message || "API error");
        }

        setServices(res.data || []);
      } catch (err) {
        console.error("fetch error:", err);
        setError("โหลดข้อมูลไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  /* ======================================================
     CLICK
  ====================================================== */

  const handleClick = async (item: loanItem) => {
    try {
      const payloadlog = {
        actionType: 1,
        actionDetail: `ดูสินเชื่อ: ${item.nameTH}`,
        datatype: "บริการสินเชื่อ",
        dataname: item.nameTH,
        dataID: item.id,
      };

      await apiFetch("/api/logapi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payloadlog),
      });
    } catch (error) {
      console.error("LOG ERROR:", error);
    }

    router.push(`/services/${item.nameEN}`);
  };

  /* ======================================================
     LOADING
  ====================================================== */

  if (loading) {
    return (
      <Container maxWidth="lg">
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
            {locale === "th"
              ? "บริการสินเชื่อ"
              : "Loan Services"}
          </Typography>
        </Box>

        <Box
          sx={{
            px: { xs: 2, md: 3 },
            maxWidth: {
              xs: "100%",
              sm: 760,
              md: 820,
              lg: "100%",
            },
            mx: "auto",
          }}
        >
          <Grid container spacing={3}>
            {Array.from({ length: 9 }).map((_, index) => (
              <Grid
                key={index}
                size={{
                  xs: 12,
                  sm: 6,
                  lg: 4,
                }}
              >
                <ServiceSkeletonCard />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    );
  }

  /* ======================================================
     ERROR
  ====================================================== */

  if (error) {
    return (
      <div
        style={{
          textAlign: "center",
          color: "red",
        }}
      >
        {error}
      </div>
    );
  }

  /* ======================================================
     EMPTY
  ====================================================== */

  if (!services.length) {
    return (
      <div style={{ textAlign: "center" }}>
        ไม่มีข้อมูล
      </div>
    );
  }

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
          {locale === "th"
            ? "บริการสินเชื่อ"
            : "Loan Services"}
        </Typography>
      </Box>

      {/* GRID */}

      <Box
        sx={{
          px: { xs: 2, md: 3 },
          maxWidth: {
            xs: "100%",
            sm: 760,
            md: 820,
            lg: "100%",
          },
          mx: "auto",
        }}
      >
        <Grid
          container
          spacing={{
            xs: 2,
            sm: 2.25,
            md: 2.5,
            lg: 3,
          }}
          sx={{
            justifyContent: "flex-start",
          }}
        >
          {services.map((item, index) => {
            const titleRaw = item.nameTH;

            const title =
              locale === "th"
                ? removeNano(titleRaw)
                : item.nameEN || removeNano(titleRaw);

            const description = item.detail;

            return (
                <Grid
                  key={item.id}
                  size={{
                  xs: 12,
                  sm: 6,
                  lg: 4,
                }}
                sx={{
                  animationDelay: `${index * 0.08}s`,
                  animationFillMode: "forwards",

                  display: "flex",
                  justifyContent: "center",

                  "@media (max-width:770px)": {
                    width: "100%",
                    flexBasis: "100%",
                    maxWidth: "100%",
                  },
                }}
              >
                <ServiceCard
                  image={item.imagelarge}
                  title={title}
                  item={item}
                  description={description}
                  route={item.nameEN}
                  handleClick={handleClick}
                />
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Container>
  );
}
