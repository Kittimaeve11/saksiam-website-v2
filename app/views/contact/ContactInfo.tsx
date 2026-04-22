"use client";

/* ====================================================== */
import { Box, Typography } from "@mui/material";

/* ====================================================== */
type Props = {
  data: any;
  errorCount?: number; // 🔥 เปลี่ยนจาก hasError
};

/* ====================================================== */
export default function ContactInfo({ data, errorCount = 0 }: Props) {

  const items = [
    {
      title: "เวลาทำการ",
      desc: [
        "• วันจันทร์ – ศุกร์ เวลา 08:00 – 16:30 น.",
        "วันเสาร์อาจเปิดให้บริการ ติดต่อสาขาก่อนเข้ารับบริการ",
      ],
      icon: "fi fi-sr-clock",
    },
    {
      title: "เบอร์ติดต่อ",
      desc: [
        `• โทร : ${data.callCenter}`,
        `• แฟกซ์ : ${data.fax}`,
      ],
      icon: "fi fi-sr-phone-flip",
    },
    {
      title: "ช่องทางสอบถามเพิ่มเติม",
      desc: data.email.map((mail: string) => `• ${mail}`),
      icon: "fi fi-sr-envelope",
    },
  ];

  /* ====================================================== */
  return (
    <Box
      sx={{
        maxWidth: "1200px",
        mx: "auto",
        px: 2,

        /* 🔥 dynamic mt (ไหลตาม error จริง) */
        mt: {
          xs: 4,
          md: `calc(-60px + ${errorCount * 30}px)`,
        },

        position: "relative",
        zIndex: 1,

        /* 🔥 smooth เฉพาะ margin */
        transition: "margin-top 0.25s ease",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3,1fr)" },
          gap: 3,
        }}
      >
        {items.map((item, i) => (
          <Box
            key={i}
            sx={{
              background: "#fff",
              p: 3,
              borderRadius: "20px",
              textAlign: "center",

              boxShadow:
                i === 1
                  ? "0 25px 60px rgba(28,53,99,0.25)"
                  : "0 15px 35px rgba(28,53,99,0.15)",

              transition: "0.3s",

              /* 🔥 การ์ดกลางสูง */
              transform: {
                xs: "none",
                md: i === 1 ? "translateY(-20px)" : "none",
              },

              "&:hover": {
                transform: {
                  xs: "none",
                  md: i === 1 ? "translateY(-20px)" : "none",
                },
                boxShadow:
                  i === 1
                    ? "0 30px 70px rgba(28,53,99,0.3)"
                    : "0 20px 45px rgba(28,53,99,0.2)",
              },
            }}
          >
            {/* ICON */}
            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: "50%",
                mx: "auto",
                mb: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #1C3563 0%, #2E5AAC 100%)",
                color: "#fff",
              }}
            >
              <i
                className={item.icon}
                style={{
                  fontSize: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1,
                }}
              />
            </Box>

            {/* TITLE */}
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "18px",
                color: "var(--color-primary)",
                mb: 1,
              }}
            >
              {item.title}
            </Typography>

            {/* DESC */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 0.5,
              }}
            >
              {item.desc.map((text: string, idx: number) => (
                <Typography
                  key={idx}
                  sx={{
                    fontSize: "14px",
                    color:
                      text.includes("เสาร์") ||
                      text.includes("ก่อนเข้ารับบริการ")
                        ? "#E53935"
                        : "#667085",
                  }}
                >
                  {text}
                </Typography>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}