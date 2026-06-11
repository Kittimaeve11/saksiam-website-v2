"use client";

import { Box, Typography } from "@mui/material";

const ethics = [
  {
    short: "รับ",
    text: "รับผิดชอบต่อหน้าที่",
  },
  {
    short: "ซื่อ",
    text: "ซื่อสัตย์ สุจริตต่อตนเองและผู้อื่น",
  },
  {
    short: "อุ",
    text: "อุทิศตนเพื่อเป้าหมาย",
  },
  {
    short: "ดำ",
    text: "ดำรงวัฒนธรรมอันดีไว้",
  },
  {
    short: "เรียน",
    text: "เรียนรู้ พัฒนาตนเองได้ ตลอดเวลา",
  },
];

export default function CorporateEthicsSection() {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 6, md: 8 },
      }}
    >
      {/* ======================================================
          TITLE
      ====================================================== */}
      <Typography
        component="h2"
        sx={{
          color: "var(--color-primary)",
          fontSize: { xs: 32, md: 36 },
          fontWeight: 800,
          textAlign: "center",
          mb: { xs: 5, md: 8 },
          cursor: "default",
          userSelect: "none",
        }}
      >
        จริยธรรมองค์กร
      </Typography>

      {/* ======================================================
          ETHICS LIST
      ====================================================== */}
      <Box
        sx={{
          display: "grid",

          /* มือถือทั้งหมด */
          gridTemplateColumns: {
            xs: "1fr",

            /* Desktop */
            lg: "repeat(5, 1fr)",
          },

          gap: {
            xs: 4,
            md: 2,
          },

          justifyItems: "center",
          alignItems: "start",

          /* ======================================================
             MD : 2 บน 3 ล่าง
          ====================================================== */
          "@media (min-width:900px) and (max-width:1199px)": {
            gridTemplateColumns: "repeat(6, 1fr)",

            "& > :nth-of-type(1)": {
              gridColumn: "2 / span 2",
            },

            "& > :nth-of-type(2)": {
              gridColumn: "4 / span 2",
            },

            "& > :nth-of-type(3)": {
              gridColumn: "1 / span 2",
            },

            "& > :nth-of-type(4)": {
              gridColumn: "3 / span 2",
            },

            "& > :nth-of-type(5)": {
              gridColumn: "5 / span 2",
            },
          },
        }}
      >

        {ethics.map((item) => (
          <Box
            key={item.short}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              cursor: "default",
              userSelect: "none",
            }}
          >
            {/* ======================================================
                CIRCLE
            ====================================================== */}
            <Box
              sx={{
                width: { xs: 90, md: 90 },
                height: { xs: 90, md: 90 },

                borderRadius: "50%",

                background:
                  "linear-gradient(180deg, #FFAA37 0%, #FFC107 100%)",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                mb: 2,
              }}
            >
              <Typography
                sx={{
                  color: "#fff",
                  fontWeight: 600,

                  fontSize: {
                    xs: 28,
                    md: 28,
                  },

                  lineHeight: 1,
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  cursor: "default",
                  userSelect: "none",
                }}
              >
                {item.short}
              </Typography>
            </Box>

            {/* ======================================================
                DESCRIPTION
            ====================================================== */}
            <Typography
              sx={{
                color: "#666",
                fontSize: { xs: 14, md: 16 },
                fontWeight: 500,
                lineHeight: 1.6,
                maxWidth: 220,
                cursor: "default",
                userSelect: "none",
              }}
            >
              {item.text}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}