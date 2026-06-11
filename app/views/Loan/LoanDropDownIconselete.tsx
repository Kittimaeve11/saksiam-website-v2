import { apiFetch, getCachedApiResponse } from '@/app/api/client';
import { useLocale } from '@/app/providers/LocaleContext';
import { BasicDropDownSeleteLoanProps } from '@/app/Utils/type';
import { Box, MenuItem,  TextField, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react'
import useLockPageScroll from '@/app/components/form/useLockPageScroll';

import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import MopedIcon from '@mui/icons-material/Moped';
import GirlIcon from '@mui/icons-material/Girl';
import ArticleIcon from '@mui/icons-material/Article';


interface BasicDropDownseleteitem {
    selecte: BasicDropDownSeleteLoanProps | null;

    setSelected: React.Dispatch<
        React.SetStateAction<BasicDropDownSeleteLoanProps | null>
    >;
    topon: number;
    titlename: string;
    fieldKey: string
    specify: boolean
    handleFieldChange: (fieldName: string, value: unknown) => void
    error: string | undefined
}

const LoanDropDownIconselete: React.FC<BasicDropDownseleteitem> = ({
    selecte,
    setSelected,
    topon,
    titlename,
    handleFieldChange,
    error,
    fieldKey,
    specify
}) => {
    const theme = useTheme();
    const { messages } = useLocale();
    const endpoint = '/api/listloanformapi';
    const formatLoanItems = (items: BasicDropDownSeleteLoanProps[]) =>
        items.map((item) => ({
            ...item,
            name:
                item.name ||
                item.nameTH ||
                item.titleTH ||
                item.nameEN ||
                item.titleEN ||
                "",
        }));
    const cached = getCachedApiResponse<BasicDropDownSeleteLoanProps[]>(endpoint);
    const [data, setData] = useState<BasicDropDownSeleteLoanProps[]>(
        formatLoanItems(cached?.data || [])
    );
    const [menuOpen, setMenuOpen] = useState(false);
    useLockPageScroll(menuOpen);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 🔥 ตรงนี้สำคัญ: type ต้องตรงกับ API
                const res = await apiFetch<BasicDropDownSeleteLoanProps[]>(endpoint);

                if (!res.status) {
                    throw new Error(res.message || "API error");
                }

                // ✅ ใช้ res.data ได้เลย
                const loanItems = formatLoanItems(res.data || []);

                setData(loanItems);
            } catch (err) {
                console.error("fetch error:", err);
            }
        };

        fetchData();
    }, []);

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = event.target.value;

        const selectedItem =
            data.find((item) => String(item.id) === String(value)) || null;

        handleFieldChange(fieldKey, selectedItem);

        setSelected(selectedItem);
    };
    const renderIcon = (name?: string) => {
        const text = (name || "").toLowerCase();

        // 🛵 จักรยาน
        if (text.includes("จักรยาน")) {
            return <MopedIcon sx={{ mr: 1 }} />;
        }

        if (text.includes("โซลาร์")) {
            return (
                <Box
                    component="img"
                    src="/Icons/solar-panel.png"
                    alt="solar"
                    sx={{
                        width: 22,
                        height: 22,
                        mr: 1,
                        objectFit: "contain",
                    }}
                />
            );
        }

        if (text.includes("ดิน")) {
            return <ArticleIcon sx={{ mr: 1 }} />;
        }

        if (
            text.includes("บุคคล") ||
            text.includes("อาชีพ")
        ) {
            return <GirlIcon sx={{ mr: 1 }} />;
        }

        // 🚗 รถทั่วไป
        if (
            text.includes("รถ") ||
            text.includes("เช่าซื้อ")
        ) {
            return <DirectionsCarIcon sx={{ mr: 1 }} />;
        }

        return null;
    };
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: { xs: 'flex-start', md: 'flex-end' },
                alignItems: 'left', mb: { xs: 0.5, md: 0, xl: 0 },
                mr: { xs: 0, md: 2, xl: 2 },
                width: '100%',
                mt: topon,
            }}
        >
            <Typography
                variant="h6"
                component="span"
                sx={{ mr: 1, mb: 1, fontSize: 16 }}
            >
                {titlename} {specify && <span style={{ color: theme.palette.error.main }}>*</span>}
            </Typography>
            <TextField
                id={`select-data`}
                select
                size="small"
                value={selecte?.id ?? "0"}
                onChange={handleChange}
                sx={{
                    '& .MuiInputBase-input, & .MuiSelect-select': {
                        fontSize: 16,
                    },
                    '& .MuiFormHelperText-root': {
                        fontSize: 16,
                    },
                    '& .MuiOutlinedInput-root': {
                borderRadius: 999,

                '& fieldset': {
                  borderColor:
                    theme.palette.grey[300],
                },

                '&:hover fieldset': {
                  borderColor:
                    theme.palette.primary.main,
                },

                '&.Mui-focused fieldset': {
                  borderColor:
                    theme.palette.primary.main,

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
                                        overflowY: 'auto',
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
                    <Box sx={{ display: 'flex', alignItems: 'center', color: error ? theme.palette.error.main : theme.palette.mode === 'dark' ? theme.palette.grey[600] : theme.palette.grey[400], fontSize: 16, fontWeight: 400 }}>
                        {messages.selete}{titlename}
                    </Box>
                </MenuItem>
                {data.map((item) => (
                    <MenuItem
                        key={item.id}
                        value={item.id}
                        sx={{
                            opacity: 1,
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            {renderIcon(item.name)}

                            <Typography
                                sx={{
                                    color: 'inherit',
                                    fontSize: 16,
                                }}
                            >
                                {item.name}
                            </Typography>
                        </Box>
                    </MenuItem>
                ))}
            </TextField>
        </Box>
    )
}

export default LoanDropDownIconselete
