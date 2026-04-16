"use client";

import { Box, Typography, Checkbox, FormControlLabel } from "@mui/material";

type Props = {
    checked: boolean;
    onChange: (value: boolean) => void;
};

export default function ConsentBox({ checked, onChange }: Props) {
    return (
        <Box
            sx={{
                border: "2px solid var(--color-error)",
                borderRadius: "16px",
                p: 3,
                mt: 3,
                background: "#F9FAFB",
            }}
        >
            {/* 🔥 ย่อหน้า 1 */}
            <Typography
                sx={{
                    color: "var(--color-error)",
                    fontWeight: 500,
                    lineHeight: 1.8,
                    textAlign: "justify",     // 🔥 จัดกระจาย
                    textIndent: "2em",        // 🔥 ย่อหน้าแบบไทย
                }}
            >
                บริษัทไม่มีนโยบายแต่งตั้งตัวแทนหรือนายหน้าในการยื่นเอกสาร
                เพื่อประกอบการพิจารณาขอสินเชื่อออนไลน์และเรียกรับผลประโยชน์เป็นการตอบแทน
            </Typography>

            {/* 🔥 ย่อหน้า 2 */}
            <Typography
                sx={{
                    color: "var(--color-error)",
                    fontWeight: 500,
                    lineHeight: 1.8,
                    textAlign: "justify",
                    textIndent: "2em",
                }}
            >
                ข้าพเจ้าได้อ่านรายละเอียดเกี่ยวกับผลิตภัณฑ์ อัตราดอกเบี้ย
                และค่าธรรมเนียม รวมถึงเข้าใจข้อกำหนดและเงื่อนไขของทางบริษัทแล้ว
            </Typography>

            {/* เส้นคั่น */}
            <Box sx={{ borderTop: "1px solid #E5E7EB", my: 2 }} />

            {/* 🔥 Checkbox */}
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={checked}
                            onChange={(e) => onChange(e.target.checked)}
                        />
                    }
                    label="อ่านข้อตกลงและยอมรับเงื่อนไข"
                />
            </Box>
        </Box>
    );
}