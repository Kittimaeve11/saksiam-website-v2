"use client";

/* ======================================================
   IMPORT
====================================================== */

import { useState, useRef, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { FaChevronDown } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { HiMiniHome } from "react-icons/hi2";

import { useLocale } from "@/app/providers/LocaleContext";
import { usePathname } from "next/navigation";

/* ======================================================
   COMPONENT
====================================================== */

export default function TabMenu() {

  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileLoanOpen, setMobileLoanOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const { messages } = useLocale();
  const pathname = usePathname();

  const loanMenu = [
    "สินเชื่อทะเบียนรถเป็นประกัน",
    "สินเชื่อรถจักรยานยนต์ใหม่",
    "สินเชื่อรถแลกเงิน (สินเชื่อเช่าซื้อ)",
    "สินเชื่อทะเบียนรถ (เพื่อการลงทุน)",
    "สินเชื่อรายย่อยเพื่อการประกอบอาชีพ (นาโนไฟแนนซ์)",
    "สินเชื่อส่วนบุคคล",
    "สินเช่าที่ดินเป็นประกัน",
    "สินเชื่อโซลาร์รูฟท็อป",
  ];

  const mobileMenus = [
    { label: messages.menu.loan_services, href: "/loan-services" },
    { label: messages.menu.solar, href: "https://solar.saksiam.com/" },
    { label: messages.menu.branch_finder, href: "/branchlocations" },
    { label: messages.menu.news, href: "/news" },
    { label: messages.menu.faq, href: "/faq" },
    { label: messages.menu.sustainability, href: "https://sustainability.saksiam.com/th/home" },
    { label: messages.menu.investor_relations, href: "https://investor.saksiam.com/th" },
  ];

  /* ======================================================
     EFFECT
  ====================================================== */

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* ======================================================
     MENU STYLE
  ====================================================== */

  const menuStyle = (path?: string, customActive?: boolean) => ({
    position: "relative",
    color: "var(--neutral-white)",
    textDecoration: "none",
    fontSize: 16,
    pb: "2px",
    cursor: "pointer",

    "&::after": {
      content: '""',
      position: "absolute",
      left: "50%",
      bottom: 0,
      transform: "translateX(-50%)",
      width:
        customActive !== undefined
          ? customActive
            ? "100%"
            : "0%"
          : path && pathname === path
            ? "100%"
            : "0%",
      height: "3px",
      backgroundColor: "var(--neutral-white)",
      borderRadius: "8px",
      transition: "width 0.3s ease",
    },

    "&:hover::after": {
      width: "100%",
    },
  });
  const isNewsActive = () => {
    return (
      pathname.startsWith("/news") ||
      pathname.startsWith("/news-activities")
    );
  };


  return (
    <>
      {/* ================= MOBILE ================= */}
      <Box
        sx={{
          display: { xs: "flex", lg: "none" },
          width: "100%",
          height: 49,
          bgcolor: "var(--color-primary)",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 2,
          px: 2,
          position: "relative",
        }}
      >
        {/* HOME */}
        <Box
          component={Link}
          href="/"
          sx={{
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            textDecoration: "none",
          }}
        >
          <HiMiniHome size={26} />
        </Box>

        {/* MENU BUTTON */}
        <Box
          onClick={() => {
            setMobileOpen((prev) => {
              const next = !prev;
              if (!next) setMobileLoanOpen(false);
              return next;
            });
          }} sx={{
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          <IoMenu size={26} />
        </Box>

        {/* DROPDOWN */}
        <Box
          sx={{
            display: mobileOpen ? "block" : "none",
            position: "absolute",
            top: "49px",
            left: 0,
            right: 0,
            width: "100%",
            bgcolor: "var(--main-blue-500)",
            px: 2,
            py: 2,
            borderBottomLeftRadius: "12px",
            borderBottomRightRadius: "12px",
            boxShadow: "0 12px 20px -10px rgba(0,0,0,0.3)",
            maxHeight: "70vh",
            overflowY: "auto",
            zIndex: 9999,

            /* 🔥 ซ่อน scrollbar */
            scrollbarWidth: "none",        // Firefox
            msOverflowStyle: "none",       // IE/Edge
            "&::-webkit-scrollbar": {
              display: "none",             // Chrome/Safari
            },

          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, color: "#fff" }}>

            <Box
              component={Link}
              href="/"
              onClick={() => setMobileOpen(false)}

              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 1.5,
                bgcolor: "rgba(255,255,255,0.1)",
                borderRadius: 2,
                color: "#fff",
                textDecoration: "none",
              }}
            >
              {messages.menu.home}
            </Box>

            {/* บริการสินเชื่อ */}
            <Box>
              {/* HEADER */}
              <Box
                onClick={() => setMobileLoanOpen((prev) => !prev)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",

                  width: "100%", 
                  boxSizing: "border-box",

                  px: 2,
                  py: 1.5,
                  color: "#fff",
                  borderRadius: "8px",
                  cursor: "pointer",

                  bgcolor: mobileLoanOpen
                    ? "rgba(255,255,255,0.1)"
                    : "transparent",

                  transition: "all 0.25s ease",

                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                <Typography sx={{ fontSize: 15 }}>
                  {messages.menu.loan_services}
                </Typography>

                <FaChevronDown
                  size={12}
                  style={{
                    transition: "0.25s",
                    transform: mobileLoanOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </Box>

              {/* SUBMENU */}
              {mobileLoanOpen && (
                <Box
                  sx={{
                    mt: 0.5,
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.5,
                  }}
                >
                  {loanMenu.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: "100%", // ✅ เต็มแน่นอน
                        boxSizing: "border-box",

                        px: 2,
                        py: 1.25,

                        fontSize: 14,
                        color: "#fff",
                        borderRadius: "8px",
                        cursor: "pointer",

                        pl: 4, // ✅ เยื้อง text แต่ background ยังเต็ม

                        "&:hover": {
                          bgcolor: "rgba(255,255,255,0.12)",
                        },
                      }}
                    >
                      {item}
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

            {/* เมนูอื่น ๆ */}
            {mobileMenus
              .filter((item) => item.label !== messages.menu.loan_services)
              .map((item, i) => (
                <Box
                  key={i}
                  component={Link}
                  href={item.href}
                  onClick={() => {
                    setMobileOpen(false);
                    setMobileLoanOpen(false);
                  }}
                  sx={{
                    display: "block",
                    px: 2,
                    py: 1.5,
                    color: "#fff",
                    textDecoration: "none",
                    borderRadius: "8px",

                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  {item.label}
                </Box>
              ))}
          </Box>
        </Box>
      </Box>

      {/* ================= DESKTOP ================= */}
      <Box
        sx={{
          display: { xs: "none", lg: "flex" },
          width: "100%",
          height: 49,
          bgcolor: "var(--color-primary)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ display: "flex", gap: 4 }}>

          <Box component={Link} href="/" sx={menuStyle("/")}>
            {messages.menu.home}
          </Box>

          {/* DROPDOWN */}
          <Box ref={menuRef} sx={{ position: "relative", display: "flex", alignItems: "center" }}>
            <Box sx={menuStyle()} onClick={() => setOpen((prev) => !prev)}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography sx={{ fontSize: 15 }}>
                  {messages.menu.loan_services}
                </Typography>

                <FaChevronDown
                  size={12}
                  style={{
                    transition: "0.25s",
                    transform: open ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </Box>
            </Box>

            {open && (
              <Box
                sx={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 360,
                  bgcolor: "#fff",
                  borderRadius: 1.5,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                  overflow: "hidden",
                  zIndex: 999,
                }}
              >
                {loanMenu.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      px: 2,
                      py: 1.5,
                      fontSize: 14,
                      cursor: "pointer",
                      "&:hover": {
                        bgcolor: "var(--color-primary)",
                        color: "#fff",
                      },
                    }}
                  >
                    {item}
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {/* OTHER MENU */}
          <Box component={Link} href="https://solar.saksiam.com/" sx={menuStyle("/solar")}>
            {messages.menu.solar}
          </Box>

          <Box component={Link} href="/branchlocations" sx={menuStyle("/branchlocations")}>
            {messages.menu.branch_finder}
          </Box>

          <Box
            component={Link}
            href="/news"
            sx={menuStyle(undefined, isNewsActive())}
          >
            {messages.menu.news}
          </Box>

          <Box component={Link} href="/faq" sx={menuStyle("/faq")}>
            {messages.menu.faq}
          </Box>

          <Box component={Link} href="https://sustainability.saksiam.com/th/home" sx={menuStyle("/sustainability")}>
            {messages.menu.sustainability}
          </Box>

          <Box component={Link} href="https://investor.saksiam.com/th" sx={menuStyle("/investor-relations")}>
            {messages.menu.investor_relations}
          </Box>

        </Box>
      </Box >
    </>
  );
}