"use client";

import React from "react";
import { Button, CircularProgress, useTheme } from "@mui/material";
import { darken } from "@mui/system";
import type { ButtonProps } from "@mui/material";

interface AppButtonProps extends ButtonProps {
    loading?: boolean;
    customColor?: string;
}

const TextButton: React.FC<AppButtonProps> = ({
    children,
    loading = false,
    customColor,
    variant = "contained",
    sx,
    ...props
}) => {
    const theme = useTheme();
    const defaultBg = "#243865"; // 🔥 แนะนำใช้ hex แทน var
    const baseColor = customColor || defaultBg;

    return (
        <Button
            variant={variant}
            disabled={loading || props.disabled}
            sx={{
                fontWeight: 600,
                borderRadius: '8px',
                fontSize: theme.typography.body1.fontSize,
                whiteSpace: "nowrap",
                textTransform: "none",

                // 🔹 contained
                ...(variant === "contained" && {
                    backgroundColor: baseColor,
                    color: "#fff",
                    "&:hover": {
                        backgroundColor: darken(baseColor, 0.2),
                    },
                }),

                // 🔹 outlined
                ...(variant === "outlined" && {
                    borderColor: baseColor,
                    color: baseColor,
                    "&:hover": {
                        borderColor: darken(baseColor, 0.2),
                        backgroundColor: `${baseColor}10`, // 🔥 สีจางๆ
                    },
                }),

                // 🔹 text
                ...(variant === "text" && {
                    color: baseColor,
                    "&:hover": {
                        backgroundColor: `${baseColor}15`, // 🔥 subtle hover
                    },
                }),

                ...sx,
            }}
            {...props}
        >
            {loading ? <CircularProgress size={20} color="inherit" /> : children}
        </Button>
    );
};

export default TextButton;