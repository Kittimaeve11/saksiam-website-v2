"use client";

import Link from "next/link";
import { Box, Typography, Stack, Button } from "@mui/material";

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
        p: 3,
      }}
    >
      <Box sx={{ maxWidth: 480 }}>

        {/* ERROR */}
        <Typography
          sx={{
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontSize: "0.8rem",
            opacity: 0.7,
            mb: 1,
          }}
        >
          Error 404
        </Typography>

        {/* GIF */}
        <Box
          component="img"
          src="/Gif/404-error.gif"
          alt="404 error"
          sx={{
            width: "220px",
            mb: 2,
            mx: "auto",
            display: "block",
          }}
        />

        {/* TITLE */}
        <Typography
          sx={{
            fontSize: "2.4rem",
            lineHeight: 1.1,
            fontWeight: 700,
            mb: 1,
          }}
        >
          ไม่พบหน้าที่คุณต้องการ
        </Typography>

        {/* DESCRIPTION */}
        <Typography
          sx={{
            fontSize: "0.98rem",
            opacity: 0.8,
            mb: 3,
          }}
        >
          ลิงก์ที่คุณเข้าถึงอาจถูกย้ายหรือลบออกจากเว็บไซต์แล้ว
          <br />
          คุณสามารถกลับไปที่หน้าแรกของเว็บไซต์เพื่อเริ่มต้นใหม่ได้
        </Typography>

        {/* BUTTON */}
        <Stack
          direction="row"
          sx={{ justifyContent: "center" }} // 
        >
          <Button
            component={Link}
            href="/"
            sx={{
              px: 3,
              py: 1.2,
              borderRadius: "999px",
              background:
                "linear-gradient(135deg, #FFE066 0%, #FFD10D 45%, #FFC400 100%)",
              color: "#1C3563",
              fontWeight: 600,
              fontSize: "0.95rem",
              textTransform: "none",
              boxShadow: "0 10px 30px rgba(255, 209, 13, 0.35)",
              transition: "all 0.3s ease",
              minWidth: 180,

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