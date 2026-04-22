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

/* ====================================================== */
import FormContainer from "@/app/components/form/FormContainer";
import { IoIosArrowDown } from "react-icons/io";
import { validateForm } from "@/app/Utils/validation";
import Swal from "sweetalert2";

/* ====================================================== */
export default function ContactHero({ onErrorChange }: any) {
  /* ======================================================
     STATE
  ====================================================== */
  const [form, setForm] = useState({
    topic: "",
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [topics, setTopics] = useState<any[]>([]);

  /* ======================================================
     HANDLE INPUT
  ====================================================== */
  const handle = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));

    setErrors((prev: any) => ({
      ...prev,
      [key]: "",
    }));
  };

  /* ======================================================
     ERROR COUNT
  ====================================================== */
  useEffect(() => {
    const errorCount = Object.keys(errors).filter(
      (key) => errors[key]
    ).length;

    onErrorChange?.(errorCount);
  }, [errors]);

  /* ======================================================
     FETCH TOPICS
  ====================================================== */
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

  /* ======================================================
     SUBMIT
  ====================================================== */
  const handleSubmit = () => {
    const mappedForm = {
      isCustomer: "yes",
      loanType: form.topic,
      amount: "1000",
      fullname: form.name,
      phone: form.phone,
      address: "contact",
      contactTime: "anytime",
    };

    const validate = validateForm(mappedForm);

    const newErrors: any = {
      topic: validate.loanType,
      name: validate.fullname,
      phone: validate.phone,
      message: !form.message ? "*กรุณากรอกข้อความ" : "",
    };

    if (
      newErrors.topic ||
      newErrors.name ||
      newErrors.phone ||
      newErrors.message
    ) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    Swal.fire({
      icon: "success",
      title: "ส่งสำเร็จ!",
      text: "ทีมงานจะติดต่อกลับโดยเร็วที่สุด",
      confirmButtonColor: "var(--color-info)",
    });

    setForm({
      topic: "",
      name: "",
      phone: "",
      email: "",
      message: "",
    });
  };

  /* ======================================================
     UI
  ====================================================== */
  return (
    <Box sx={{ px: { xs: 4, md: 6 }, pt: 0 }}>
      <Box sx={{ maxWidth: "lg", mx: "auto", position: "relative" }}>
        
        {/* IMAGE */}
        <Box
          sx={{
            width: "100vw",
            position: "relative",
            left: "50%",
            transform: "translateX(-50%)",
            overflow: "hidden",
          }}
        >
          <Image
            src="/company/company.jpg"
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
            top: { md: 90 },
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
                <Typography>
                  เลือกหัวข้อ <span style={{ color: "red" }}>*</span>
                </Typography>

                <TextField
                  select
                  fullWidth
                  value={form.topic || ""}
                  onChange={(e) => handle("topic", e.target.value)}
                  slotProps={{
                    select: {
                      IconComponent: IoIosArrowDown,
                      displayEmpty: true,
                      renderValue: (selected: any) => {
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
                    },
                  }}
                >
                  <MenuItem value="" disabled sx={{ display: "none" }}>
                    กรุณาเลือกหัวข้อ
                  </MenuItem>

                  {topics.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.label}
                    </MenuItem>
                  ))}
                </TextField>

                {errors.topic && (
                  <Typography className="error-text">
                    {errors.topic}
                  </Typography>
                )}
              </Box>

              {/* NAME */}
              <Box className={`form-group ${errors.name ? "error" : ""}`}>
                <Typography>
                  ชื่อ - นามสกุล <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  value={form.name}
                  onChange={(e) => handle("name", e.target.value)}
                />
                {errors.name && (
                  <Typography className="error-text">
                    {errors.name}
                  </Typography>
                )}
              </Box>

              {/* PHONE */}
              <Box className={`form-group ${errors.phone ? "error" : ""}`}>
                <Typography>
                  เบอร์โทรศัพท์ <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  value={form.phone}
                  onChange={(e) => handle("phone", e.target.value)}
                />
                {errors.phone && (
                  <Typography className="error-text">
                    {errors.phone}
                  </Typography>
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
                <Typography>
                  ฝากข้อความ <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  minRows={4}
                  value={form.message}
                  onChange={(e) => handle("message", e.target.value)}
                />
                {errors.message && (
                  <Typography className="error-text">
                    {errors.message}
                  </Typography>
                )}
              </Box>

              {/* BUTTON */}
              <Box
                component="button"
                type="button"
                onClick={handleSubmit}
                sx={{
                  mt: 2,
                  py: "14px",
                  borderRadius: "999px",
                  background: "var(--color-secondary)",
                  color: "var(--color-primary)",
                  fontWeight: 600,
                  fontSize: "16px",
                  cursor: "pointer",
                  border: "none",
                  width: "100%",
                  transition: "0.2s",
                  "&:hover": {
                    background: "var(--color-secondary-hover)",
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