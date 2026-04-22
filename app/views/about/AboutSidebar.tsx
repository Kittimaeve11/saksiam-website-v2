"use client";

/* ====================================================== */
import { Box, Typography } from "@mui/material";
import { useState } from "react";

/* ====================================================== */
const menu = [
  { label: "ประวัติสินเชื่อศักดิ์สยาม", id: "history" },
  { label: "วิสัยทัศน์ และพันธกิจ", id: "vision" },
  { label: "โครงสร้างองค์กร", id: "org" },
  { label: "คณะกรรมการบริษัท", id: "board" },
  { label: "Board Skills Matrix", id: "skills" },
];

/* ====================================================== */
export default function AboutSidebar() {
  const [active, setActive] = useState("history");

  const handleClick = (id: string) => {
    setActive(id);

    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <Box sx={{ width: "100%", mb: 5 }}>
      {/* ================= WRAPPER ================= */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          background: "var(--color-disabled-bg)", // 🔥 เทาอ่อน
          borderRadius: "999px",
          px: 3,
          py: 2,
          boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        }}
      >
        {menu.map((item, index) => {
          const isActive = active === item.id;

          return (
            <Box
              key={item.id}
              onClick={() => handleClick(item.id)}
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                position: "relative",
                px: 2,
              }}
            >
              {/* TEXT */}
              <Typography
                sx={{
                  fontSize: "15px",
                  fontWeight: 500,
                  color: "var(--color-primary)",
                  whiteSpace: "nowrap",
                }}
              >
                {item.label}
              </Typography>

              {/* 🔥 เส้น active */}
              {isActive && (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: -8,
                    left: 0,
                    width: "100%",
                    height: "3px",
                    background: "var(--color-info)",
                  }}
                />
              )}

              {/* 🔥 Divider | */}
              {index !== menu.length - 1 && (
                <Box
                  sx={{
                    mx: 2,
                    width: "1px",
                    height: "18px",
                    background: "#d1d5db", // เทาอ่อน
                  }}
                />
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}