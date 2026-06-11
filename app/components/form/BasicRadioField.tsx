import { ComponentsRadioModelProps } from "@/app/Utils/type";
import { Box, FormControl, FormControlLabel, RadioGroup, Typography, useTheme } from "@mui/material";
import React from "react";
import { CustomRadio } from "../ui/Button/CustomRadio";

const labelFontSx = { xs: 18, sm: "1.25rem" };

const BasicRadioField: React.FC<ComponentsRadioModelProps> = ({
    name,
    titlename1,
    titlename2,
    subject,
    setsubject,
    topon,
    handleFieldChange,
    error,
    fieldKey,
    specify,
}) => {
    const theme = useTheme();
    const hasError = Boolean(error);

    return (
        <Box sx={{ mt: topon, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <Typography variant="h6" component="label" sx={{ alignItems: "left", fontSize: labelFontSx }}>
                {name} {specify && <span style={{ color: theme.palette.error.main }}>*</span>}
            </Typography>
            <FormControl component="fieldset">
                <RadioGroup
                    row
                    value={subject}
                    onChange={(e) => {
                        const value = Number(e.target.value);
                        setsubject(value);
                        handleFieldChange(fieldKey, value);
                    }}
                >
                    <Box sx={{ mr: 2 }}>
                        <FormControlLabel
                            value="1"
                            control={
                                <CustomRadio
                                    sx={{
                                        color: hasError ? theme.palette.error.main : undefined,
                                        "&.Mui-checked": {
                                            color: hasError ? theme.palette.error.main : "var(--color-primary)",
                                        },
                                    }}
                                />
                            }
                            label={titlename1}
                            slotProps={{
                                typography: {
                                    sx: {
                                        fontSize: labelFontSx,
                                        fontWeight: theme.typography.h6.fontWeight,
                                    },
                                },
                            }}
                        />
                    </Box>

                    <Box>
                        <FormControlLabel
                            value="0"
                            control={
                                <CustomRadio
                                    sx={{
                                        color: hasError ? theme.palette.error.main : undefined,
                                        "&.Mui-checked": {
                                            color: hasError ? theme.palette.error.main : "var(--color-primary)",
                                        },
                                    }}
                                />
                            }
                            label={titlename2}
                            slotProps={{
                                typography: {
                                    sx: {
                                        fontSize: labelFontSx,
                                        fontWeight: theme.typography.h6.fontWeight,
                                    },
                                },
                            }}
                        />
                    </Box>
                </RadioGroup>
            </FormControl>
            {error && (
                <Typography
                    variant="body2"
                    color="error"
                    sx={{
                        mt: 0.5,
                        ml: 1.75,
                        textAlign: "left",
                        fontSize: 16,
                        lineHeight: 1.66,
                    }}
                >
                    {error}
                </Typography>
            )}
        </Box>
    );
};

export default BasicRadioField;
