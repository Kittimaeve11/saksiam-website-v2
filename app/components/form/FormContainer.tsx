"use client";

import { Box } from "@mui/material";

export default function FormContainer({ children }: any) {
  return (
    <Box
      sx={{
        /* ======================================================
           🔥 GLOBAL INPUT (แก้ปัญหา hover ไม่เท่ากัน)
        ====================================================== */
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            border: "1px solid #D0D5DD",
          },

          "&:hover fieldset": {
            borderColor: "#98A2B3",
          },

          "&.Mui-focused fieldset": {
            borderColor: "var(--color-primary)",
            borderWidth: "1.5px",
          },
        },

        /* ======================================================
           INPUT (ปกติ)
        ====================================================== */
        "& .MuiOutlinedInput-root:not(.MuiInputBase-multiline)": {
          borderRadius: "16px",
          height: "56px",
          fontSize: "18px",
          background: "#F9FAFB",
        },

        /* ======================================================
           TEXTAREA (ฝากข้อความ)
        ====================================================== */
        "& .MuiOutlinedInput-root.MuiInputBase-multiline": {
          borderRadius: "16px",
          fontSize: "18px",
          background: "rgb(249, 250, 251)",
          height: "auto",
          alignItems: "flex-start",
          padding: "8px 5px",
        },

        /* ======================================================
           INPUT TEXT
        ====================================================== */
        "& input": {
          padding: "14px 16px",
          fontSize: "18px",
          color: "#344054",
        },

        "& input::placeholder": {
          fontSize: "18px",
          color: "#98A2B3",
          opacity: 1,
        },

        /* ======================================================
           TEXTAREA TEXT
        ====================================================== */
        "& textarea": {
          padding: "12px 16px",
          fontSize: "18px",
          lineHeight: 1.6,
          resize: "vertical",
          borderRadius: "16px",
          
        },

        /* ======================================================
           SELECT
        ====================================================== */
        "& .MuiSelect-select": {
          padding: "14px 16px",
          fontSize: "18px",
          color: "#344054",
        },

        "& .MuiSelect-icon": {
          color: "#98A2B3",
          right: "12px",
        },

        /* ======================================================
           NUMBER INPUT
        ====================================================== */
        "& input[type=number]": {
          MozAppearance: "textfield",
        },

        "& input[type=number]::-webkit-outer-spin-button": {
          WebkitAppearance: "none",
          margin: 0,
        },

        "& input[type=number]::-webkit-inner-spin-button": {
          WebkitAppearance: "inner-spin-button",
          opacity: 1,
        },

        /* ======================================================
           LABEL
        ====================================================== */
        "& .form-group > .MuiTypography-root:first-of-type": {
          fontSize: "18px",
          fontWeight: 500,
          color: "var(--color-primary)",
          marginBottom: "6px",
        },

        /* ======================================================
           RADIO
        ====================================================== */
        "& .MuiRadio-root": {
          color: "#D0D5DD",
        },

        "& .MuiRadio-root.Mui-checked": {
          color: "var(--color-primary)",
        },

        /* ======================================================
           ERROR INPUT
        ====================================================== */
        "& .form-group.error .MuiOutlinedInput-root fieldset": {
          borderColor: "var(--color-error)",
          borderWidth: "1.5px",
        },

        "& .form-group.error .MuiOutlinedInput-root:hover fieldset": {
          borderColor: "var(--color-error)",
        },

        "& .form-group.error .MuiOutlinedInput-root.Mui-focused fieldset": {
          borderColor: "var(--color-error)",
          borderWidth: "2px",
        },

        /* ======================================================
           ERROR RADIO
        ====================================================== */
        "& .form-group.error .MuiRadio-root": {
          color: "var(--color-error)",
        },

        "& .form-group.error .MuiRadio-root.Mui-checked": {
          color: "var(--color-error)",
        },

        /* ======================================================
           ERROR TEXT
        ====================================================== */
        "& .error-text": {
          fontSize: "16px",
          color: "var(--color-error)",
          marginTop: "4px",
          marginLeft: "4px",
          fontWeight: 500,
        },

        "& .MuiTypography-root.error-text": {
          color: "var(--color-error)",
        },

        /* ======================================================
           GAP
        ====================================================== */
        "& .form-group": {
          marginBottom: "18px",
        },
      }}
    >
      {children}
    </Box>
  );
}