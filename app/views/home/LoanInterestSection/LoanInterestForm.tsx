"use client";

declare global {
  interface Window {
    grecaptcha: any;
  }
}


/* ======================================================
   IMPORT
====================================================== */
import { Box, Typography, TextField, MenuItem, RadioGroup, FormControlLabel, Radio, } from "@mui/material";
import { useState } from "react";
import FormContainer from "@/app/components/form/FormContainer";
import { IoIosArrowDown } from "react-icons/io";
import { validateForm } from "@/app/Utils/validation";
import ConsentBox from "@/app/components/form/ConsentBox";
import Swal from "sweetalert2";

/* ======================================================
   COMPONENT
====================================================== */
export default function LoanInterestForm(

  {
    provinces = [],
    amphures = [],
    tambons = [],
    services = [],
  }: any
) {
  const selectProps = {
    IconComponent: IoIosArrowDown,
  };

  const [form, setForm] = useState<any>({});
  const [errors, setErrors] = useState<any>({});
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showConsent, setShowConsent] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const resetForm = () => {
    setForm({
      isCustomer: "",
      loanType: "",
      amount: "",
      fullname: "",
      phone: "",
      address: "",
      contactTime: "",
      topic: "",
      message: "",
    });

    setErrors({});
    setAccepted(false);
    setShowConsent(false);
    setQuery("");
    setSuggestions([]);
  };

  const selectedService = services.find(
    (s: any) => s.id === form.loanType
  );

  const handle = (key: string, val: any) => {
    setForm((prev: any) => ({ ...prev, [key]: val }));
    setErrors((prev: any) => ({ ...prev, [key]: "" }));
  };

  const formatNumber = (value: string) => {
    if (!value) return "";
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const executeRecaptcha = async () => {
    try {
      if (!window.grecaptcha) return null;

      return await window.grecaptcha.execute(
        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
        { action: "submit" }
      );
    } catch (err) {
      console.error(err);
      return null;
    }
  };


  const handleSubmit = () => {
    /* ======================================================
       🔥 รวมค่าให้แน่นอน (สำคัญสุด)
    ====================================================== */
    const finalForm = {
      ...form,
      address: (form.address || query || "").trim(),
      amount: String(form.amount || "").replace(/,/g, "").trim(),
    };

    /* ======================================================
       🔥 validate ครั้งเดียว (จบ)
    ====================================================== */
    const validate = validateForm(finalForm, services);

    if (Object.keys(validate).length > 0) {
      setErrors(validate);
      return;
    }

    /* ======================================================
       🔥 หา service
    ====================================================== */
    const selectedService = services.find(
      (s: any) => Number(s.id) === Number(finalForm.loanType)
    );

    if (!selectedService) {
      setErrors({
        loanType: "*ไม่พบข้อมูลสินเชื่อที่เลือก",
      });
      return;
    }

    /* ======================================================
       🔥 เช็ควงเงิน (ชัวร์อีกชั้น)
    ====================================================== */
    const amount = Number(finalForm.amount);

    if (Number.isNaN(amount) || amount <= 0) {
      setErrors({
        amount: "*กรุณากรอกวงเงินให้ถูกต้อง",
      });
      return;
    }

    if (amount < selectedService.minAmount) {
      setErrors({
        amount: `*วงเงินต้องไม่น้อยกว่า ${selectedService.minAmount.toLocaleString()} บาท`,
      });
      return;
    }

    if (amount > selectedService.maxAmount) {
      setErrors({
        amount: `*วงเงินต้องไม่เกิน ${selectedService.maxAmount.toLocaleString()} บาท`,
      });
      return;
    }

    /* ======================================================
       ✅ ผ่านหมด
    ====================================================== */
    setErrors({}); // 🔥 เคลียร์ error สุดท้าย
    setShowConsent(true);
  };


  const handleQueryChange = (e: any) => {
    const text = e.target.value.trim();
    setQuery(text);

    if (!text) {
      setSuggestions([]);
      return;
    }

    if (!tambons?.length || !amphures?.length || !provinces?.length) {
      setSuggestions([]);
      return;
    }

    const keyword = text.toLowerCase();
    const result: any[] = [];

    for (let i = 0; i < tambons.length; i++) {
      const t = tambons[i];

      const a = amphures.find(
        (x: any) => x.id === t.amphure_id
      );

      if (!a) continue;

      const p = provinces.find(
        (x: any) => x.id === a.province_id
      );

      if (!p) continue;

      const tName = (t.name_th || "").toLowerCase();
      const aName = (a.name_th || "").toLowerCase();
      const pName = (p.name_th || "").toLowerCase();

      if (
        tName.includes(keyword) ||
        aName.includes(keyword) ||
        pName.includes(keyword)
      ) {
        result.push({
          subDistrict: t.name_th,
          district: a.name_th,
          province: p.name_th,
        });

        if (result.length >= 30) break;
      }
    }


    setSuggestions(result);
  };

  const handleSelect = (item: any) => {
    const text = `${item.subDistrict} ${item.district} ${item.province}`;

    setQuery(text);

    setForm((prev: any) => ({
      ...prev,
      address: text,
    }));

    // 🔥 เคลียร์ error ทันที
    setErrors((prev: any) => ({
      ...prev,
      address: "",
    }));

    setSuggestions([]);
  };

  const highlightText = (text: string, keyword: string) => {
    if (!keyword) return text;

    const regex = new RegExp(`(${keyword})`, "gi");

    return text.split(regex).map((part, i) =>
      part.toLowerCase() === keyword.toLowerCase() ? (
        <span key={i} style={{ color: "var(--color-info)", fontWeight: 600 }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };


  return (
    <Box
      sx={{
        position: "relative",
        zIndex: 0,
        borderRadius: "110px", // 🔥 ปรับให้สวย (ไม่ต้อง 110 แล้ว)
        background: "#fff",
        boxShadow: "0 20px 40px rgba(0,0,0,0.12)",

        px: { xs: 5, md: 6 },
        pt: { xs: 6, md: 10 },
        pb: { xs: 5, md: 10 },

        /* ======================================================
           🔥 GRADIENT BORDER (ตัวจริง)
        ====================================================== */
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          borderRadius: "110px",
          padding: "8px", // ⭐ ความหนากรอบ

          background: "linear-gradient(135deg, #4369BE, #ffffff,#ffffff,#ffffff, #FBD53F)",

          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",

          pointerEvents: "none",
        },
      }}
    >
      <FormContainer>
        {/* TITLE */}
        <Typography
          sx={{
            textAlign: "center",
            fontSize: { xs: "28px", md: "40px" },
            fontWeight: 800,
            mb: { xs: 2, md: 3 },
            color: "#1C3563",
          }}
        >
          เลือกสินเชื่อที่คุณสนใจ
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column" }}>

          {/* ================= RADIO ================= */}
          <Box className={`form-group ${errors.isCustomer ? "error" : ""}`}>
            <Typography>
              เคยใช้บริการศักดิ์สยามหรือไม่ <span style={{ color: "red" }}>*</span>
            </Typography>

            <RadioGroup
              name="isCustomer"
              row
              value={form.isCustomer || ""}
              onChange={(e) => handle("isCustomer", e.target.value)}
              sx={{
                gap: 2,
                "& .MuiTypography-root": {
                  fontSize: "16px",
                },
              }}
            >
              <FormControlLabel
                value="yes"
                control={
                  <Radio
                    slotProps={{
                      input: {
                        autoComplete: "off",
                      },
                    }}
                  />
                }
                label="เคย"
              />

              <FormControlLabel
                value="no"
                control={
                  <Radio
                    slotProps={{
                      input: {
                        autoComplete: "off",
                      },
                    }}
                  />
                }
                label="ไม่เคย"
              />
            </RadioGroup>

            {errors.isCustomer && (
              <Typography className="error-text">
                {errors.isCustomer}
              </Typography>
            )}
          </Box>

          {/* ================= SELECT ================= */}
          <Box className={`form-group ${errors.loanType ? "error" : ""}`}>

            {/* ✅ เพิ่ม label */}
            <Typography>
              ประเภทสินเชื่อที่ต้องการสมัคร <span style={{ color: "red" }}>*</span>
            </Typography>

            <TextField
              id="loanType"
              name="loanType"
              autoComplete="off"
              select
              fullWidth
              value={form.loanType || ""}
              onChange={(e) => handle("loanType", e.target.value)}
              error={!!errors.loanType}
              slotProps={{
                select: {
                  ...selectProps,
                  displayEmpty: true,
                  renderValue: (selected) => {
                    if (!selected) {
                      return (
                        <span style={{ color: "#98A2B3" }}>
                          ประเภทสินเชื่อที่ต้องการสมัคร
                        </span>
                      );
                    }

                    const selectedItem = services.find(
                      (s: any) => s.id === selected
                    );

                    return selectedItem?.titleTH || "";
                  },
                },
              }}
            >
              {services.map((item: any) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.titleTH}
                </MenuItem>
              ))}
            </TextField>

            {errors.loanType && (
              <Typography className="error-text">
                {errors.loanType}
              </Typography>
            )}
          </Box>

          {/* ================= AMOUNT ================= */}
          <Box className={`form-group ${errors.amount ? "error" : ""}`}>

            {/* 🔥 LABEL */}
            <Typography>
              วงเงินที่ต้องการ <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              id="amount"
              name="amount"
              autoComplete="off"
              fullWidth
              type="text"
              placeholder={
                !selectedService
                  ? "กรุณาเลือกสินเชื่อที่ต้องการสมัครก่อน"
                  : "วงเงินที่ต้องการ"
              }
              value={
                form.amount
                  ? Number(form.amount).toLocaleString()
                  : ""
              }
              disabled={!selectedService}
              onChange={(e) => {
                const raw = e.target.value.replace(/,/g, "");
                const onlyNumber = raw.replace(/[^0-9]/g, "");

                setForm((prev: any) => ({
                  ...prev,
                  amount: onlyNumber,
                }));

                if (!selectedService) return;

                const amount = Number(onlyNumber);

                if (!onlyNumber) {
                  setErrors((prev: any) => ({
                    ...prev,
                    amount: "*กรุณากรอกวงเงินที่ต้องการ",
                  }));
                  return;
                }

                if (amount < selectedService.minAmount) {
                  setErrors((prev: any) => ({
                    ...prev,
                    amount: `*วงเงินขั้นต่ำ ${selectedService.minAmount.toLocaleString()} บาท`,
                  }));
                  return;
                }

                if (amount > selectedService.maxAmount) {
                  setErrors((prev: any) => ({
                    ...prev,
                    amount: `*วงเงินสูงสุด ${selectedService.maxAmount.toLocaleString()} บาท`,
                  }));
                  return;
                }

                setErrors((prev: any) => ({
                  ...prev,
                  amount: "",
                }));
              }}
              error={!!errors.amount}
              slotProps={{
                htmlInput: {
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                },
              }}
            />


            {/* 🔥 แสดงช่วงวงเงิน */}
            {selectedService && (
              <Typography sx={{ fontSize: "14px", color: "#98A2B3", mt: "4px" }}>
                วงเงิน {selectedService.minAmount.toLocaleString()} -{" "}
                {selectedService.maxAmount.toLocaleString()} บาท
              </Typography>
            )}

            {/* 🔥 ERROR */}
            {errors.amount && (
              <Typography className="error-text">
                {errors.amount}
              </Typography>
            )}
          </Box>

          {/* ================= NAME + PHONE ================= */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            {/* ================= NAME ================= */}
            <Box
              sx={{ flex: 1 }}
              className={`form-group ${errors.fullname ? "error" : ""}`}
            >              <Typography>
                ชื่อ - นามสกุล <span style={{ color: "red" }}>*</span>
              </Typography>

              <TextField
                id="fullname"
                name="fullname"
                autoComplete="name"
                fullWidth
                placeholder="ชื่อ - นามสกุล"
                value={form.fullname || ""}

                // 🔥 กัน key ผิด
                onKeyDown={(e) => {
                  const allow = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", " "];
                  const isThai = /^[ก-๙]$/.test(e.key);

                  if (!isThai && !allow.includes(e.key)) {
                    e.preventDefault();
                  }
                }}

                // 🔥 กัน paste
                onPaste={(e) => {
                  const paste = e.clipboardData.getData("text");
                  if (!/^[ก-๙\s]+$/.test(paste)) e.preventDefault();
                }}

                onChange={(e) => {
                  const cleaned = e.target.value
                    .replace(/[^\u0E00-\u0E7F\s]/g, "") // ไทย + space
                    .replace(/\s+/g, " "); // กัน space ซ้อน

                  setForm((prev: any) => ({
                    ...prev,
                    fullname: cleaned,
                  }));

                  setErrors((prev: any) => ({
                    ...prev,
                    fullname: "",
                  }));
                }}

                error={!!errors.fullname}
              />

              {errors.fullname && (
                <Typography className="error-text">
                  {errors.fullname}
                </Typography>
              )}
            </Box>

            {/* ================= PHONE ================= */}
            <Box
              sx={{ flex: 1 }}
              className={`form-group ${errors.phone ? "error" : ""}`}
            >
              <Typography>
                เบอร์โทร <span style={{ color: "red" }}>*</span>
              </Typography>

              <TextField
                id="phone"
                name="phone"
                autoComplete="tel"
                fullWidth
                placeholder="0985417892"
                value={form.phone || ""}
                onKeyDown={(e) => {
                  const allow = [
                    "Backspace",
                    "Delete",
                    "ArrowLeft",
                    "ArrowRight",
                    "Tab",
                  ];

                  if (!/[0-9]/.test(e.key) && !allow.includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                onPaste={(e) => {
                  const paste = e.clipboardData.getData("text");

                  if (!/^\d+$/.test(paste)) {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  const onlyNumber = e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10);

                  setForm((prev: any) => ({
                    ...prev,
                    phone: onlyNumber,
                  }));

                  setErrors((prev: any) => ({
                    ...prev,
                    phone: "",
                  }));
                }}
                error={!!errors.phone}
                slotProps={{
                  htmlInput: {
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                  },
                }}
              />

              {errors.phone && (
                <Typography className="error-text">
                  {errors.phone}
                </Typography>
              )}
            </Box>
          </Box>

          {/* ================= ADDRESS ================= */}
          <Box
            className={`form-group ${errors.address ? "error" : ""}`}
            sx={{ position: "relative" }}
          >
            <Typography>
              ที่อยู่ <span style={{ color: "red" }}>*</span>
            </Typography>

            <TextField
              id="address"
              name="address"
              autoComplete="street-address"
              fullWidth
              value={query}
              error={!!errors.address}
              placeholder="เช่น (ตำบล)ท่าอิฐ, (อำเภอ)เมืองอุตรดิตถ์, (จังหวัด)อุตรดิตถ์"

              /* ======================================================
                 🔥 KEY CONTROL
              ====================================================== */
              onKeyDown={(e) => {
                const allow = [
                  "Backspace",
                  "Delete",
                  "ArrowLeft",
                  "ArrowRight",
                  "Tab",
                  " ",
                  ",",
                ];

                const isThai = /^[ก-๙]$/.test(e.key);

                if (!isThai && !allow.includes(e.key)) {
                  e.preventDefault();
                }
              }}

              /* ======================================================
                 🔥 PASTE CONTROL
              ====================================================== */
              onPaste={(e) => {
                const paste = e.clipboardData.getData("text");
                if (!/^[ก-๙\s,]+$/.test(paste)) {
                  e.preventDefault();
                }
              }}

              /* ======================================================
                 🔥 FIX: onChange (สำคัญสุด)
              ====================================================== */
              onChange={(e) => {
                const cleaned = e.target.value
                  .replace(/[^\u0E00-\u0E7F\s,]/g, "")
                  .replace(/\s+/g, " ");

                // ✅ อัปเดต query
                setQuery(cleaned);

                // 🔥 sync ไป form ด้วย (สำคัญมาก)
                setForm((prev: any) => ({
                  ...prev,
                  address: cleaned,
                }));

                // 🔥 ลบ error ทันที
                if (cleaned.trim()) {
                  setErrors((prev: any) => ({
                    ...prev,
                    address: "",
                  }));
                }

                // 🔥 เรียก search
                handleQueryChange({
                  ...e,
                  target: { ...e.target, value: cleaned },
                });
              }}
            />

            {/* ======================================================
     🔥 DROPDOWN
  ====================================================== */}
            {suggestions.length > 0 && (
              <Box
                sx={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  mt: 1,
                  maxHeight: 220,
                  overflowY: "auto",
                  background: "#fff",
                  border: "1px solid #D0D5DD",
                  borderRadius: "12px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                  zIndex: 20,
                }}
              >
                {suggestions.map((s, i) => (
                  <Box
                    key={i}
                    onClick={() => {
                      const text = `${s.subDistrict} ${s.district} ${s.province}`;

                      // 🔥 set ทั้งคู่
                      setQuery(text);
                      setForm((prev: any) => ({
                        ...prev,
                        address: text,
                      }));

                      // 🔥 ลบ error ทันที
                      setErrors((prev: any) => ({
                        ...prev,
                        address: "",
                      }));

                      setSuggestions([]);
                    }}
                    sx={{
                      px: 2,
                      py: 1.5,
                      cursor: "pointer",
                      fontSize: "16px",
                      "&:hover": { background: "#F9FAFB" },
                    }}
                  >
                    <>
                      {highlightText(s.subDistrict, query)},{" "}
                      {highlightText(s.district, query)},{" "}
                      {highlightText(s.province, query)}
                    </>
                  </Box>
                ))}
              </Box>
            )}

            {/* ======================================================
                  🔥 ERROR
                ====================================================== */}
            {errors.address && (
              <span className="error-text">{errors.address}</span>
            )}
          </Box>

          {/* ================= TIME ================= */}
          <Box className={`form-group ${errors.contactTime ? "error" : ""}`}>
            <Typography>
              ช่วงเวลาที่สะดวกให้ติดต่อกลับ{" "}
              <span style={{ color: "red" }}>*</span>
            </Typography>

            <TextField
              id="contactTime"
              name="contactTime"
              autoComplete="off"
              select
              fullWidth
              value={form.contactTime || ""}
              onChange={(e) => handle("contactTime", e.target.value)}
              error={!!errors.contactTime}
              slotProps={{
                select: {
                  ...selectProps,
                  displayEmpty: true,
                },
              }}
            >
              {/* 🔥 ซ่อนใน dropdown แต่ยังเป็น placeholder */}
              <MenuItem
                value=""
                disabled
                sx={{ display: "none" }}
              >
                <span style={{ color: "#98A2B3" }}>
                  เลือกช่วงเวลาที่สะดวกให้ติดต่อกลับ
                </span>
              </MenuItem>

              <MenuItem value="08:30-12:00">
                8.30 – 12.00
              </MenuItem>

              <MenuItem value="12:00-13:00">
                12.00 – 13.00
              </MenuItem>

              <MenuItem value="13:00-15:00">
                13.00 – 15.00
              </MenuItem>

              <MenuItem value="15:00-17:30">
                15.00 – 17.30
              </MenuItem>

              <MenuItem value="all">
                ทุกช่วงเวลา
              </MenuItem>
            </TextField>


            {errors.contactTime && (
              <Typography className="error-text">
                {errors.contactTime}
              </Typography>
            )}
          </Box>
        </Box>

        {/* BUTTON */}
        {/* ================= BUTTON ================= */}
        <Box
          onClick={async () => {
            // 🔥 รอบแรก → validate
            if (!showConsent) {
              handleSubmit();
              return;
            }

            // 🔥 ต้องติ๊ก consent ก่อน
            if (!accepted) {
              setErrors((prev: any) => ({
                ...prev,
                consent: "*กรุณายอมรับเงื่อนไขก่อน",
              }));
              return;
            }

            // 🔥 ยิง reCAPTCHA v3
            try {
              if (!window.grecaptcha) {
                setErrors((prev: any) => ({
                  ...prev,
                  captcha: "*ระบบยังไม่พร้อม กรุณาลองใหม่",
                }));
                return;
              }

              const token = await window.grecaptcha.execute(
                process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
                { action: "submit" }
              );

              if (!token) {
                setErrors((prev: any) => ({
                  ...prev,
                  captcha: "*ไม่สามารถยืนยันความปลอดภัยได้",
                }));
                return;
              }

              // 🔥 verify backend
              const res = await fetch("/api/verify-captcha", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ token }),
              });

              const data = await res.json();

              if (!data.success || data.score < 0.5) {
                setErrors((prev: any) => ({
                  ...prev,
                  captcha: "*ระบบตรวจพบความเสี่ยง กรุณาลองใหม่",
                }));
                return;
              }

              // ✅ ผ่าน → submit จริง
              console.log("SUBMIT SUCCESS:", form);

              // 👉 ยิง API จริงตรงนี้

            } catch (err) {
              console.error(err);
              setErrors((prev: any) => ({
                ...prev,
                captcha: "*เกิดข้อผิดพลาด กรุณาลองใหม่",
              }));
            }
          }}
          sx={{
            mt: 2,
            textAlign: "center",
            py: "14px",
            borderRadius: "999px",
            background: "var(--color-primary)",
            color: "#fff",
            fontWeight: 600,
            fontSize: "16px",
            cursor: "pointer",
            transition: "0.2s",

            "&:hover": {
              background: "var(--color-primary-hover)",
            },
          }}
        >
          สมัครขอสินเชื่อ
        </Box>

        {/* ================= CONSENT ================= */}
        {showConsent && (
          <>
            <ConsentBox
              checked={accepted}
              onChange={async (val) => {
                setAccepted(val);

                // 🔥 เอาติ๊กออก → ไม่ทำอะไร
                if (!val) return;

                // 🔥 ลบ error ทั้งหมดที่เกี่ยวข้อง
                setErrors((prev: any) => ({
                  ...prev,
                  consent: "",
                  captcha: "",
                }));

                try {
                  // 🔥 เช็ค grecaptcha
                  if (!window.grecaptcha) {
                    setErrors((prev: any) => ({
                      ...prev,
                      captcha: "*ระบบยังไม่พร้อม กรุณาลองใหม่",
                    }));
                    return;
                  }

                  // 🔥 ยิง reCAPTCHA v3
                  const token = await window.grecaptcha.execute(
                    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
                    { action: "submit" }
                  );

                  if (!token) {
                    setErrors((prev: any) => ({
                      ...prev,
                      captcha: "*ไม่สามารถยืนยันความปลอดภัยได้",
                    }));
                    return;
                  }

                  // 🔥 verify backend
                  const res = await fetch("/api/verify-captcha", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token }),
                  });

                  const data = await res.json();

                  if (!data.success || data.score < 0.5) {
                    setErrors((prev: any) => ({
                      ...prev,
                      captcha: "*ระบบตรวจพบความเสี่ยง กรุณาลองใหม่",
                    }));
                    return;
                  }

                  // ✅ submit จริง
                  console.log("AUTO SUBMIT:", form);

                  // 👉 ยิง API จริงตรงนี้
                  // await fetch("/api/send-form", {...})

                  // 🔥 success feedback (แนะนำ)
                  await Swal.fire({
                    icon: "success",
                    title: "สำเร็จ",
                    text: "ส่งข้อมูลเรียบร้อยแล้ว",
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "var(--color-info)", // 🔥 สีแบรนด์
                  });
                  // 🔥 reset form หลัง submit
                  resetForm();

                } catch (err) {
                  console.error(err);
                  setErrors((prev: any) => ({
                    ...prev,
                    captcha: "*เกิดข้อผิดพลาด กรุณาลองใหม่",
                  }));
                }
              }}
            />

            {/* 🔥 error consent */}
            {errors.consent && (
              <Typography className="error-text">
                {errors.consent}
              </Typography>
            )}

            {/* 🔥 error captcha */}
            {errors.captcha && (
              <Typography className="error-text" sx={{ textAlign: "center", mt: 1 }}>
                {errors.captcha}
              </Typography>
            )}
          </>
        )}
      </FormContainer>
    </Box>
  );
}