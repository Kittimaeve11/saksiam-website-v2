import { apiFetch } from '@/app/api/client';
import { useLocale } from '@/app/providers/LocaleContext';
import { Box, MenuItem, SelectChangeEvent, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
export interface BasicDropDownSeleteProps {
    id: number;
    name: string;
}

interface BasicDropDownseleteitem {
    selecte: number | null;
    setSelected: React.Dispatch<React.SetStateAction<number | null>>;
    topon: number
    nameroutes: string
    titlename: string;
}

const BasicDropDownselete: React.FC<BasicDropDownseleteitem> = ({
    selecte,
    setSelected,
    topon,
    nameroutes,
    titlename
}) => {
     const { messages } = useLocale();
    const [data, setData] = useState<BasicDropDownSeleteProps[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 🔥 ตรงนี้สำคัญ: type ต้องตรงกับ API
                const res = await apiFetch<BasicDropDownSeleteProps[]>(
                    `/api/${nameroutes}`
                );

                if (!res.status) {
                    throw new Error(res.message || "API error");
                }

                // ✅ ใช้ res.data ได้เลย
                setData(res.data || []);
            } catch (err) {
                console.error("fetch error:", err);
            }
        };

        fetchData();
    }, [nameroutes]);


    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const value = event.target.value;
        setSelected(value === "" ? null : (value as number));
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
            <TextField
                id={`select-${nameroutes}`}
                select
                size="small"
                value={selecte ?? "0"}
                onChange={handleChange}
                sx={{
                    width: '100%',
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "8px", // 👈 ตัวจริง
                    },
                }}
                SelectProps={{
                    MenuProps: {
                        PaperProps: {
                            sx: {
                                maxHeight: 300,
                                overflowY: 'auto',
                            }
                        }
                    }
                }}
            >
                <MenuItem value="0">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                        <Typography
                            sx={{
                                color: 'inherit',
                            }}
                        >
                            {item.name}
                        </Typography>
                    </MenuItem>
                ))}
            </TextField>
        </Box>
    )
}

export default BasicDropDownselete
