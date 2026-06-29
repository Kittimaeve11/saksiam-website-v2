import { Box } from "@mui/material";
import ContactInquiryForm from "@/app/views/contact-inquiry/ContactInquiryForm";

export const metadata = {
  title: "ฟอร์มบันทึกข้อมูลผู้ติดต่อสอบถาม",
};

export default function ContactInquiryPage() {
  return (
    <Box
      component="main"
      sx={{
        minHeight: "100svh",
        px: { xs: 2, sm: 3 },
        py: { xs: 4, md: 7 },
        display: "flex",
        alignItems: "center",
        background:
          "linear-gradient(180deg, #f6f9ff 0%, #eef4ff 52%, #ffffff 100%)",
      }}
    >
      <ContactInquiryForm />
    </Box>
  );
}
