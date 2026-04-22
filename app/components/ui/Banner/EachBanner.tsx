"use client";

/* ====================================================== */
import { apiFetch } from "@/app/api/client";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";

/* ====================================================== */
const BASE_URL = process.env.NEXT_PUBLIC_API_PHOTO!;

/* ====================================================== */
interface EachBanneritem {
  id: number;
  name: string;
  picturePC: string;
  pictureMoblie: string;
  type: string;
  link: string;
  active: string;
  createAt: string;
  updateAt: string;
}

/* ====================================================== */
const EachBanner = ({ num }: { num: number }) => {
  const [data, setData] = useState<EachBanneritem | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  /* ======================================================
      FETCH
  ====================================================== */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiFetch<any>(`/api/bannerapi/${num}`);

        if (!res?.status) {
          throw new Error(res?.message || "API error");
        }

        setData(res.data || null);
      } catch (err) {
        console.error("fetch error:", err);
      }
    };

    fetchData();
  }, [num]);

  /* ====================================================== */
  return (
    <Box
      sx={{
        width: "100%",
        position: "relative",
        background: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {data && (
        <Box
          component="img"
          src={
            isMobile
              ? `${BASE_URL}/${data.pictureMoblie}`
              : `${BASE_URL}/${data.picturePC}`
          }
          alt={data.name}
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
          sx={{
            width: "100%",
            height: "auto",
            objectFit: "contain",

            display: "block",

            userSelect: "none",
            WebkitUserDrag: "none",
          }}
        />
      )}
    </Box>
  );
};

export default EachBanner;