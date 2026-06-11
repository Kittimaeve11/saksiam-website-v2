"use client";

import { Box, Grid, Typography, useTheme } from "@mui/material";
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
    <Grid
      container
      sx={{
        width: "100%",
        textAlign: "center",

        display: "flex",
        flexDirection: "column",
        alignItems: "center",

        px: {
          xs: 2,
          sm: 3,
          md: 0,
        },

        "@media (max-width:486px)": {
          px: 1.5,
        },
      }}
    >
      {/* ======================================================
   SECTION : หัวข้อแนะนำสาขา
   - จัดวางข้อความให้อยู่กึ่งกลาง
   - รองรับ Responsive ทุกขนาดหน้าจอ
====================================================== */}
      <Grid
        size={12}
        sx={{
          width: "100%",
          display: "grid",
          justifyItems: "center",
        }}
      >
        {/* ======================================================
      WRAPPER : กล่องครอบข้อความและ Quote
      - ควบคุมความกว้างของข้อความ
      - ปรับขนาดตาม Breakpoint
  ====================================================== */}
        <Box
          sx={{
            position: "relative",
            textAlign: "center",
            width: "100%",

            maxWidth: {
              xs: "100%",
              sm: "580px",
              md: "500px",
              lg: "100%",
            },

            mx: "auto",

            // px: {
            //   xs: 0,
            //   sm: 0,
            //   md: 0,
            // },

            "@media (max-width:486px)": {
              maxWidth: "360px",
              px: 2.5,
            },
          }}
        >
          {/* ======================================================
        QUOTE ซ้าย
        - ตกแต่งหัวข้อ
        - ย่อขนาดลงเมื่อหน้าจอเล็กกว่า 486px
    ====================================================== */}
          <Box
            sx={{
              position: "absolute",
              left: {
                xs: -20,
                sm: -20,
              },

              top: {
                xs: 0,
                sm: 0,
              },

              "@media (max-width:486px)": {
                left: 0,
                top: 0,

                transform: "scale(0.78)",
                transformOrigin: "top left",
              },
            }}
          >
            <Image
              src="/quote/quote_left.png"
              alt=""
              width={30}
              height={30}
            />
          </Box>

          {/* ======================================================
        QUOTE ขวา
        - ตกแต่งหัวข้อ
        - ย่อขนาดลงเมื่อหน้าจอเล็กกว่า 486px
    ====================================================== */}
          <Box
            sx={{
              position: "absolute",

              right: {
                xs: -20,
                sm:-20,
              },

              bottom: {
                xs: 0,
                sm: 0,
              },

              "@media (max-width:486px)": {
                right: 0,
                bottom: 0,

                transform: "scale(0.78)",
                transformOrigin: "bottom right",
              },
            }}
          >
            <Image
              src="/quote/quote_right.png"
              alt=""
              width={30}
              height={30}
            />
          </Box>

          {/* ======================================================
        TEXT : ข้อความหัวข้อหลัก
        - ปรับขนาด Font ตาม Responsive
        - ลด Padding บนมือถือ
    ====================================================== */}
          <Typography
            sx={{
              fontWeight: 800,
              color: "#1C3563",
              lineHeight: 1.5,

              px: {
                xs: 2,
                sm: 3,
                md: 4,
              },

              "@media (max-width:486px)": {
                px: 1.5,
              },
            }}
          >
            {/* ======================================================
          ข้อความบรรทัดบน
          - ขนาดเล็กกว่า
          - ย่อ Font บนมือถือ
      ====================================================== */}
            <Box
              component="span"
              sx={{
                display: "block",

                fontSize: {
                  xs: "20px",
                  sm: "20px",
                  md: "22px",
                },

                "@media (max-width:486px)": {
                  fontSize: "16px",
                },
              }}
            >
              {messages.home.staff_recommend}
            </Box>

            {/* ======================================================
          ข้อความบรรทัดล่าง
          - ข้อความหลักของ Section
          - เน้นขนาดใหญ่กว่าบรรทัดบน
      ====================================================== */}
            <Box
              component="span"
              sx={{
                display: "block",

                fontSize: {
                  xs: "24px",
                  sm: "24px",
                  md: "28px",
                },

                "@media (max-width:486px)": {
                  fontSize: "20px",
                },
              }}
            >
              {messages.home.select_branch_service}
            </Box>
          </Typography>
        </Box>
      </Grid>

      <Grid
        size={12}
        sx={{
          mt: { xs: 1.5, sm: 2 },
          width: "100%",
          maxWidth: {
            xs: "min(100%, 500px)",
            sm: "580px",
            md: "580px",
            lg: "600px",
          },
          display: "grid",
          justifyItems: "center",
          "@media (max-width:486px)": {
            maxWidth: "min(100%, 360px)",
            mt: 1,
          },
        }}
      >
        <Image
          src="/Employee/employeehome3.png"
          alt="employee"
          width={600}
          height={520}
          priority
          style={{
            width: "100%",
            height: "auto",
          }}
        />
      </Grid>

      <Grid size={12}>
        <TextButton
          onClick={() => router.push("/branchlocations")}
          startIcon={
            <IoSearch
              style={{
                fontSize: theme.typography.h5.fontSize,
              }}
            />
          }
          sx={{
            mt: -1,
            px: { xs: 4, sm: 6 },
            py: 1.5,
            minWidth: { xs: 0, sm: "330px" },
            width: { xs: "min(100vw - 48px, 330px)", sm: "auto" },
            height: { xs: "56px", sm: "63px" },
            borderRadius: "16px",
            background: "linear-gradient(90deg, #FBD53F 0%, #FFAA37 100%)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1.2,
            color: "var(--color-primary)",
            fontSize: {
              xs: theme.typography.body1.fontSize,
              sm: theme.typography.h6.fontSize,
            },
            fontWeight: 800,
            border: "none",
            outline: "none",
            boxShadow: "none",
            transition: "all .25s ease",
            "&:hover": {
              boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
            },
            "@media (max-width:486px)": {
              mt: -0.5,
              width: "min(100vw - 40px, 280px)",
              height: "50px",
              px: 2.5,
              borderRadius: "14px",
              fontSize: "16px",
            },
          }}
        >
          {messages.home.find_branch}
        </TextButton>
      </Grid>
    </Grid>
  );
}
