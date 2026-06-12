"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import {
  Box,
  Typography,
  Button,
  Fade,
  IconButton,
} from "@mui/material";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FaRegWindowClose } from "react-icons/fa";

/* ================= CONFIG ================= */

const COOKIE_NAME = "cookieConsentSettings";

const defaultSettings = {
  necessary: true,
  analytics: false,
  marketing: false,
};

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState(defaultSettings);
  const [openSection, setOpenSection] = useState<string | null>(null);

  /* ================= LOAD ================= */
  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(() => {
      if (!active) return;

      const saved = Cookies.get(COOKIE_NAME);
      if (!saved) {
        setShowBanner(true);
      } else {
        setSettings(JSON.parse(saved));
      }
    }, 0);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, []);

  /* ================= ACTION ================= */
  const acceptAll = () => {
    const data = { necessary: true, analytics: true, marketing: true };
    Cookies.set(COOKIE_NAME, JSON.stringify(data), { expires: 365 });
    setSettings(data);
    setShowBanner(false);
    setShowSettings(false);
  };

  const rejectAll = () => {
    const data = { necessary: true, analytics: false, marketing: false };
    Cookies.set(COOKIE_NAME, JSON.stringify(data), { expires: 365 });
    setSettings(data);
    setShowBanner(false);
    setShowSettings(false);
  };

  const saveSettings = () => {
    const data = { ...settings, necessary: true };
    Cookies.set(COOKIE_NAME, JSON.stringify(data), { expires: 365 });
    setShowBanner(false);
    setShowSettings(false);
  };

  const toggleSetting = (key: keyof typeof settings) => {
    if (key === "necessary") return;
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSection = (key: string) => {
    setOpenSection(openSection === key ? null : key);
  };

  if (!showBanner && !showSettings) return null;

  const cookieList = [
    {
      key: "necessary",
      label: "คุกกี้ที่จำเป็น (Strictly Necessary Cookies)",
      desc: "คุกกี้ประเภทนี้มีความจำเป็นต่อการทำงานของเว็บไซต์ เพื่อให้เว็บไซต์สามารถทำงานได้เป็นปกติ มีความปลอดภัย และทำให้ท่านสามารถเข้าใช้เว็บไซต์ได้ เช่น การ log in เข้าสู่เว็บไซต์ การยืนยันตัวตน ทั้งนี้ ท่านไม่สามารถปิดการใช้งานของคุกกี้ประเภทนี้ผ่านระบบของเว็บไซต์ของบริษัทได้",
    },
    {
      key: "marketing",
      label: "คุกกี้เพื่อปรับเนื้อหาให้เข้ากับกลุ่มเป้าหมาย (Targeting Cookies)",
      desc: "คุกกี้ประเภทนี้จะเก็บข้อมูลต่าง ๆ ซึ่งอาจรวมถึงข้อมูลส่วนบุคคลของท่านและสร้างโปรไฟล์เกี่ยวกับตัวท่าน เพื่อให้เราสามารถวิเคราะห์และนำเสนอเนื้อหา สินค้า/บริการ และ/หรือ โฆษณาที่เหมาะสมกับความสนใจของท่านได้ ทั้งนี้ หากท่านไม่ยินยอมให้เราใช้ คุกกี้ประเภทนี้ ท่านอาจได้รับข้อมูลและโฆษณาทั่วไปที่ไม่ตรงกับความสนใจของท่าน",
    },
    {
      key: "analytics",
      label: "คุกกี้เพื่อช่วยในการใช้งาน (Functional Cookies)",
      desc: "คุกกี้ประเภทนี้จะช่วยจดจำข้อมูลคอมพิวเตอร์หรืออุปกรณ์อิเล็กทรอนิกส์ที่ท่านใช้เข้าชมเว็บไซต์ ข้อมูลการลงทะเบียนหรือ log in ข้อมูลการตั้งค่าหรือตัวเลือกที่ท่านเคยเลือกไว้บนเว็บไซต์ เช่น ภาษาที่แสดงบนเว็บไซต์ ที่อยู่สำหรับจัดส่งสินค้า เพื่อให้ท่านสามารถใช้งานเว็บไซต์ได้สะดวกยิ่งขึ้น โดยไม่ต้องให้ข้อมูลหรือตั้งค่าใหม่ทุกครั้งที่ท่านเข้าใช้เว็บไซต์ ทั้งนี้ หากท่านไม่ยินยอมให้เราใช้คุกกี้ประเภทนี้ ท่านอาจใช้งานเว็บไซต์ได้ไม่สะดวกและไม่เต็มประสิทธิภาพ",
    },
  ];

  return (
    <>
      {/* ================= FLOAT BANNER ================= */}
      <Fade in={showBanner}>
        <Box
          sx={{
            position: "fixed",
            bottom: { xs: 12, sm: 20 },
            left: { xs: 12, sm: 20 },
            right: { xs: 12, sm: "auto" },
            zIndex: 9999,
            width: { xs: "auto", sm: "100%" },
            maxWidth: { xs: "none", sm: 420 },
            maxHeight: { xs: "calc(100dvh - 24px)", sm: "none" },
            overflowY: { xs: "auto", sm: "visible" },
            p: { xs: 2, sm: 2.5 },
            borderRadius: { xs: "14px", sm: "16px" },
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.18)",
            border: "1px solid #E4E7EC",
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: 15, sm: 16 },
              fontWeight: 700,
              color: "var(--color-primary)",

              display: "inline-flex",   
              alignItems: "center",     
              gap: 1,
              lineHeight: 1.2,
            }}
          >
            <Box
              component="img"
              src="/Gif/Eating_Cookie.gif"
              alt="cookie"
              sx={{
                width: { xs: 30, sm: 35 },
                height: { xs: 30, sm: 35 },
                display: "block",
                flexShrink: 0,
              }}
            />

            นโยบายคุกกี้
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: 12.5, sm: 13 },
              color: "#667085",
              mb: 2,
              lineHeight: 1.65,
            }}
          >
            เว็บไซต์ของเรามีการใช้งานคุกกี้ (Cookies) เพื่อมอบประสบการณ์ที่ดียิ่งขึ้นให้แก่คุณ รวมถึงเสนอสิทธิประโยชน์ที่ตรงตามความสนใจของคุณมากที่สุด ถ้าคุณยังใช้งานต่อไปโดยไม่ปฏิเสธคุกกี้ เราจะเก็บคุกกี้เพื่อวัตถุประสงค์ข้างต้น ทั้งนี้ คุณสามารถศึกษารายละเอียดเกี่ยวกับการใช้คุกกี้ของเราได้ที่ {" "}
            <Link href="http://localhost:8080/api/policyapi/PO2605150002" target="_blank">
              <span style={{ color: "var(--color-primary)", textDecoration: "underline" }}>
                นโยบายการใช้งานคุกกี้
              </span>
            </Link>
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 1,
            }}
          >
            <Button
              fullWidth
              variant="contained"
              onClick={acceptAll}
              disableElevation // ปิด shadow ของ MUI
              sx={{
                background: "var(--color-primary)",
                borderRadius: "10px",
                fontSize: { xs: 12.5, sm: 13 },
                minHeight: { xs: 42, sm: 36 },
                boxShadow: "none", // กันชัวร์

                "&:hover": {
                  background: "var(--color-primary-hover)",
                  boxShadow: "none", // กันตอน hover เด้งเงากลับ
                },
              }}
            >
              ยอมรับคุกกี้ทั้งหมด
            </Button>

            <Button
              fullWidth
              variant="outlined"
              onClick={() => setShowSettings(true)}
              sx={{
                borderRadius: "10px",
                fontSize: { xs: 12.5, sm: 13 },
                minHeight: { xs: 42, sm: 36 },
              }}
            >
              ตั้งค่า
            </Button>
          </Box>
        </Box>
      </Fade>

      {/* ================= MODAL ================= */}




      {showSettings && (

        <Box
          sx={{
            position: "fixed",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            p: { xs: 1.25, sm: 2 },
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: { xs: "100%", sm: 820 },
              maxHeight: { xs: "calc(100dvh - 20px)", sm: "calc(100dvh - 32px)" },
              bgcolor: "#fff",
              borderRadius: { xs: "18px", sm: "24px" },
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* ================= HEADER ================= */}
            <Box
              sx={{
                px: { xs: 2, sm: 3 },
                py: { xs: 1.5, sm: 2 },
                borderBottom: "1px solid #E4E7EC",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  component="img"
                  src="/Icons/logo_sakSiamText.png"
                  sx={{ height: { xs: 40, sm: 60 }, maxWidth: { xs: 220, sm: "none" } }}
                />

              </Box>

              <IconButton
                onClick={() => setShowSettings(false)}
                sx={{
                  bgcolor: "#F2F4F7",
                  "&:hover": { bgcolor: "#E4E7EC" },
                }}
              >
                <FaRegWindowClose />
              </IconButton>
            </Box>

            {/* ================= CONTENT ================= */}
            <Box sx={{ p: { xs: 2, sm: 3 }, overflowY: "auto" }}>
              <Typography
                sx={{
                  fontSize: { xs: 18, sm: 20 },
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                ประเภทของคุกกี้ที่บริษัทใช้
              </Typography>

              <Typography
                sx={{
                  color: "#667085",
                  mb: { xs: 2, sm: 3 },
                  fontSize: { xs: 13, sm: 14 },
                  lineHeight: 1.7,
                }}
              >
                บริษัทจะใช้คุกกี้เมื่อท่านได้เข้าเยี่ยมชมเว็บไซต์ของบริษัท
                โดยการใช้งานคุกกี้ของเราแบ่งออกตามลักษณะของการใช้งานได้ดังนี้
              </Typography>

              {/* ================= LIST ================= */}
              {cookieList.map((item) => {
                const isOpen = openSection === item.key;
                const isActive = settings[item.key as keyof typeof settings];

                return (
                  <Box
                    key={item.key}
                    onClick={() => toggleSection(item.key)}
                    sx={{
                      p: { xs: 1.6, sm: 2.5 },
                      mb: { xs: 1.25, sm: 2 },
                      borderRadius: "14px",
                      bgcolor: "#F2F4F7",
                      cursor: "pointer",
                      transition: ".2s",
                      "&:hover": {
                        bgcolor: "#E9EEF6",
                      },
                    }}
                  >
                    {/* HEADER */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: { xs: 1, sm: 2 },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1.2,
                          alignItems: "flex-start",
                          minWidth: 0,
                        }}
                      >
                        <Box sx={{ color: "#98A2B3" }}>
                          {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                        </Box>

                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: { xs: 13.5, sm: 15 },
                            lineHeight: 1.45,
                          }}
                        >
                          {item.label}
                        </Typography>
                      </Box>

                      {/* SWITCH STYLE CUSTOM */}
                      <Box
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSetting(item.key as keyof typeof settings);
                        }}
                        sx={{
                          width: 46,
                          height: 24,
                          flex: "0 0 auto",
                          borderRadius: "999px",
                          display: "flex",
                          alignItems: "center",
                          px: "3px",
                          bgcolor:
                            item.key === "necessary"
                              ? "#D0D5DD"
                              : isActive
                                ? "var(--color-info)"
                                : "#D0D5DD",
                          justifyContent: isActive ? "flex-end" : "flex-start",
                          transition: ".25s",
                        }}
                      >
                        <Box
                          sx={{
                            width: 18,
                            height: 18,
                            borderRadius: "50%",
                            bgcolor: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 10,
                            fontWeight: 700,
                          }}
                        >
                          {isActive ? "✓" : "✕"}
                        </Box>
                      </Box>
                    </Box>

                    {/* CONTENT */}
                    {isOpen && (
                      <Typography
                        sx={{
                          mt: 1.5,
                          fontSize: { xs: 12.8, sm: 14 },
                          color: "#475467",
                          lineHeight: 1.7,
                        }}
                      >
                        {item.desc}
                      </Typography>
                    )}
                  </Box>
                );
              })}

              {/* ================= ACTION ================= */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: { xs: 2.5, sm: 4 },
                  flexWrap: "wrap",
                  gap: { xs: 1.25, sm: 2 },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    width: { xs: "100%", sm: "auto" },
                    gap: { xs: 1, sm: 2 },
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={acceptAll}
                    disableElevation
                    sx={{
                      bgcolor: "var(--color-primary)",
                      borderRadius: "10px",
                      px: 3,
                      width: { xs: "100%", sm: "auto" },
                      minHeight: { xs: 42, sm: 36 },
                      fontSize: { xs: 12.5, sm: 14 },
                      boxShadow: "none",
                      "&:hover": {
                        bgcolor: "var(--color-primary-hover)",
                        boxShadow: "none",
                      },
                    }}
                  >
                    ยอมรับคุกกี้ทั้งหมด
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={rejectAll}
                    sx={{
                      borderRadius: "10px",
                      px: 3,
                      width: { xs: "100%", sm: "auto" },
                      minHeight: { xs: 42, sm: 36 },
                      fontSize: { xs: 12.5, sm: 14 },
                    }}
                  >
                    ไม่ยอมรับคุกกี้ทั้งหมด
                  </Button>
                </Box>

                <Button
                  variant="outlined"
                  onClick={saveSettings}
                  sx={{
                    borderRadius: "10px",
                    px: 3,
                    width: { xs: "100%", sm: "auto" },
                    minHeight: { xs: 42, sm: 36 },
                    fontSize: { xs: 12.5, sm: 14 },
                  }}
                >
                  ยืนยันตัวเลือกของฉัน
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
}
