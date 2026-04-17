"use client";

/* ======================================================
   IMPORT
====================================================== */
import { Box, Typography } from "@mui/material";
import VideoCard from "@/app/components/cards/VideoCard/VideoCard";

/* ======================================================
   COMPONENT
====================================================== */
export default function HomeIntroSection() {
  return (
    <Box
      sx={{
        width: "100%",
        background: "linear-gradient(90deg, #011643 0%, #243865 100%)",
        py: { xs: 4, md: 8 },
        px: { xs: 2, md: 6 },
      }}
    >
      <Box
        sx={{
          maxWidth: "lg",
          margin: "0 auto",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          gap: { xs: 4, md: 6 },
        }}
      >
        {/* ======================================================
            LEFT (TEXT)
        ====================================================== */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 2.5, md: 3 },
            color: "#fff",
          }}
        >
          {/* TITLE */}
          <Typography
            sx={{
              fontSize: { xs: "22px", md: "32px" },
              fontWeight: 700,
              color: "var(--main-yellow-500)",
              mb: 2,
            }}
          >
            ศักดิ์สยาม สินเชื่อเพื่อสังคม
          </Typography>

          {/* DESC */}
          <Typography
            sx={{
              fontSize: { xs: "14px", md: "18px" },
              lineHeight: 1.8,
              opacity: 0.9,
              mb: 2.5,
            }}
          >
            เรามุ่งมั่นในการให้บริการทางการเงิน เพื่อยกระดับคุณภาพชีวิตของประชาชน
            และเกษตรกรลูกค้ากว่า 50,000 รายทั่วประเทศ ด้วยบริการที่ได้มาตรฐาน
          </Typography>

          {/* LIST */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
            {["ดอกเบี้ยถูก", "ผ่อนสบาย", "ลดต้น ลดดอก"].map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.2,
                }}
              >
                {/* ✔ ICON (แก้ตรงนี้) */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 20,
                    height: 20,
                  }}
                >
                  <i
                    className="fi fi-br-checkbox"
                    style={{
                      fontSize: "18px",
                      color: "var(--main-yellow-500)",
                    }}
                  />
                </Box>

                <Typography sx={{ fontSize: "16px" }}>
                  {item}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* ======================================================
            RIGHT (VIDEO)
        ====================================================== */}
        <Box
          sx={{
            flex: 1,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <VideoCard
            videoUrl="https://www.youtube.com/embed/5eI2jSRY1i8"
          />
        </Box>
      </Box>
    </Box>
  );
}