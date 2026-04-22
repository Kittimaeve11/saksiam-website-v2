"use client";

/* ====================================================== */
import { useState, useEffect } from "react";
import {
    Box,
    TextField,
    MenuItem,
    Typography,
} from "@mui/material";
import Image from "next/image";

/* 🔥 IMPORT */
import FormContainer from "@/app/components/form/FormContainer";
import { IoIosArrowDown } from "react-icons/io";
import { validateForm } from "@/app/Utils/validation";
import Swal from "sweetalert2";


/* ====================================================== */
export default function ContactHero({ onErrorChange }: any) {
    /* ================= HYDRATION FIX ================= */
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    /* ================= STATE ================= */
    const [form, setForm] = useState({
        topic: "",
        name: "",
        phone: "",
        email: "",
        message: "",
    });

    const [errors, setErrors] = useState<any>({});
    const [topics, setTopics] = useState<any[]>([]);

    const selectProps = {
        IconComponent: IoIosArrowDown,
    };

    const handle = (key: string, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));

        setErrors((prev: any) => ({
            ...prev,
            [key]: "",
        }));
    };

    useEffect(() => {
        const errorCount = Object.keys(errors).filter(
            (key) => errors[key]
        ).length;

        onErrorChange?.(errorCount);
    }, [errors]);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const res = await fetch("/api/contact-topic");
                const data = await res.json();
                setTopics(data.topics || []);
            } catch (err) {
                console.error("โหลดหัวข้อไม่สำเร็จ", err);
            }
        };

        fetchTopics();
    }, []);

    const handleSubmit = () => {

        /* ======================================================
           🔥 MAP ให้ตรง validateForm
        ====================================================== */
        const mappedForm = {
            isCustomer: "yes",              // 🔥 fix ให้ผ่าน
            loanType: form.topic,           // 🔥 map topic → loanType
            amount: "1000",                 // 🔥 dummy (ไม่ใช้จริง)
            fullname: form.name,            // 🔥 map name → fullname
            phone: form.phone,
            address: "contact",             // 🔥 dummy
            contactTime: "anytime",         // 🔥 dummy
        };

        /* ======================================================
           🔥 VALIDATE
        ====================================================== */
        const validate = validateForm(mappedForm);

        /* ======================================================
           🔥 แปลง error กลับให้ตรง UI
        ====================================================== */
        const newErrors: any = {
            topic: validate.loanType,
            name: validate.fullname,
            phone: validate.phone,
            message: !form.message ? "*กรุณากรอกข้อความ" : "",
        };

        /* ======================================================
           ❌ ERROR
        ====================================================== */
        if (
            newErrors.topic ||
            newErrors.name ||
            newErrors.phone ||
            newErrors.message
        ) {
            setErrors(newErrors);
            return;
        }

        /* ======================================================
           ✅ SUCCESS
        ====================================================== */
        setErrors({});

        console.log("📩 FORM DATA:", form);

        Swal.fire({
            icon: "success",
            title: "ส่งสำเร็จ!",
            text: "ทีมงานจะติดต่อกลับโดยเร็วที่สุด",
            confirmButtonColor: "var(--color-info)",
        });

        /* ======================================================
           🔥 RESET
        ====================================================== */
        setForm({
            topic: "",
            name: "",
            phone: "",
            email: "",
            message: "",
        });
    };
    return (
        <Box sx={{ px: { xs: 4, md: 6 }, pt: 0 }}>
            <Box sx={{ maxWidth: "lg", mx: "auto", position: "relative" }}>

                {/* IMAGE */}
                <Box
                    sx={{
                        width: "100vw",              // 🔥 เต็มจอจริง
                        position: "relative",
                        left: "50%",
                        transform: "translateX(-50%)", // 🔥 ดึงกลับกลาง
                        overflow: "hidden",
                    }}
                >
                    <Image
                        src="/company/company.jpg"   // 🔥 ใช้รูปใหม่
                        alt="contact"
                        width={1903}
                        height={1051}
                        style={{
                            width: "100%",
                            height: "auto",
                            display: "block",
                        }}
                        priority
                    />
                </Box>

                {/* FORM */}
                <Box
                    sx={{
                        position: { md: "absolute" },
                        right: { md: 21 },

                        top: { md: 90 },        // 🔥 แทน 57%
                        transform: "none",       // 🔥 เอาออก

                        width: { xs: "100%", md: 490 },
                        mt: { xs: 3, md: 0 },
                    }}
                >
                    {/* HEADER */}
                    <Box
                        sx={{
                            background: "linear-gradient(90deg,#1C3563,#2E5AAC)",
                            color: "#fff",
                            textAlign: "center",
                            py: 2,
                            borderRadius: "40px 40px 0 0",
                            fontWeight: 600,
                            fontSize: "32px",
                        }}
                    >
                        สอบถามข้อมูลเพิ่มเติม
                    </Box>

                    {/* FORM UI */}
                    <FormContainer>
                        <Box
                            sx={{
                                background: "#fff",
                                borderRadius: "0 0 40px 40px",
                                px: { xs: 3, md: 4 },
                                pt: 2,
                                pb: 4,
                            }}
                        >

                            {/* SELECT */}
                            <Box className={`form-group ${errors.topic ? "error" : ""}`}>
                                <Typography>เลือกหัวข้อ <span style={{ color: "red" }}>*</span></Typography>

                                <TextField
                                    select
                                    fullWidth
                                    value={form.topic || ""}
                                    onChange={(e) => handle("topic", e.target.value)}
                                    SelectProps={{
                                        ...selectProps,
                                        displayEmpty: true,
                                        renderValue: (selected) => {
                                            if (!selected) {
                                                return (
                                                    <span style={{ color: "#98A2B3" }}>
                                                        กรุณาเลือกหัวข้อ
                                                    </span>
                                                );
                                            }

                                            const selectedItem = topics.find(
                                                (t) => t.id === selected
                                            );

                                            return selectedItem?.label || "";
                                        },
                                    }}
                                >
                                    {/* ❌ ซ่อน placeholder ใน dropdown */}
                                    <MenuItem value="" disabled sx={{ display: "none" }}>
                                        กรุณาเลือกหัวข้อ
                                    </MenuItem>

                                    {/* ✅ ตัวเลือกจริง */}
                                    {topics.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.label}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                {errors.topic && (
                                    <Typography className="error-text">{errors.topic}</Typography>
                                )}
                            </Box>

                            {/* NAME */}
                            <Box className={`form-group ${errors.name ? "error" : ""}`}>
                                <Typography>ชื่อ - นามสกุล <span style={{ color: "red" }}>*</span></Typography>
                                <TextField
                                    fullWidth
                                    value={form.name}
                                    onChange={(e) => handle("name", e.target.value)}
                                />
                                {errors.name && (
                                    <Typography className="error-text">{errors.name}</Typography>
                                )}
                            </Box>

                            {/* PHONE */}
                            <Box className={`form-group ${errors.phone ? "error" : ""}`}>
                                <Typography>เบอร์โทรศัพท์ <span style={{ color: "red" }}>*</span></Typography>
                                <TextField
                                    fullWidth
                                    value={form.phone}
                                    onChange={(e) => handle("phone", e.target.value)}
                                />
                                {errors.phone && (
                                    <Typography className="error-text">{errors.phone}</Typography>
                                )}
                            </Box>

                            {/* EMAIL */}
                            <Box className="form-group">
                                <Typography>อีเมล (ถ้ามี)</Typography>
                                <TextField
                                    fullWidth
                                    value={form.email}
                                    onChange={(e) => handle("email", e.target.value)}
                                />
                            </Box>

                            {/* MESSAGE */}
                            <Box className={`form-group ${errors.message ? "error" : ""}`}>
                                <Typography>ฝากข้อความ <span style={{ color: "red" }}>*</span></Typography>
                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={4}
                                    maxRows={10}
                                    value={form.message}
                                    onChange={(e) => handle("message", e.target.value)}
                                />
                                {errors.message && (
                                    <Typography className="error-text">{errors.message}</Typography>
                                )}
                            </Box>

                            <Box
                                component="button"
                                type="button"
                                onClick={handleSubmit}
                                sx={{
                                    mt: 2,
                                    textAlign: "center",
                                    py: "14px",
                                    borderRadius: "999px",
                                    background: "var(--color-secondary)",        // 🔥 สีปุ่ม
                                    color: "var(--color-primary)",               // 🔥 สีข้อความ
                                    fontWeight: 600,
                                    fontSize: "16px",
                                    cursor: "pointer",
                                    border: "none",
                                    width: "100%",
                                    fontFamily: "inherit",                      // 🔥 กันฟ้อนเพี้ยน
                                    transition: "0.2s",

                                    "&:hover": {
                                        background: "var(--color-secondary-hover)", // 🔥 hover
                                    },
                                }}
                            >
                                ส่งข้อความ
                            </Box>
                        </Box>
                    </FormContainer>
                </Box>

            </Box>
        </Box>
    );
}