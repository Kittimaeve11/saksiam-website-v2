import BasicRadioField from "@/app/components/form/BasicRadioField";
import BasicDropDownseletedata from "@/app/components/form/BasicDropDownseletedata";
import BasicDropDownseletedatatag from "@/app/components/form/BasicDropDownseletedatatag";
import AddressSearch from "@/app/components/form/AddressSearch";
import BasicTextField from "@/app/components/form/BasicTextField";
import TextButton from "@/app/components/ui/Button/TextButton";
import { showSuccessAlert } from "@/app/components/ui/SweetAlert/SweetAlert";

import { apiFetch } from "@/app/api/client";
import { timeData } from "@/app/api/service/route";

import {
  BasicDropDownSeleteLoanProps,
  FormLoanData,
  FormLoanDataErrors,
  LoanApplicationResponse,
} from "@/app/Utils/type";

import { normalizeContactTime } from "@/app/Utils/loan";
import { verifyRecaptcha } from "@/app/Utils/recaptcha";
import { validataLoanForm } from "@/app/Utils/validation";

import LoanDropDownIconselete from "../../Loan/LoanDropDownIconselete";
import PrivacyConsent from "./PrivacyConsent";

import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Card,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Link,
  Typography,
} from "@mui/material";

import React, { useState } from "react";

const LoanInterestForm = () => {
  const [isCuntomer, setIsCuntomer] =
    useState<number | null>(null);
  const [selectedLoan, setSelectedLoan] =
    useState<BasicDropDownSeleteLoanProps | null>(null);
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

  const resetForm = () => {
    setIsCuntomer(null);
    setSelectedLoan(null);
    setTypeCar("");
    setSelectedTime(null);
    seFullname("");
    setAmount("");
    setPhone("");
    setShowConsent(false);
    setAcceptConsent(false);
    setProvinces("");
    setAmphures("");
    setTambons("");
    setZipcode("");
    setAddress("");
    setTambonsID(0);
    setError({
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
  };
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

    const updateFormData: FormLoanData = {
      ...formData,
      ...(fieldName === "address" && value && typeof value === "object"
        ? (value as Partial<FormLoanData>)
        : { [fieldName]: value }),
    };

    const errors = validataLoanForm(updateFormData)
    setError(prevErrors => fieldName === "address"
      ? {
        ...prevErrors,
        address: errors.address,
        district: errors.district,
        amphoe: errors.amphoe,
        province: errors.province,
        zipcode: errors.zipcode,
        tambonsID: errors.tambonsID,
      }
      : {
        ...prevErrors,
        [fieldName]: errors[fieldName]
      })
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
      preferred: normalizeContactTime(selectedtime),
      contedtime: normalizeContactTime(selectedtime),
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

      setError((prev) => ({
        ...prev,
        captcha: "",
      }));

      await verifyRecaptcha("loan_submit");

      // =========================
      // SUBMIT API จริง
      // =========================
      const response = await apiFetch<LoanApplicationResponse>(
        `/api/applicationapi`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(payload)
        }
      );

      if (!response.status) {
        throw new Error(
          response.message ||
          "บันทึกข้อมูลไม่สำเร็จ"
        );
      }

      const responseData = response.data ?? (response as unknown as LoanApplicationResponse);
      const loanid =
        responseData.application_id ??
        responseData.customer_id ??
        responseData.ticket_id ??
        0;
      const payloadlog = {
        actionType: 5,
        actionDetail:
          `สมัครสินเชื่อออนไลน์ ชื่อผู้สมัคร: ${fullname} เบอร์โทรศัพท์: ${phone} ประเภทสินเชื่อ: ${selectedLoan?.name}`,
        datatype: 'สมัครสินเชื่อออนไลน์',
        dataname:
          selectedLoan?.name || '',
        dataID: loanid,
        typeUser: 'ผู้เยี่ยมชมเว็บไซต์',
        datatypeID: '0',
        brandtype: '0'
      };

      try {
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
      } catch (logError) {
        console.warn("loan interest log warning:", logError);
      }

      console.log(
        "SUBMIT SUCCESS",
        payload
      );

      await showSuccessAlert({
        text: response.message || "บันทึกข้อมูลเรียบร้อย",
      });

      resetForm();

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
      variant="outlined"
      sx={{
        position: "relative",
        borderRadius: {
          xs: 16,
          md: 20,
        },
        overflow: "hidden",
        border: "transparent",
        backgroundColor: "#fff",

        boxShadow: {
          xs: "0 10px 20px rgba(0,0,0,0.08)",
          sm: "0 15px 30px rgba(0,0,0,0.10)",
          md: "0 20px 40px rgba(0,0,0,0.12)",
        },

        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          padding: {
            xs: "6px",
            md: "8px",
          },
          borderRadius: "inherit",

          background:
            "linear-gradient(135deg, #4369BE, #ffffff, #ffffff, #ffffff, #FBD53F)",

          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",

          pointerEvents: "none",
          zIndex: 2,
        },

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
          my: 8,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Typography
          sx={{
            textAlign: "center",
            fontSize: { xs: "32px", sm: "40px" },
            px : 1,
            fontWeight: 800,
            color: "#1C3563",
          }}
        >
          เลือกสินเชื่อที่คุณสนใจ
        </Typography>

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
              <LoanDropDownIconselete
                selecte={selectedLoan}
                setSelected={setSelectedLoan}
                topon={0}
                titlename="ประเภทสินเชื่อ"
                handleFieldChange={handleFieldChange}
                error={error.selectedLoan}
                fieldKey="selectedLoan"
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
            <Grid size={{ xs: 12, sm: 6 }}>
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
            <Grid size={{ xs: 12, sm: 6 }}>
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

export default LoanInterestForm

