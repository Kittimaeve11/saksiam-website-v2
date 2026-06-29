"use client";

import React, { useState } from "react";
import { Autocomplete, Box, TextField, Typography, useTheme } from "@mui/material";
import { AddressItem, addressList } from "@/public/data/Address_Mannager";
import useLockPageScroll from "./useLockPageScroll";

interface Props {
    titlename: string;
    setProvinces: React.Dispatch<React.SetStateAction<string>>;
    setAmphures: React.Dispatch<React.SetStateAction<string>>;
    setTambons: React.Dispatch<React.SetStateAction<string>>;
    setZipcode: React.Dispatch<React.SetStateAction<string>>;
    setAddress: React.Dispatch<React.SetStateAction<string>>;
    setTambonsID: React.Dispatch<React.SetStateAction<number>>;
    topon: number;
    handleFieldChange: (fieldName: string, value: unknown) => void;
    error: string | undefined;
    fieldKey: string;
    specify: boolean;
}

const mobileFontSx = { xs: 16, sm: "1rem" };
const labelFontSx = { xs: 16, sm: "1.25rem" };

const escapeRegExp = (value: string) =>
    value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const HighlightText = ({ text, keyword }: { text: string; keyword: string }) => {
    const query = keyword.trim();

    if (!query) {
        return <>{text}</>;
    }

    const parts = text.split(new RegExp(`(${escapeRegExp(query)})`, "gi"));

    return (
        <>
            {parts.map((part, index) => (
                part.toLowerCase() === query.toLowerCase() ? (
                    <Box
                        key={`${part}-${index}`}
                        component="span"
                        sx={{ color: "var(--color-info)", fontWeight: 700 }}
                    >
                        {part}
                    </Box>
                ) : (
                    <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>
                )
            ))}
        </>
    );
};

const AddressSearch: React.FC<Props> = ({
    titlename,
    setProvinces,
    setAmphures,
    setTambons,
    setZipcode,
    setAddress,
    setTambonsID,
    topon,
    handleFieldChange,
    error,
    fieldKey,
    specify,
}) => {
    const theme = useTheme();
    const [selectedAddress, setSelectedAddress] = useState<AddressItem | null>(null);
    const [inputValue, setInputValue] = useState("");
    const [open, setOpen] = useState(false);
    useLockPageScroll(open);

    return (
        <Box sx={{ mt: topon }}>
            <Typography
                variant="h6"
                component="span"
                sx={{ mr: 1, mb: 1, fontSize: labelFontSx }}
            >
                {titlename}{" "}
                {specify && <span style={{ color: theme.palette.error.main }}>*</span>}
            </Typography>

            <Autocomplete
                options={addressList}
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                autoHighlight
                blurOnSelect
                selectOnFocus
                clearOnBlur
                value={selectedAddress}
                inputValue={inputValue}
                onInputChange={(_event, value) => setInputValue(value)}
                handleHomeEndKeys
                getOptionLabel={(option) => option.fullText}
                filterOptions={(options, state) => {
                    const input = state.inputValue.trim().toLowerCase();

                    return options.filter((item) => (
                        item.tambon.name_th.toLowerCase().includes(input) ||
                        item.amphure.name_th.toLowerCase().includes(input) ||
                        item.province.name_th.toLowerCase().includes(input) ||
                        String(item.zipcode).includes(input)
                    ));
                }}
                onChange={(_event, value) => {
                    if (!value) {
                        setSelectedAddress(null);
                        setInputValue("");
                        setProvinces("");
                        setAmphures("");
                        setTambons("");
                        setZipcode("");
                        setAddress("");
                        setTambonsID(0);
                        handleFieldChange(fieldKey, {
                            address: "",
                            district: "",
                            amphoe: "",
                            province: "",
                            zipcode: "",
                            tambonsID: 0,
                        });
                        return;
                    }

                    setSelectedAddress(value);
                    setInputValue(value.fullText);
                    setProvinces(value.province.name_th);
                    setAmphures(value.amphure.name_th);
                    setTambons(value.tambon.name_th);
                    setZipcode(String(value.zipcode));
                    setTambonsID(value.tambon.id);
                    setAddress(value.fullText);
                    handleFieldChange(fieldKey, {
                        address: value.fullText,
                        district: value.tambon.name_th,
                        amphoe: value.amphure.name_th,
                        province: value.province.name_th,
                        zipcode: String(value.zipcode),
                        tambonsID: value.tambon.id,
                    });
                }}
                slotProps={{
                    paper: {
                        sx: {
                            mt: 0.5,
                            borderRadius: "0 0 16px 16px",
                            border: `1px solid ${theme.palette.grey[200]}`,
                            boxShadow: "0 10px 24px rgba(16, 24, 40, 0.14)",
                            overflow: "hidden",
                        },
                    },
                    listbox: {
                        sx: {
                            py: 0,
                            maxHeight: 300,
                            overflowY: "auto",
                            "& .MuiAutocomplete-option": {
                                minHeight: 38,
                                px: 2,
                                fontSize: mobileFontSx,
                                color: theme.palette.text.primary,
                                transition: "background-color 0.2s ease",
                                "&[aria-selected='true']": {
                                    backgroundColor: "rgba(232, 243, 255, 0.95)",
                                },
                                "&.Mui-focused": {
                                    backgroundColor: "rgba(232, 243, 255, 0.75)",
                                },
                            },
                        },
                    },
                }}
                renderOption={(props, option, state) => {
                    const { key, ...optionProps } = props;

                    return (
                        <Box key={key} component="li" {...optionProps}>
                            <HighlightText text={option.fullText} keyword={state.inputValue} />
                        </Box>
                    );
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        size="small"
                        placeholder="เช่น ตำบล, อำเภอ, จังหวัด, รหัสไปรษณีย์"
                        fullWidth

                        error={Boolean(error)}
                        helperText={error}

                        sx={{
                            mt: 1,
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
                                    borderWidth: 2,
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
                        }}
                    />
                )}
            />
        </Box>
    );
};

export default AddressSearch;
