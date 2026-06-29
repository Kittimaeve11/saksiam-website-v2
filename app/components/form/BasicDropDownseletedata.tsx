import { Box, MenuItem, TextField, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";
import useLockPageScroll from "./useLockPageScroll";

interface BasicDropDownseleteitem {
    titlename: string;
    selecte: string | null;
    setSelected: React.Dispatch<React.SetStateAction<string | null>>;
    topon: number;
    handleFieldChange: (fieldName: string, value: unknown) => void;
    error: string | undefined;
    fieldKey: string;
    specify: boolean;
    statusOptions: {
        id: number;
        valuename: string;
        labelname: string;
    }[];
}

const mobileFontSx = { xs: 16, sm: "1rem" };
const labelFontSx = { xs: 16, sm: "1.25rem" };

const BasicDropDownseletedata: React.FC<BasicDropDownseleteitem> = ({
    titlename,
    selecte,
    setSelected,
    topon,
    handleFieldChange,
    error,
    fieldKey,
    specify,
    statusOptions,
}) => {
    const theme = useTheme();
    const [menuOpen, setMenuOpen] = useState(false);
    useLockPageScroll(menuOpen);

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const value = event.target.value;
        const nextValue = value === "" || value === "0" ? null : (value as string);
        setSelected(nextValue);
        handleFieldChange(fieldKey, nextValue);
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: { xs: "flex-start", md: "flex-end" },
                alignItems: "left",
                mb: { xs: 0.5, md: 0, xl: 0 },
                mr: { xs: 0, md: 2, xl: 2 },
                width: "100%",
                mt: topon,
            }}
        >
            <Typography variant="h6" component="span" sx={{ mr: 1, mb: 1, fontSize: labelFontSx }}>
                {titlename} {specify && <span style={{ color: theme.palette.error.main }}>*</span>}
            </Typography>
            <TextField
                select
                size="small"
                value={selecte ?? "0"}
                onChange={handleChange}
                sx={{
                    width: "100%",
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
                error={Boolean(error)}
                helperText={error}
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
                {statusOptions.map((product) => (
                    <MenuItem key={product.id} value={product.valuename}>
                        <Typography variant="body1" sx={{ fontSize: mobileFontSx }}>
                            {product.labelname}
                        </Typography>
                    </MenuItem>
                ))}
            </TextField>
        </Box>
    );
};

export default BasicDropDownseletedata;
