"use client";

/* ====================================================== */
import { useCallback, useRef } from "react";
import LightGallery from "lightgallery/react";
import Image from "next/image";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";

/* ====================================================== */
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";

/* ====================================================== */
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";

/* ====================================================== */
type Props = {
  images: string[];
};

/* ====================================================== */
export default function Gallery({ images = [] }: Props) {
  const lightGallery = useRef<any>(null);
  const theme = useTheme();

  /* ======================================================
     RESPONSIVE
  ====================================================== */
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isSm = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isMd = useMediaQuery(theme.breakpoints.between("md", "lg"));

  let columns = 4;
  if (isXs) columns = 1;
  else if (isSm) columns = 2;
  else if (isMd) columns = 3;

  /* ====================================================== */
  const onInit = useCallback((detail: any) => {
    lightGallery.current = detail.instance;
  }, []);

  const onOpen = (index: number) => {
    lightGallery.current?.openGallery(index);
  };

  const dynamicElements = images.map((src) => ({
    src,
    thumb: src,
  }));

  const total = images.length;

  /* ======================================================
     🔥 LOGIC (แก้จริง)
  ====================================================== */
  const hasMore = total > columns;

  // แสดงรูปจริง
  const visibleCount = hasMore ? columns - 1 : columns;
  const visibleImages = images.slice(0, visibleCount);

  // preview ในช่อง MORE
  const morePreviewImage = hasMore ? images[visibleCount] : null;

  // 🔥 นับเฉพาะ "รูปที่ไม่แสดงจริง"
  const hiddenCount = hasMore ? total - columns : 0;

  /* ====================================================== */
  const imgSizes =
    "(max-width:600px) 100vw, (max-width:900px) 50vw, (max-width:1200px) 33vw, 25vw";

  return (
    <LightGallery
      onInit={onInit}
      dynamic
      dynamicEl={dynamicElements}
      speed={400}
      plugins={[lgThumbnail, lgZoom]}
      download
      counter

      
      // ❌ ลบ licenseKey ออก = หาย warning
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 2,
        }}
      >
        {/* ================= IMAGES ================= */}
        {visibleImages.map((src, index) => {
          const isFirst = index === 0;
          const isLast = index === visibleImages.length - 1;

          return (
            <Box
              key={index}
              onClick={() => onOpen(index)}
              sx={{
                position: "relative",
                width: "100%",
                aspectRatio: "16/9",
                overflow: "hidden",
                cursor: "pointer",

                // 🔥 ซ้ายโค้ง
                borderTopLeftRadius: isFirst ? "16px" : 0,
                borderBottomLeftRadius: isFirst ? "16px" : 0,

                // 🔥 ขวาโค้ง (กรณีไม่มี more)
                borderTopRightRadius:
                  !hasMore && isLast ? "16px" : 0,
                borderBottomRightRadius:
                  !hasMore && isLast ? "16px" : 0,

                "& img": {
                  transition: "transform 0.35s ease",
                },

                "&:hover img": {
                  transform: "scale(1.05)",
                },
              }}
            >
              <Image
                src={src}
                alt={`gallery-${index}`}
                fill
                sizes={imgSizes}
                style={{ objectFit: "cover" }}
              />
            </Box>
          );
        })}

        {/* ================= MORE ================= */}
        {hasMore && morePreviewImage && (
          <Box
            onClick={() => onOpen(visibleCount)}
            sx={{
              position: "relative",
              width: "100%",
              aspectRatio: "16/9",
              overflow: "hidden",
              cursor: "pointer",

              // 🔥 ขวาโค้ง
              borderTopRightRadius: "16px",
              borderBottomRightRadius: "16px",

              "& img": {
                transition: "transform 0.35s ease",
              },

              "&:hover img": {
                transform: "scale(1.05)",
              },

              "&:hover .overlay": {
                background: "rgba(0,0,0,0.6)",
              },
            }}
          >
            <Image
              src={morePreviewImage}
              alt="more"
              fill
              sizes={imgSizes}
              style={{ objectFit: "cover" }}
            />

            <Box
              className="overlay"
              sx={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.45)",
                color: "#fff",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                transition: "all .25s ease",
              }}
            >
              <Typography sx={{ fontWeight: 600, fontSize: 18 }}>
                ดูเพิ่มเติม
              </Typography>
              {/* <Typography sx={{ fontSize: 16 }}>
                {hiddenCount} ภาพ
              </Typography> */}
            </Box>
          </Box>
        )}
      </Box>
    </LightGallery>
  );
}