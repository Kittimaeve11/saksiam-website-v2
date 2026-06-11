"use client";

declare global {
    interface Window {
        grecaptcha: any;
    }
}

import { apiFetch } from '@/app/api/client'
import { timeData } from '@/app/api/service/route'
import AddressSearch from '@/app/components/form/AddressSearch';
import BasicDropDownseletedata from '@/app/components/form/BasicDropDownseletedata'
import BasicDropDownseletedatatag from '@/app/components/form/BasicDropDownseletedatatag'
import BasicRadioField from '@/app/components/form/BasicRadioField';
import BasicTextField from '@/app/components/form/BasicTextField'
import CloseIcon from "@mui/icons-material/Close";
import TextButton from '@/app/components/ui/Button/TextButton'
import { BasicDropDownSeleteLoanProps, FormLoanData, FormLoanDataErrors } from '@/app/Utils/type';
import { validataLoanForm } from '@/app/Utils/validation';
import { Box, Card, Checkbox, Dialog, DialogContent, DialogTitle, FormControl, FormControlLabel, Grid, IconButton, Link, Paper, RadioGroup, Typography, useTheme } from '@mui/material'
import React, { useState } from 'react'
import PrivacyConsent from '@/app/views/home/LoanInterestSection/PrivacyConsent';
interface FormloanProps {
    loanid: number | undefined
    name: string | undefined
    vehicleTypes?: string
    minamount: string | undefined
    maxamount: string | undefined
}
interface ApplicationResponse {
    application_id: number;
}

const Formloan: React.FC<FormloanProps> = ({
    loanid,
    name,
    vehicleTypes,
    minamount,
    maxamount
}) => {
    console.log('minamount', minamount)
    const [isCuntomer, setIsCuntomer] =
        useState<number | null>(null);
    const [selectedLoan, setSelectedLoan] =
        useState<BasicDropDownSeleteLoanProps | null>({
            id: loanid || 0,
            name: name || "",
            vehicleType: vehicleTypes || "",
            minamount: minamount || "",
            maxamount: maxamount || "",
        });
    const [typeCar, setTypeCar] = useState("");
    const [selectedtime, setSelectedTime] = useState<string | null>(null);
    const [fullname, seFullname] = useState("");
    const [amount, setAmount] = useState("");
    const [phone, setPhone] = useState("");

    const [showConsent, setShowConsent] =
        useState(false);

    const [acceptConsent, setAcceptConsent] =
        useState(false);

    const [provinces, setProvinces] =
        useState("");

    const [amphures, setAmphures] =
        useState("");

    const [tambons, setTambons] =
        useState("");

    const [zipcode, setZipcode] =
        useState("");

    const [address, setAddress] =
        useState("");

    const [tambonsID, setTambonsID] =
        useState(0);
    const [openPrivacy, setOpenPrivacy] =
        useState(false);
    const [error, setError] = useState<FormLoanDataErrors>({
        isCuntomer: '',
        selectedLoan: '',
        typeCar: '',
        amount: '',
        selectedtime: '',
        fullname: '',
        phone: '',
        address: '',
        district: '',
        amphoe: '',
        province: '',
        zipcode: '',
        tambonsID: '',
        captcha: ''
    });
    const handleFieldChange = (fieldName: string, value: unknown) => {
        const formData: FormLoanData = {
            isCuntomer,
            selectedLoan,
            typeCar,
            amount,
            selectedtime,
            fullname,
            phone,
            address,
            district: tambons,
            amphoe: amphures,
            province: provinces,
            zipcode,
            tambonsID
        };

        const updateFormData = {
            ...formData,
            [fieldName]: value
        }

        const errors = validataLoanForm(updateFormData)
        setError(prevErrors => ({
            ...prevErrors,
            [fieldName]: errors[fieldName]
        }))
    }
    const validateBeforeConsent = () => {

        const formData = {
            isCuntomer,
            selectedLoan,
            typeCar,
            amount,
            selectedtime,
            fullname,
            phone,
            address,
            district: tambons,
            amphoe: amphures,
            province: provinces,
            zipcode,
            tambonsID
        };

        const errors =
            validataLoanForm(formData);

        setError(errors);

        const hasError =
            Object.values(errors).some(
                (error) => error
            );

        // ถ้าไม่มี error
        if (!hasError) {
            setShowConsent(true);
        }
    };

    const handleSubmit = async (
        event: React.FormEvent
    ) => {

        event.preventDefault();

        if (!acceptConsent) return;
        const amountNumber = Number(
            amount.replace(/,/g, "")
        );

        const maxAmountNumber = Number(
            selectedLoan?.maxamount || 0
        );

        const isOverLimit =
            amountNumber > maxAmountNumber;

        const formData = {
            isCuntomer,
            selectedLoan,
            typeCar,
            amount,
            selectedtime,
            fullname,
            phone,
            address,
            district: tambons,
            amphoe: amphures,
            province: provinces,
            zipcode,
            tambonsID
        };

        const errors =
            validataLoanForm(formData);

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
            phone: phone,
            type: '1',
            loan: isCuntomer,
            preferred: selectedtime,
            amount: amount,
            subdistrict: tambons,
            district: amphures,
            province: provinces,
            zipcode: zipcode,
            subdistricID: tambonsID,
            loanname: selectedLoan?.name,
            product: typeCar,
            savename: 'ผู้เยี่ยมชม',
            solce: 'เว็บไซต์',
            status: 1,
            detail: isOverLimit
                ? 'วงเงินเกินเรท'
                : ''
        };

        try {

            // reset captcha error
            // setError((prev) => ({
            //   ...prev,
            //   captcha: ""
            // }));

            // // check grecaptcha
            // if (
            //   typeof window === "undefined" ||
            //   !window.grecaptcha
            // ) {

            //   setError((prev) => ({
            //     ...prev,
            //     captcha:
            //       "*ระบบ captcha ยังไม่พร้อม กรุณาลองใหม่"
            //   }));

            //   return;
            // }

            // // wait ready
            // await new Promise<void>((resolve) => {
            //   window.grecaptcha.ready(() => {
            //     resolve();
            //   });
            // });

            // // get token
            // const token =
            //   await window.grecaptcha.execute(
            //     process.env
            //       .NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
            //     {
            //       action: "submit"
            //     }
            //   );

            // if (!token) {

            //   setError((prev) => ({
            //     ...prev,
            //     captcha:
            //       "*ไม่สามารถยืนยันความปลอดภัยได้"
            //   }));

            //   return;
            // }

            // // verify backend
            // const res = await fetch(
            //   "/api/verify-captcha",
            //   {
            //     method: "POST",

            //     headers: {
            //       "Content-Type":
            //         "application/json",
            //     },

            //     body: JSON.stringify({
            //       token
            //     }),
            //   }
            // );

            // const data = await res.json();

            // if (
            //   !data.success ||
            //   data.score < 0.5
            // ) {

            //   setError((prev) => ({
            //     ...prev,
            //     captcha:
            //       "*ระบบตรวจพบความเสี่ยง กรุณาลองใหม่"
            //   }));

            //   return;
            // }

            // =========================
            // SUBMIT API จริง
            // =========================
            const response = await apiFetch<ApplicationResponse>(
                `/api/applicationapi`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(payload)
                }
            );

            if (!response.status || !response.data) {
                throw new Error(
                    response.message ||
                    "บันทึกข้อมูลไม่สำเร็จ"
                );
            }

            const loanid = response.data.application_id;
            const payloadlog = {
                actionType: 5,
                actionDetail:
                    `สมัครสินเชื่อออนไลน์ ชื่อผู้สมัคร: ${fullname} เบอร์โทรศัพท์: ${phone} ประเภทสินเชื่อ: ${selectedLoan?.name}`,
                datatype: 'สมัครสินเชื่อออนไลน์',
                dataname:
                    selectedLoan?.name || '',
                dataID: loanid
            };

            await apiFetch(
                `/api/logapi`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify(
                        payloadlog
                    ),
                }
            );

            console.log(
                "SUBMIT SUCCESS",
                payload
            );

            // await fetch(...)

        } catch (err) {

            console.error(
                "captcha error:",
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
                overflow: "hidden",
                borderRadius: 20,
                maxWidth: 760,
                mx: "auto",
                position: "relative",
                backgroundColor: 'white',
                boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
            }}
        >
            <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{
                    textAlign: 'left',
                    width: '100%',
                    maxWidth: '600px',
                    margin: '0 auto',
                    mb: 5,
                }}
            >
                <Box
                    sx={{
                        background:
                            "linear-gradient(135deg,#1F3C88 0%, #234DA3 45%, #2E63C7 100%)",

                        "&::before": {
                            content: '""',
                            position: "absolute",
                            inset: 0,

                            background:
                                "radial-gradient(circle at top right, rgba(255,255,255,.18), transparent 35%)",
                        },

                        "&::after": {
                            content: '""',
                            position: "absolute",
                            width: 280,
                            height: 280,
                            borderRadius: "50%",
                            background:
                                "rgba(255,255,255,.06)",
                            top: -120,
                            right: -80,
                        },
                        py: 6,

                        px: 4,
                        textAlign: "center",
                    }}
                >
                    <Typography
                        variant="h4"
                        sx={{
                            color: "#fff",
                            fontWeight: 600,
                        }}
                    >
                        สมัครยื่น{
                            name?.replace("(Solar Rooftop)", "").trim()
                        }
                    </Typography>
                </Box>
                <Box sx={{ px: 5, mb: 2, width: '100%' }}>
                    <Grid container spacing={1}>
                        <Grid size={12}>
                            <BasicRadioField
                                name="เคยใช้บริการศักดิ์สยามหรือไม่"
                                titlename1="เคย"
                                titlename2="ไม่เคย"
                                subject={isCuntomer}
                                setsubject={setIsCuntomer}
                                topon={4}
                                handleFieldChange={handleFieldChange}
                                error={error.isCuntomer}
                                fieldKey="isCuntomer"
                                specify={true}
                            />
                        </Grid>

                        <Grid size={12}>
                            {selectedLoan?.vehicleType && (
                                <BasicDropDownseletedatatag
                                    selecte={typeCar}
                                    setSelected={setTypeCar}
                                    handleFieldChange={handleFieldChange}
                                    error={error.typeCar}
                                    vehicleTypes={selectedLoan?.vehicleType}
                                    topon={0}
                                    fieldKey="typeCar"
                                    specify={true}
                                    titlename="ประเภทรถ"
                                />
                            )}
                        </Grid>
                        <Grid size={12}>
                            <BasicTextField
                                name="วงเงินที่ต้องการ"
                                titlename="กรุณากรอกวงเงินที่ต้องการ"
                                subject={amount}
                                setsubject={setAmount}
                                topon={0}
                                handleFieldChange={handleFieldChange}
                                error={error.amount}
                                fieldKey="amount"
                                specify
                            />
                        </Grid>
                        <Grid size={6}>
                            <BasicTextField
                                name="ชื่อ - นามสกุล"
                                titlename="กรุณากรอกชื่อ - นามสกุล"
                                subject={fullname}
                                setsubject={seFullname}
                                topon={1}
                                handleFieldChange={handleFieldChange}
                                error={error.fullname}
                                fieldKey="fullname"
                                specify
                            />
                        </Grid>
                        <Grid size={6}>
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
                        </Grid>

                        <Grid size={12}>
                            <AddressSearch
                                setProvinces={setProvinces}
                                setAmphures={setAmphures}
                                setTambons={setTambons}
                                setZipcode={setZipcode}
                                setAddress={setAddress}
                                setTambonsID={setTambonsID}
                                handleFieldChange={handleFieldChange}
                                error={error.address}
                                topon={1}
                                fieldKey="address"
                                specify={true}
                                titlename="ที่อยู่"
                            />

                        </Grid>
                        <Grid size={12}>
                            <BasicDropDownseletedata
                                selecte={selectedtime}
                                setSelected={setSelectedTime}
                                handleFieldChange={handleFieldChange}
                                error={error.selectedtime}
                                statusOptions={timeData}
                                topon={1}
                                fieldKey="selectedtime"
                                specify={true}
                                titlename="ช่วงเวลาที่สะดวกให้ติดต่อกลับ"
                            />
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 4 }}>
                        {
                            !showConsent ? (
                                <TextButton
                                    type="button"
                                    onClick={validateBeforeConsent}
                                    sx={{
                                        width: "100%",
                                        height: 46,
                                        borderRadius: "999px",
                                    }}
                                >
                                    สมัครสินเชื่อ
                                </TextButton>
                            ) : (
                                <>
                                    <Box
                                        sx={{
                                            mt: 2,
                                            borderRadius: 4,
                                            border:
                                                "1px solid rgba(255,183,77,.35)",
                                            background:
                                                "linear-gradient(180deg,#FFFDF8 0%,#FFFFFF 100%)",
                                            p: 3,
                                            boxShadow:
                                                "0 8px 30px rgba(0,0,0,.04)",
                                            animation:
                                                "fadeIn .25s ease",
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: 15,
                                                fontWeight: 700,
                                                color: "#D84315",
                                                mb: 1,
                                            }}
                                        >
                                            โปรดอ่านก่อนสมัครสินเชื่อ
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                display: "block",
                                                fontSize: 14,
                                                lineHeight: 1.9,
                                                color: "text.secondary",
                                                textIndent: "24px",
                                            }}
                                        >
                                            บริษัทไม่มีนโยบายแต่งตั้งตัวแทน
                                            หรือนายหน้าในการยื่นเอกสาร
                                            เพื่อประกอบการพิจารณา
                                            ขอสินเชื่อออนไลน์
                                            และไม่มีการเรียกรับผลประโยชน์
                                            เป็นการตอบแทน
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontSize: 13,
                                                lineHeight: 1.8,
                                                color: "text.secondary",
                                                textIndent: "24px",
                                            }}
                                        >
                                            ข้าพเจ้าได้อ่านรายละเอียดเกี่ยวกับผลิตภัณฑ์
                                            อัตราดอกเบี้ยและค่าธรรมเนียม
                                            รวมถึงเข้าใจข้อกำหนด เงื่อนไข และ{" "}
                                            <Link
                                                component="button"
                                                onClick={() =>
                                                    setOpenPrivacy(true)
                                                }
                                                sx={{
                                                    display: "inline",

                                                    fontSize: 13,
                                                    color: "text.secondary",
                                                    fontWeight: 600,

                                                    textDecorationColor: "currentColor",
                                                    textUnderlineOffset: "2px",

                                                    verticalAlign: "baseline",

                                                    position: "relative",
                                                    top: "-1px",

                                                    "&:hover": {
                                                        textDecorationColor: "currentColor",
                                                    },
                                                }}
                                            >
                                                ข้อตกลงในการเปิดเผยข้อมูลส่วนบุคคล
                                            </Link>

                                            {" "}ของบริษัทเรียบร้อยแล้ว
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                pt: 2,
                                                gap: 1,
                                                borderTop:
                                                    "1px dashed rgba(0,0,0,.12)",

                                            }}
                                        >
                                            <Checkbox checked={acceptConsent} color="error"
                                                onChange={(e) =>
                                                    setAcceptConsent(
                                                        e.target.checked
                                                    )
                                                } />


                                            <Typography
                                                sx={{
                                                    fontSize: 14,
                                                    color: "text.secondary",
                                                }}
                                            >
                                                ฉันยอมรับเงื่อนไขและรับทราบข้อมูลแล้ว
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <TextButton
                                        type="submit"
                                        disabled={!acceptConsent}
                                        sx={{
                                            mt: 3,
                                            width: "100%",
                                            height: 50,
                                            borderRadius: "999px",
                                            fontSize: "15px",
                                            fontWeight: 700,

                                            background:
                                                acceptConsent
                                                    ? "linear-gradient(135deg,#23407A 0%,#2E4F96 100%)"
                                                    : "#D7DCE5",

                                            color: "#fff",

                                            transition: ".25s",

                                            "&:hover": {
                                                background:
                                                    acceptConsent
                                                        ? "linear-gradient(135deg,#1E3768 0%,#284786 100%)"
                                                        : "#D7DCE5",
                                            },
                                        }}
                                    >
                                        ยืนยันการสมัครสินเชื่อ
                                    </TextButton>

                                </>
                            )
                        }
                    </Box>
                </Box>
            </Box>
            <Dialog
                open={openPrivacy}
                onClose={() =>
                    setOpenPrivacy(false)
                }
                maxWidth="md"
                fullWidth
            >
                <DialogTitle
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        pr: 1,
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 18,
                            fontWeight: 700,
                        }}
                    >
                        ข้อตกลงในการเปิดเผยข้อมูลส่วนบุคคล
                    </Typography>

                    <IconButton
                        onClick={() => setOpenPrivacy(false)}
                        size="small"
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers>
                    <PrivacyConsent />
                </DialogContent>
            </Dialog>
        </Card>
    )
}

export default Formloan
