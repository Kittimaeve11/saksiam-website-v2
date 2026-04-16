"use client";

/* ====================================================== */
import { Box, Typography } from "@mui/material";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

/* ====================================================== */
type Props = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

/* ====================================================== */
export default function Pagination({
  page,
  totalPages,
  onChange,
}: Props) {
  const handlePrev = () => {
    if (page > 1) onChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) onChange(page + 1);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 1.5,
        mt: 4,
      }}
    >
      {/* ================= PREV ================= */}
      <Box
        onClick={handlePrev}
        sx={{
          width: 40,
          height: 40,
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: page === 1 ? "not-allowed" : "pointer",
          color: page === 1 ? "#cbd5e1" : "#94a3b8",
          background: "#f1f5f9",
        }}
      >
        <MdKeyboardArrowLeft size={20} />
      </Box>

      {/* ================= CURRENT ================= */}
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          background: "var(--main-blue-500)",
          color: "#fff",
          fontWeight: 700,
          fontSize: 18,
        }}
      >
        {page}
      </Box>

      {/* ================= TEXT ================= */}
      <Typography
        sx={{
          fontSize: 16,
          color: "#94a3b8",
          fontWeight: 500,
        }}
      >
        จาก
      </Typography>

      {/* ================= TOTAL ================= */}
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          background: "#fff",
          color: "var(--main-blue-500)",
          border: "1.5px solid #e2e8f0",

          fontWeight: 700,
          fontSize: 18,
        }}
      >
        {totalPages}
      </Box>

      {/* ================= NEXT ================= */}
      <Box
        onClick={handleNext}
        sx={{
          width: 40,
          height: 40,
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor:
            page === totalPages ? "not-allowed" : "pointer",
          color:
            page === totalPages ? "#cbd5e1" : "#94a3b8",
          background: "#f1f5f9",
        }}
      >
        <MdKeyboardArrowRight size={20} />
      </Box>
    </Box>
  );
}