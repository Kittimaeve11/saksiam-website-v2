import { apiFetch, getCachedApiResponse } from "@/app/api/client";
import { useLocale } from "@/app/providers/LocaleContext";
import { BasicDropDownSeleteProps } from "@/app/Utils/type";
import { Box, MenuItem, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import useLockPageScroll from "./useLockPageScroll";

interface BasicDropDownseleteitem {
    selecte: number | null;
    setSelected: React.Dispatch<React.SetStateAction<number | null>>;
    topon: number;
    nameroutes: string;
    titlename: string;
}

const mobileFontSx = { xs: 16, sm: "1rem" };

const BasicDropDownselete: React.FC<BasicDropDownseleteitem> = ({
    selecte,
    setSelected,
    topon,
    nameroutes,
    titlename,
}) => {
    const { messages } = useLocale();
    const endpoint = `/api/${nameroutes}`;
    const cached = getCachedApiResponse<BasicDropDownSeleteProps[]>(endpoint);
    const [data, setData] = useState<BasicDropDownSeleteProps[]>(cached?.data || []);
    const [menuOpen, setMenuOpen] = useState(false);
    useLockPageScroll(menuOpen);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await apiFetch<BasicDropDownSeleteProps[]>(endpoint);

                if (!res.status) {
                    throw new Error(res.message || "API error");
                }

                setData(res.data || []);
            } catch (err) {
                console.error("fetch error:", err);
            }
        };

        fetchData();
    }, [endpoint]);

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const value = event.target.value;
        setSelected(value === "" ? null : (value as number));
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
            <TextField
                id={`select-${nameroutes}`}
                select
                size="small"
                value={selecte ?? "0"}
                onChange={handleChange}
                sx={{
                    width: "100%",
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                    },
                    "& .MuiInputBase-input, & .MuiSelect-select": {
                        fontSize: mobileFontSx,
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
                    <Box sx={{ display: "flex", alignItems: "center", fontSize: mobileFontSx }}>
                        {messages.selete}
                        {titlename}
                    </Box>
                </MenuItem>
                {data.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                        <Typography sx={{ color: "inherit", fontSize: mobileFontSx }}>
                            {item.name}
                        </Typography>
                    </MenuItem>
                ))}
            </TextField>
        </Box>
    );
};

export default BasicDropDownselete;
