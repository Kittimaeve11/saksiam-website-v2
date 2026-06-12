"use client";

import { useEffect, useState } from "react";
import { Box } from "@mui/material";

import ContactHeader from "@/app/views/contact/header/ContactHeader";
import ContactInfo from "@/app/views/contact/info/ContactInfo";
import ContactInfoSkeleton from "@/app/views/contact/info/ContactInfoSkeleton";
import ContactMap from "@/app/views/contact/map/ContactMap";
import ContactSocial from "@/app/views/contact/social/ContactSocial";
import ContactSocialSkeleton from "@/app/views/contact/social/ContactSocialSkeleton";
import type { ContactData } from "@/app/Utils/type";

export default function Page() {
  const [errorCount, setErrorCount] = useState(0);
  const [data, setData] = useState<ContactData | null>(null);

  useEffect(() => {
    let active = true;

    const fetchContact = async () => {
      try {
        const res = await fetch("/api/contact");
        const json = (await res.json()) as ContactData;
        if (active) {
          setData(json);
        }
      } catch (err) {
        console.error("CONTACT API ERROR:", err);
        if (active) {
          setData(null);
        }
      }
    };

    fetchContact();

    return () => {
      active = false;
    };
  }, []);

  return (
    <Box sx={{ background: "#f5f7fb", width: "100%", overflowX: "clip" }}>
      <ContactHeader onErrorChange={setErrorCount} />
      {data ? (
        <Box>
          <ContactInfo data={data} errorCount={errorCount} />
          <ContactSocial data={data} />
        </Box>
      ) : (
        <>
          <ContactInfoSkeleton errorCount={errorCount} />
          <ContactSocialSkeleton />
        </>
      )}
      <ContactMap />
    </Box>
  );
}
