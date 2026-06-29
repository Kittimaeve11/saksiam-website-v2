"use client";

import Image from "next/image";
import React, { useState } from "react";
import {
  Box,
  Card,
  MenuItem,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";

import BasicTextDetailField from "@/app/components/form/BasicTextDetailField";
import BasicTextField from "@/app/components/form/BasicTextField";
import useLockPageScroll from "@/app/components/form/useLockPageScroll";
import TextButton from "@/app/components/ui/Button/TextButton";
import { showSuccessAlert } from "@/app/components/ui/SweetAlert/SweetAlert";
import { apiFetch } from "@/app/api/client";
import { verifyRecaptcha } from "@/app/Utils/recaptcha";
import TopicDropDownselete from "@/app/views/Topic/TopicDropDownselete";
import type { ApplicationResponse } from "@/app/Utils/type";

type InquiryErrors = {
  selectedTopic?: string;
  contactChannel?: string;
  projectName?: string;
  fullname?: string;
  phone?: string;
  email?: string;
  detail?: string;
  captcha?: string;
};

const contactChannels = [
  { label: "Facebook", icon: "/Social/facebook.png" },
  { label: "Line", icon: "/Social/line.png" },
  { label: "Instagram", icon: "/Social/instagram.png" },
  { label: "YouTube", icon: "/Social/youtube.png" },
  { label: "TikTok", icon: "/Social/tiktok.png" },
];

const initialErrors: InquiryErrors = {
  selectedTopic: "",
  contactChannel: "",
  projectName: "",
  fullname: "",
  phone: "",
  email: "",
  detail: "",
  captcha: "",
};

const validateInquiryForm = (formData: {
  selectedTopic: string | null;
  contactChannel: string;
  projectName: string;
  fullname: string;
  phone: string;
  email: string;
  detail: string;
}) => {
  const errors: InquiryErrors = {};

  if (!formData.selectedTopic) {
    errors.selectedTopic = "กรุณาเลือกหัวข้อสอบถาม";
  }

  if (!formData.fullname.trim()) {
    errors.fullname = "กรุณากรอกชื่อ-นามสกุล";
  }

  if (!formData.phone.trim()) {
    errors.phone = "กรุณากรอกหมายเลขโทรศัพท์";
  } else if (!/^[0-9]+$/.test(formData.phone)) {
    errors.phone = "กรุณากรอกเฉพาะตัวเลข";
  } else if (formData.phone.length !== 10) {
    errors.phone = "กรอกหมายเลข 10 หลัก";
  }

  if (!formData.contactChannel) {
    errors.contactChannel = "กรุณาเลือกช่องทางการติดต่อ";
  }

  if (!formData.detail.trim()) {
    errors.detail = "กรุณากรอกระบุข้อความ";
  }

  return errors;
};

type ContactInquiryFormProps = {
  showProjectField?: boolean;
  enableSubmit?: boolean;
};

export function ContactInquiryProjectForm() {
  return <ContactInquiryForm showProjectField enableSubmit={false} />;
}

export default function ContactInquiryForm({
  showProjectField = false,
  enableSubmit = true,
}: ContactInquiryFormProps) {
  const theme = useTheme();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [contactChannel, setContactChannel] = useState("");
  const [projectName, setProjectName] = useState("");
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [detail, setDetail] = useState("");
  const [error, setError] = useState<InquiryErrors>(initialErrors);
  const [submitting, setSubmitting] = useState(false);
  const [contactChannelMenuOpen, setContactChannelMenuOpen] = useState(false);

  useLockPageScroll(contactChannelMenuOpen);

  const getFormData = () => ({
    selectedTopic,
    contactChannel,
    projectName,
    fullname,
    phone,
    email,
    detail,
  });

  const handleFieldChange = (fieldName: string, value: unknown) => {
    const errors = validateInquiryForm({
      ...getFormData(),
      [fieldName]: value,
    });

    setError((prev) => ({
      ...prev,
      [fieldName]: errors[fieldName as keyof InquiryErrors] || "",
      captcha: "",
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = getFormData();
    const errors = validateInquiryForm(formData);

    if (Object.values(errors).some(Boolean)) {
      setError({ ...initialErrors, ...errors });
      return;
    }

    if (!enableSubmit) {
      return;
    }

    const payload = {
      name: fullname,
      phone,
      email,
      detail,
      subject: selectedTopic,
      type: "2",
      solce: contactChannel,
      status: 2,
      savename: "ผู้เยี่ยมชม",
    };

    try {
      setSubmitting(true);
      setError((prev) => ({ ...prev, captcha: "" }));

      await verifyRecaptcha("contact_inquiry_submit");

      const response = await apiFetch<ApplicationResponse>(
        "/api/applicationcmcapi",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.status) {
        throw new Error(response.message || "บันทึกข้อมูลไม่สำเร็จ");
      }

      const customerId = response.data?.customer_id ?? 0;

      try {
        await apiFetch("/api/logapi", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            actionType: 6,
            actionDetail: `บันทึกข้อมูลผู้ติดต่อสอบถาม ชื่อผู้แจ้งเรื่อง: ${fullname} เบอร์โทรศัพท์: ${phone} หัวข้อ: ${selectedTopic} ช่องทางการติดต่อ: ${contactChannel}`,
            datatype: "ติดต่อสอบถาม",
            dataname: selectedTopic || "",
            dataID: customerId,
            typeUser: "ผู้เยี่ยมชมเว็บไซต์",
            datatypeID: "0",
            brandtype: "0",
          }),
        });
      } catch (logError) {
        console.error("contact inquiry log error:", logError);
      }

      await showSuccessAlert({
        text: response.message || "บันทึกข้อมูลเรียบร้อย",
      });

      setSelectedTopic(null);
      setContactChannel("");
      setProjectName("");
      setFullname("");
      setPhone("");
      setEmail("");
      setDetail("");
      setError(initialErrors);
    } catch (err) {
      console.error("contact inquiry submit error:", err);
      setError((prev) => ({
        ...prev,
        captcha: "*เกิดข้อผิดพลาด กรุณาลองใหม่",
      }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: 680,
        mx: "auto",
        borderRadius: { xs: 6, md: 8 },
        overflow: "hidden",
        boxShadow: "0 24px 70px rgba(17, 42, 90, 0.18)",
        border: "1px solid rgba(28, 53, 99, 0.08)",
      }}
    >
      <Box
        sx={{
          position: "relative",
          aspectRatio: "16 / 9",
          textAlign: "center",
          color: "#fff",
          overflow: "hidden",
        }}
      >
        <Image
          src="/background/06d1b4e4-9f78-4283-b015-f8a5e353db86.png"
          alt=""
          fill
          priority
          sizes="(max-width: 768px) 100vw, 680px"
          style={{
            objectFit: "contain",
            objectPosition: "top center",
          }}
        />
        <Image
          src="/Icons/Logo_SAK.png"
          alt="Saksiam"
          width={150}
          height={150}
          priority
          style={{
            position: "absolute",
            top: "4%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "clamp(76px, 18vw, 150px)",
            height: "auto",
            objectFit: "contain",
            display: "block",
          }}
        />
        <Typography
          component="h1"
          sx={{
            position: "absolute",
            left: { xs: 2, sm: 4 },
            right: { xs: 2, sm: 4 },
            top: { xs: "44%", sm: "45%" },
            fontSize: { xs: 22, sm: 28, md: 32 },
            fontWeight: 800,
            lineHeight: 1.25,
          }}
        >
          ฟอร์มบันทึกข้อมูลผู้ติดต่อสอบถาม
        </Typography>
      </Box>

      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{
          position: "relative",
          zIndex: 1,
          mt: { xs: "-17%", sm: "-17%" },
          px: { xs: 3, sm: 5 },
          pt: { xs: 2, sm: 2.5 },
          pb: { xs: 4, md: 5 },
        }}
      >
        <TopicDropDownselete
          selecte={selectedTopic}
          setSelected={setSelectedTopic}
          handleFieldChange={handleFieldChange}
          error={error.selectedTopic}
          topon={0}
          fieldKey="selectedTopic"
          specify
          titlename="หัวข้อแบบสอบถาม"
        />

        <BasicTextField
          name="ชื่อ - นามสกุลผู้สอบถาม"
          titlename="กรุณากรอกชื่อ - นามสกุลผู้สอบถาม"
          subject={fullname}
          setsubject={setFullname}
          topon={1}
          handleFieldChange={handleFieldChange}
          error={error.fullname}
          fieldKey="fullname"
          specify
        />

        <BasicTextField
          name="เบอร์โทรศัพท์"
          titlename="กรุณากรอกเบอร์โทรศัพท์"
          subject={phone}
          setsubject={setPhone}
          topon={1}
          handleFieldChange={handleFieldChange}
          error={error.phone}
          fieldKey="phone"
          specify
        />

        <BasicTextField
          name="อีเมล"
          titlename="กรุณากรอกอีเมล"
          subject={email}
          setsubject={setEmail}
          topon={1}
          handleFieldChange={handleFieldChange}
          error={error.email}
          fieldKey="email"
          specify={false}
        />

        <Box sx={{ mt: 1 }}>
          <Typography variant="h6" component="label">
            ช่องทางการติดต่อ{" "}
            <span style={{ color: theme.palette.error.main }}>*</span>
          </Typography>
          <TextField
            select
            size="small"
            fullWidth
            value={contactChannel || "0"}
            onChange={(event) => {
              setContactChannel(event.target.value);
              handleFieldChange("contactChannel", event.target.value);
            }}
            error={Boolean(error.contactChannel)}
            helperText={error.contactChannel}
            slotProps={{
              select: {
                onOpen: () => setContactChannelMenuOpen(true),
                onClose: () => setContactChannelMenuOpen(false),
                MenuProps: {
                  disableScrollLock: true,
                },
                renderValue: (value) => {
                  const selected = contactChannels.find(
                    (channel) => channel.label === String(value)
                  );

                  if (!selected) {
                    return (
                      <Box
                        sx={{
                          color: error.contactChannel
                            ? theme.palette.error.main
                            : theme.palette.grey[500],
                        }}
                      >
                        เลือกช่องทางการติดต่อ
                      </Box>
                    );
                  }

                  return (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        component="img"
                        src={selected.icon}
                        alt=""
                        sx={{ width: 22, height: 22, objectFit: "contain" }}
                      />
                      {selected.label}
                    </Box>
                  );
                },
              },
            }}
            sx={{
              mt: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: 999,
                "& fieldset": {
                  borderColor: error.contactChannel
                    ? theme.palette.error.main
                    : theme.palette.grey[300],
                  borderWidth: 1.5,
                },
                "&:hover fieldset": {
                  borderColor: theme.palette.primary.main,
                },
                "&.Mui-focused fieldset": {
                  borderColor: theme.palette.primary.main,
                  borderWidth: 2,
                },
              },
            }}
          >
            <MenuItem value="0">
              <Box
                sx={{
                  color: error.contactChannel
                    ? theme.palette.error.main
                    : theme.palette.grey[500],
                }}
              >
                เลือกช่องทางการติดต่อ
              </Box>
            </MenuItem>
            {contactChannels.map((channel) => (
              <MenuItem key={channel.label} value={channel.label}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    component="img"
                    src={channel.icon}
                    alt=""
                    sx={{ width: 24, height: 24, objectFit: "contain" }}
                  />
                  {channel.label}
                </Box>
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {showProjectField && (
          <BasicTextField
            name="โครงการเพิ่มเติม"
            titlename="กรุณากรอกโครงการเพิ่มเติม"
            subject={projectName}
            setsubject={setProjectName}
            topon={1}
            handleFieldChange={handleFieldChange}
            error={error.projectName}
            fieldKey="projectName"
            specify={false}
          />
        )}

        <BasicTextDetailField
          name="ฝากข้อความ"
          titlename="กรุณากรอกฝากข้อความ"
          subject={detail}
          setsubject={setDetail}
          topon={1}
          handleFieldChange={handleFieldChange}
          error={error.detail}
          fieldKey="detail"
          specify
          row={6}
        />

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <TextButton
            type="submit"
            disabled={submitting}
            sx={{
              mt: 3,
              width: { xs: "100%", sm: 260 },
              height: 52,
              borderRadius: "999px",
              fontSize: 16,
              fontWeight: 700,
              background: "linear-gradient(90deg,#FFAA37 0%,#FFC107 100%)",
              boxShadow: "none",
              "&:hover": {
                background:
                  "linear-gradient(135deg,#FFC107 0%,#FFAA37 100%)",
              },
            }}
          >
            ส่งข้อมูล
          </TextButton>
        </Box>

        {error.captcha && (
          <Typography
            sx={{
              mt: 1.5,
              color: "error.main",
              fontSize: 13,
              textAlign: "center",
            }}
          >
            {error.captcha}
          </Typography>
        )}
      </Box>
    </Card>
  );
}
