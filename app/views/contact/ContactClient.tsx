"use client";

/* ====================================================== */
import { useEffect, useState } from "react";
import { Box } from "@mui/material";

/* ====================================================== */
import ContactHeader from "./ContactHeader"; // 🔥 ใช้ตัวใหม่
import ContactInfo from "./ContactInfo";
import ContactSocial from "./ContactSocial";
import ContactMap from "./ContactMap";

/* ====================================================== */
export default function ContactClient() {

  /* 🔥 STATE */
  const [errorCount, setErrorCount] = useState(0);
  const [data, setData] = useState<any>(null);

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await fetch("/api/contact");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("❌ CONTACT API ERROR:", err);
      }
    };

    fetchContact();
  }, []);

  if (!data) return null;

  /* ====================================================== */
  return (
    <Box sx={{ background: "#f5f7fb" }}>

      {/* 🔥 HEADER (HERO + BREADCRUMB) */}
      <ContactHeader onErrorChange={setErrorCount} />

      {/* 🔥 CONTENT */}
      <ContactInfo data={data} errorCount={errorCount} />
      <ContactSocial data={data} />
      <ContactMap />

    </Box>
  );
}