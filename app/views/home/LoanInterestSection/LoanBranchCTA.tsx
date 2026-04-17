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
    <Box sx={{ textAlign: "center" }}>
      <Box
        sx={{
          position: "relative",
          textAlign: "center",
        }}
      >
        {/* LEFT QUOTE */}
        <Box
          sx={{
            position: "absolute",
            left: -4,
            top: 0,
          }}
        >
          <Image src="/quote/quote_left.png" alt="" width={30} height={30} />
        </Box>

        {/* RIGHT QUOTE */}
        <Box
          sx={{
            position: "absolute",
            right: -4,
            bottom: 0,
          }}
        >
          <Image src="/quote/quote_right.png" alt="" width={30} height={30} />
        </Box>

        {/* TEXT */}
        <Typography
          sx={{
            fontWeight: 800,
            color: "#1C3563",
            lineHeight: 1.5,
            px: 4,
          }}
        >
          <Box component="span" sx={{ display: "block", fontSize: "22px" }}>
            {messages.home.staff_recommend}
          </Box>

          <Box component="span" sx={{ display: "block", fontSize: "28px" }}>
            {messages.home.select_branch_service}
          </Box>
        </Typography>
      </Box>

      <Image
        src="/Employee/employeehome3.png"
        alt="employee"
        width={580}
        height={500}
        priority   // 🔥 ตัวนี้สำคัญ
        style={{ marginTop: "16px" }}
      />
      <TextButton
        onClick={() => router.push("/branchlocations")}
        startIcon={<IoSearch style={{fontSize:theme.typography.h5.fontSize}} />}
        sx={{
          mt: -1,
          px: 6,
          py: 1.5,
          minWidth: "330px",
          height: "63px",
          borderRadius: "16px",
          // ✅ พื้นหลังปุ่ม
          background: "linear-gradient(90deg, #FBD53F 0%, #FFAA37 100%)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1.2,
          color: "var(--color-primary)",
          fontSize: theme.typography.h6.fontSize,
          fontWeight:800
        }}
      >
        {messages.home.find_branch}
      </TextButton>
    </Box>
  );
}