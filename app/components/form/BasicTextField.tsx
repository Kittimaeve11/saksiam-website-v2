import React from "react";
import { Box, TextField, Typography, useTheme } from "@mui/material";
import { ComponentsTextModelProps } from "@/app/Utils/type";

const mobileFontSx = { xs: 16, sm: "1rem" };
const labelFontSx = { xs: 16, sm: "1.25rem" };

const formatAmountInput = (value: string) => {
    const digits = value.replace(/\D/g, "");

    if (!digits) return "";

    return Number(digits).toLocaleString("en-US");
};

const BasicTextField: React.FC<ComponentsTextModelProps> = ({
    name,
    titlename,
    subject,
    setsubject,
    topon,
    handleFieldChange,
    error,
    fieldKey,
    specify,
}) => {
    const theme = useTheme();

    return (
        <Box sx={{ mt: topon }}>
            <Typography
                variant="h6"
                component="label"
                sx={{ alignItems: "left", fontSize: labelFontSx }}
            >
                {name} {specify && <span style={{ color: theme.palette.error.main }}>*</span>}
            </Typography>
            <TextField
                required
                size="small"
                variant="outlined"
                placeholder={titlename}
                fullWidth
                value={subject ?? ""}
                onChange={(e) => {
                    const nextValue =
                        fieldKey === "amount"
                            ? formatAmountInput(e.target.value)
                            : e.target.value;

                    setsubject(nextValue);
                    handleFieldChange(fieldKey, nextValue);
                }}
                slotProps={{
                    htmlInput: {
                        sx: { fontSize: mobileFontSx },
                    },
                }}
                sx={{
                    "& .MuiOutlinedInput-root": {
                        borderRadius: 999,
                        "& fieldset": {
                            borderColor: error ? theme.palette.error.main : theme.palette.grey[300],
                            borderWidth: "1.5px",
                        },
                        "&:hover fieldset": {
                            borderColor: theme.palette.primary.main,
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: theme.palette.primary.main,
                            borderWidth: "2px",
                        },
                    },
                    "& .MuiInputLabel-root": {
                        color: theme.palette.primary.main,
                    },
                    "& .MuiInputBase-input": {
                        fontSize: mobileFontSx,
                        fontWeight: 300,
                        color: error ? theme.palette.error.main : theme.palette.text.primary,
                    },
                    "& .MuiInputBase-input::placeholder": {
                        fontSize: mobileFontSx,
                        color: error ? theme.palette.error.main : theme.palette.grey[500],
                        opacity: 1,
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                        color: theme.palette.primary.main,
                    },
                    "& .MuiFormHelperText-root": {
                        fontSize: mobileFontSx,
                        fontWeight: 400,
                    },
                    fontSize: mobileFontSx,
                    mt: 1,
                }}
                error={Boolean(error)}
                helperText={error}
            />
        </Box>
    );
};

export default BasicTextField;
