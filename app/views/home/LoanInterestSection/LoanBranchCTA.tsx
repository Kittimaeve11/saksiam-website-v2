"use client";

import { Box, Typography, useTheme } from "@mui/material";
import Image from "next/image";
import { useLocale } from "@/app/providers/LocaleContext";
import { useRouter } from "next/navigation";
import TextButton from "@/app/components/ui/Button/TextButton";
import { IoSearch } from "react-icons/io5";

export default function LoanBranchCTA() {
  const { messages } = useLocale();
  const router = useRouter();
  const theme = useTheme();

  return (
    <Box
      sx={{
        textAlign: "center",
        width: "100%",
        maxWidth: 500,
        mx: "auto",

        "@media (max-width:574px)": {
          px: 2,
        },
      }}
    >
      {/* ================= TEXT ================= */}
      <Box
        sx={{
          position: "relative",
          textAlign: "center",
        }}
      >
        {/* ================= LEFT QUOTE ================= */}
        <Box
          sx={{
            position: "absolute",
            left: -4,
            top: 0,

            "@media (max-width:574px)": {
              left: 2,
              top: -2,
            },
          }}
        >
          <Image
            src="/quote/quote_left.png"
            alt=""
            width={30}
            height={30}
            style={{
              width: "clamp(18px, 5vw, 30px)", // 🔥 เล็กลงตามจอ
              height: "auto",
            }}
          />
        </Box>

        {/* ================= RIGHT QUOTE ================= */}
        <Box
          sx={{
            position: "absolute",
            right: -4,
            bottom: 0,

            "@media (max-width:574px)": {
              right: 2,
              bottom: -2,
            },
          }}
        >
          <Image
            src="/quote/quote_right.png"
            alt=""
            width={30}
            height={30}
            style={{
              width: "clamp(18px, 5vw, 30px)", // 🔥 เล็กลงตามจอ
              height: "auto",
            }}
          />
        </Box>

        <Typography
          sx={{
            fontWeight: 800,
            color: "#1C3563",
            lineHeight: 1.5,
            px: 4,

            "@media (max-width:574px)": {
              px: 4.5,   // กัน quote ชนข้อความ
              pt: 1,
              pb: 1,
            },

            "@media (min-width:418px) and (max-width:437px)": {
              px: 5,
              pt: 1.2,
              pb: 1.2,
            },
          }}
        >
          <Box
            component="span"
            sx={{
              display: "block",
              fontSize: "22px",

              "@media (max-width:574px)": {
                fontSize: "18px",
              },
            }}
          >
            {messages.home.staff_recommend}
          </Box>

          <Box
            component="span"
            sx={{
              display: "block",
              fontSize: "28px",

              "@media (max-width:574px)": {
                fontSize: "22px",
              },
            }}
          >
            {messages.home.select_branch_service}
          </Box>
        </Typography>
      </Box>

      {/* ================= IMAGE ================= */}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Image
          src="/Employee/employeehome3.png"
          alt="employee"
          width={580}
          height={580}
          priority
          style={{
            marginTop: "16px",
            height: "auto",
            maxWidth: "100%",
          }}
        />
      </Box>

      {/* ================= BUTTON ================= */}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <TextButton
          onClick={() => router.push("/branchlocations")}
          startIcon={
            <IoSearch style={{ fontSize: theme.typography.h5.fontSize }} />
          }
          sx={{
            mt: -1,
            px: 6,
            py: 1.5,
            minWidth: "330px",
            height: "63px",
            borderRadius: "16px",
            background: "linear-gradient(90deg, #FBD53F 0%, #FFAA37 100%)",

            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1.2,

            color: "var(--color-primary)",
            fontSize: theme.typography.h6.fontSize,
            fontWeight: 800,
            boxShadow: "none",

            "@media (max-width:574px)": {
              px: 3,
              minWidth: "240px",
              height: "52px",
              fontSize: "16px",
              gap: 1,
            },
          }}
        >
          {messages.home.find_branch}
        </TextButton>
      </Box>
    </Box>
  );
}