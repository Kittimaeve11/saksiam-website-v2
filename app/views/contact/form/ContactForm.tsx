import BasicTextDetailField from '@/app/components/form/BasicTextDetailField';
import BasicTextField from '@/app/components/form/BasicTextField';
import {
    ApplicationResponse,
    FormConctactDataErrors, 
    FormContactData
} from '@/app/Utils/type';
import { validataContactForm } from '@/app/Utils/validation';
import { Box, Card, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import TopicDropDownselete from '@/app/views/Topic/TopicDropDownselete';
import TextButton from '@/app/components/ui/Button/TextButton';
import { apiFetch } from '@/app/api/client';
import { verifyRecaptcha } from '@/app/Utils/recaptcha';
import { showSuccessAlert } from '@/app/components/ui/SweetAlert/SweetAlert';

type Props = {
    onErrorChange?: (count: number) => void;
};

const ContactForm = ({ onErrorChange }: Props) => {
    const [fullname, seFullname] = useState("");
    const [email, seEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [detail, setDetail] = useState("");

    const [selectedTopic, setSelectedTopic] =
        useState<string | null>(null);

    const [error, setError] =
        useState<FormConctactDataErrors>({
            fullname: '',
            email: '',
            phone: '',
            selectedTopic: '',
            detail: ''
        });

    useEffect(() => {
        const errorCount = Object.values(error).filter(Boolean).length;
        onErrorChange?.(errorCount);
    }, [error, onErrorChange]);



    const handleFieldChange = (
        fieldName: string,
        value: unknown
    ) => {
        const formData: FormContactData = {
            fullname,
            email,
            phone,
            selectedTopic,
            detail,
        };

        const updateFormData = {
            ...formData,
            [fieldName]: value
        };

        const errors =
            validataContactForm(updateFormData);

        setError((prevErrors) => ({
            ...prevErrors,
            [fieldName]:
                errors[
                fieldName as keyof typeof errors
                ] || ''
        }));
    };

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        const formData = {
            fullname,
            email,
            phone,
            selectedTopic,
            detail
        };

        const errors = validataContactForm(formData);

        if (
            Object.values(errors).some(
                (error) => error
            )
        ) {
            setError(errors);
            return;
        }

        const payload = {
            name: fullname,
            phone,
            email,
            detail,
            subject: selectedTopic,
            type: '2',
            solce: 'เว็บไซต์',
            status: 2,
            savename: 'ผู้เยี่ยมชม',

        };

        try {
            setError((prev) => ({
                ...prev,
                captcha: "",
            }));

            await verifyRecaptcha("contact_submit");

            const response = await apiFetch<ApplicationResponse>(
                '/api/applicationcmcapi',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!response.status) {
                throw new Error(
                    response.message ||
                    "บันทึกข้อมูลไม่สำเร็จ"
                );
            }

            const customer_id = response.data?.customer_id ?? 0;

            const payloadlog = {
                actionType: 6,
                actionDetail:
                    `สอบถามเพิ่มเติม ชื่อผู้แจ้งเรื่อง: ${fullname} เบอร์โทรศัพท์: ${phone} หัวข้อ: ${selectedTopic}`,
                datatype: 'ติดต่อสอบถาม',
                dataname: selectedTopic || '',
                dataID: customer_id,
                typeUser: '\u0e1c\u0e39\u0e49\u0e40\u0e22\u0e35\u0e48\u0e22\u0e21\u0e0a\u0e21\u0e40\u0e27\u0e47\u0e1a\u0e44\u0e0b\u0e15\u0e4c',
                datatypeID: '0',
                brandtype: '0'
            };

            try {
                await apiFetch(
                '/api/logapi',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payloadlog),
                }
                );
            } catch (logError) {
                console.error("contact log error:", logError);
            }




            console.log(
                "SUBMIT SUCCESS",
                payload
            );

            await showSuccessAlert({
                text: response.message || "บันทึกข้อมูลเรียบร้อย",
            });

            seFullname("");
            seEmail("");
            setPhone("");
            setDetail("");
            setSelectedTopic(null);
            setError({
                fullname: '',
                email: '',
                phone: '',
                selectedTopic: '',
                detail: ''
            });

        } catch (err) {

            console.error(
                "contact submit error:",
                err
            );

            setError((prev) => ({
                ...prev,
                captcha:
                    "*เกิดข้อผิดพลาด กรุณาลองใหม่"
            }));
        }
    };
    return (
        <Card
            elevation={0}
            sx={{
                position: { lg: 'absolute' },
                right: { lg: 21 },
                top: { lg: 90 },

                width: {
                    xs: '100%',
                    lg: 490
                },
                maxWidth: {
                    xs: 600,
                    lg: 490
                },
                mx: { xs: 'auto', lg: 0 },

                mt: { xs: 3, lg: 0 },

                borderRadius: '40px',

                backgroundColor: 'transparent',

                boxShadow: '0px 4px 20px rgba(0,0,0,0.2)',

                overflow: 'hidden',

                border: 'none', // ✅ เพิ่ม

                zIndex: 10,
            }}
        >
            {/* 👇 ตรงนี้สำคัญ */}
            <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
            >
                <Box
                    sx={{
                        background:
                            'linear-gradient(90deg,#1C3563,#2E5AAC)',
                        color: '#fff',
                        textAlign: 'center',
                        py: 2,
                        borderRadius:
                            '40px 40px 0 0',
                        fontWeight: 600,
                        fontSize: '32px',

                    }}
                >
                    สอบถามข้อมูลเพิ่มเติม
                </Box>

                <Box
                    sx={{
                        px: 5,
                        pt: 5,
                        pb: 5,
                        width: '100%',
                        backgroundColor: 'white',
                        borderRadius: '0 0 40px 40px',
                    }}
                >
                    <Grid size={12}>

                        <TopicDropDownselete
                            selecte={selectedTopic}
                            setSelected={setSelectedTopic}
                            handleFieldChange={handleFieldChange}
                            error={error.selectedTopic}
                            topon={0}
                            fieldKey="selectedTopic"
                            specify
                            titlename="เลือกหัวข้อสอบถาม"
                        />
                    </Grid>

                    <Grid size={12}>
                        <BasicTextField
                            name="ชื่อ - นามสกุล"
                            titlename="กรุณากรอกชื่อ - นามสกุล"
                            subject={fullname}
                            setsubject={
                                seFullname
                            }
                            topon={1}
                            handleFieldChange={
                                handleFieldChange
                            }
                            error={
                                error.fullname
                            }
                            fieldKey="fullname"
                            specify
                        />
                    </Grid>

                    <Grid size={12}>
                        <BasicTextField
                            name="เบอร์โทรศัพท์"
                            titlename="กรุณากรอกเบอร์โทรศัพท์"
                            subject={phone}
                            setsubject={setPhone}
                            topon={1}
                            handleFieldChange={
                                handleFieldChange
                            }
                            error={error.phone}
                            fieldKey="phone"
                            specify
                        />
                    </Grid>

                    <Grid size={12}>
                        <BasicTextField
                            name="อีเมล์"
                            titlename="กรุณากรอกอีเมล์"
                            subject={email}
                            setsubject={seEmail}
                            topon={1}
                            handleFieldChange={
                                handleFieldChange
                            }
                            error={error.email}
                            fieldKey="email"
                            specify={false}
                        />
                    </Grid>

                    <Grid size={12}>
                        <BasicTextDetailField
                            name="ฝากข้อความ"
                            titlename="กรุณากรอกฝากข้อความ"
                            subject={detail}
                            setsubject={setDetail}
                            topon={1}
                            handleFieldChange={
                                handleFieldChange
                            }
                            error={error.detail}
                            fieldKey="detail"
                            specify
                            row={6}
                        />
                    </Grid>

                    <TextButton
                        type="submit"
                        sx={{
                            mt: 3,
                            width: '100%',
                            height: 50,
                            borderRadius:
                                '999px',
                            fontSize: '15px',
                            fontWeight: 700,
                            background:
                                'linear-gradient(90deg,#FFAA37 0%,#FFC107 100%)',
                            boxShadow: 'none',

                            '&:hover': {
                                background:
                                    'linear-gradient(135deg,#FFC107 0%,#FFAA37 100%)',
                            },
                        }}
                    >
                        ส่งข้อความ
                    </TextButton>
                    {error.captcha && (
                        <Typography
                            sx={{
                                mt: 1,
                                color: "error.main",
                                fontSize: 13,
                                textAlign: "center",
                            }}
                        >
                            {error.captcha}
                        </Typography>
                    )}
                </Box>
            </Box>
        </Card>
    );
};

export default ContactForm;
