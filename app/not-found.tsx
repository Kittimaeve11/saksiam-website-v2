"use client";

import Link from "next/link";
import { Box, Button, Stack, Typography } from "@mui/material";

export default function NotFound() {
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483647,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        background:
          "radial-gradient(circle at top, #0f172a 0, #020617 55%, #000 100%)",
        color: "#f9fafb",
        p: { xs: 2, sm: 3 },
        minHeight: "100dvh",
        overflowY: "auto",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: { xs: 340, sm: 480 },
          py: { xs: 3, sm: 0 },
        }}
      >
        <Typography
          sx={{
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontSize: { xs: "0.72rem", sm: "0.8rem" },
            opacity: 0.7,
            mb: 1,
          }}
        >
          Error 404
        </Typography>

        <Box
          component="img"
          src="/Gif/404-error.gif"
          alt="404 error"
          sx={{
            width: { xs: 150, sm: 220 },
            mb: { xs: 1.5, sm: 2 },
            mx: "auto",
            display: "block",
          }}
        />

        <Typography
          sx={{
            fontSize: { xs: "1.55rem", sm: "2.4rem" },
            lineHeight: { xs: 1.2, sm: 1.1 },
            fontWeight: 700,
            mb: 1,
            overflowWrap: "anywhere",
          }}
        >
          ไม่พบหน้าที่คุณต้องการ
        </Typography>

        <Typography
          sx={{
            fontSize: { xs: "0.88rem", sm: "0.98rem" },
            lineHeight: { xs: 1.65, sm: 1.6 },
            opacity: 0.8,
            mb: { xs: 2.5, sm: 3 },
          }}
        >
          ลิงก์ที่คุณเข้าถึงอาจถูกย้ายหรือลบออกจากเว็บไซต์แล้ว
          <Box component="br" sx={{ display: { xs: "none", sm: "block" } }} />
          คุณสามารถกลับไปที่หน้าแรกของเว็บไซต์เพื่อเริ่มต้นใหม่ได้
        </Typography>

        <Stack direction="row" sx={{ justifyContent: "center" }}>
          <Button
            component={Link}
            href="/"
            sx={{
              width: { xs: "100%", sm: "auto" },
              px: { xs: 2, sm: 3 },
              py: { xs: 1.1, sm: 1.2 },
              borderRadius: "999px",
              background:
                "linear-gradient(135deg, #FFE066 0%, #FFD10D 45%, #FFC400 100%)",
              color: "#1C3563",
              fontWeight: 600,
              fontSize: { xs: "0.9rem", sm: "0.95rem" },
              textTransform: "none",
              boxShadow: "0 10px 30px rgba(255, 209, 13, 0.35)",
              transition: "all 0.3s ease",
              minWidth: { xs: 0, sm: 180 },

              "&:hover": {
                background:
                  "linear-gradient(135deg, #FFC400 100%, #FFD10D 45%, #FFE066 0%)",
              },
            }}
          >
            กลับหน้าแรก
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
