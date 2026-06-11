import { Box, MenuItem, TextField, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";
import useLockPageScroll from "./useLockPageScroll";

interface BasicDropDownseleteitem {
    titlename: string;
    selecte: string;
    setSelected: React.Dispatch<React.SetStateAction<string>>;
    topon: number;
    handleFieldChange: (fieldName: string, value: unknown) => void;
    error: string | undefined;
    fieldKey: string;
    specify: boolean;
    vehicleTypes: string | undefined;
}

const mobileFontSx = { xs: 16, sm: "1rem" };
const labelFontSx = { xs: 16, sm: "1.25rem" };

const BasicDropDownseletedatatag: React.FC<BasicDropDownseleteitem> = ({
    titlename,
    selecte,
    setSelected,
    topon,
    handleFieldChange,
    error,
    fieldKey,
    specify,
    vehicleTypes,
}) => {
    const theme = useTheme();
    const [menuOpen, setMenuOpen] = useState(false);
    useLockPageScroll(menuOpen);
    const options = vehicleTypes
        ?.replace(/"/g, "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSelected(value === "" ? "0" : value);
        handleFieldChange(fieldKey, value);
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: { xs: "flex-start", md: "flex-end" },
                width: "100%",
                mt: topon,
            }}
        >
            <Typography
                variant="h6"
                component="span"
                sx={{ mr: 1, mb: 1, fontSize: labelFontSx }}
            >
                {titlename}
                {specify && <span style={{ color: theme.palette.error.main }}>*</span>}
            </Typography>

            <TextField
                select
                size="small"
                value={selecte || "0"}
                onChange={handleChange}
                error={Boolean(error)}
                helperText={error}
                sx={{
                    "& .MuiInputBase-input, & .MuiSelect-select": {
                        fontSize: mobileFontSx,
                    },
                    "& .MuiFormHelperText-root": {
                        fontSize: mobileFontSx,
                    },
                    "& .MuiOutlinedInput-root": {
                        borderRadius: 999,
                        "& fieldset": {
                            borderColor: theme.palette.grey[300],
                        },
                        "&:hover fieldset": {
                            borderColor: theme.palette.primary.main,
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: theme.palette.primary.main,
                            borderWidth: 2,
                        },
                    },
                }}
                slotProps={{
                    select: {
                        onOpen: () => setMenuOpen(true),
                        onClose: () => setMenuOpen(false),
                        MenuProps: {
                            disableScrollLock: true,
                            slotProps: {
                                paper: {
                                    sx: {
                                        maxHeight: 300,
                                        overflowY: "auto",
                                    },
                                },
                            },
                        },
                    },
                }}
            >
                <MenuItem value="0">
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            color: error
                                ? theme.palette.error.main
                                : theme.palette.mode === "dark"
                                    ? theme.palette.grey[600]
                                    : theme.palette.grey[400],
                            fontSize: mobileFontSx,
                            fontWeight: 400,
                        }}
                    >
                        เลือก{titlename}
                    </Box>
                </MenuItem>

                {options?.map((item, index) => (
                    <MenuItem key={index} value={item}>
                        <Typography variant="body1" sx={{ fontSize: mobileFontSx }}>
                            {item}
                        </Typography>
                    </MenuItem>
                ))}
            </TextField>
        </Box>
    );
};

export default BasicDropDownseletedatatag;
