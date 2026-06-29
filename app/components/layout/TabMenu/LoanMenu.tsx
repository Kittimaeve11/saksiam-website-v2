"use client";

import { apiFetch, getCachedApiResponse } from '@/app/api/client';
import { loanItem } from '@/app/Utils/type';
import { Box } from '@mui/material'
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react'


type LoanMenuProps = {
    onItemClick?: () => void;
};

const LoanMenu = ({ onItemClick }: LoanMenuProps) => {
    const router = useRouter();
    const endpoint = "/api/listloanappapi";
    const cached = getCachedApiResponse<loanItem[]>(endpoint);
    const [data, setData] = useState<loanItem[]>(cached?.data || []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const cached = getCachedApiResponse<loanItem[]>(endpoint);
                if (cached) {
                    setData(cached.data || []);
                    return;
                }

                const res = await apiFetch<loanItem[]>(endpoint);

                console.log(res);

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
    
    const handleClick = async (item: loanItem) => {
        try {

            const payloadlog = {
                actionType: 1,
                actionDetail: `ดูสินเชื่อ: ${item.nameTH}`,
                datatype: 'บริการสินเชื่อ',
                dataname: item.nameTH,
                dataID: item.id
            };


            // 🔥 ยิง log api
            const logResponse = await apiFetch(
                `/api/logapi`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payloadlog),
                }
            );

            console.log("LOG RESPONSE:", logResponse);

        } catch (error) {
            console.error("LOG ERROR:", error);
        }

        // 🔥 ไปหน้าถัดไป
        onItemClick?.();
        router.push(`/services/${item.nameEN}`);
    };
    return (
        <Box
            sx={{
                mt: 0.5,
                display: "flex",
                flexDirection: "column",
                gap: 0.5,
            }}
        >
            {!data.length && (
                <Box
                    sx={{
                        px: 2,
                        py: 1.25,
                        pl: 4,
                        fontSize: 14,
                        opacity: 0.8,
                    }}
                >
                    กำลังโหลด
                </Box>
            )}

            {data.map((item, index) => (
                <Box
                    key={index}
                    onClick={() => handleClick(item)}
                    sx={{
                        width: "100%", // ✅ เต็มแน่นอน
                        boxSizing: "border-box",

                        px: 2,
                        py: 1.25,

                        fontSize: 14,
                        borderRadius: "8px",
                        cursor: "pointer",

                        pl: 4, // ✅ เยื้อง text แต่ background ยังเต็ม

                        "&:hover": {
                            bgcolor: "rgba(255,255,255,0.12)",
                        },
                    }}
                >
                    {item.nameTH}
                </Box>
            ))}
        </Box>
    )
}

export default LoanMenu
