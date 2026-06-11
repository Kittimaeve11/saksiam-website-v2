"use client";

/* ====================================================== */
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import type { ContactData } from "@/app/Utils/type";

/* ====================================================== */
type Props = {
  data: ContactData;
};

/* ====================================================== */
export default function ContactSocial({ data }: Props) {
  const socials = [
    {
      img: "/Social/facebook.png",
      link: data.social.facebook,
    },
    {
      img: "/Social/instagram.png",
      link: data.social.instagram,
    },
    {
      img: "/Social/youtube.png",
      link: data.social.youtube,
    },
    {
      img: "/Social/tiktok.png",
      link: data.social.tiktok,
    },
    {
      img: "/Social/line.png",
      link: data.social.line,
    },
  ];

  /* ====================================================== */
  return (
    <Box
      sx={{
        mt: 6,
        py: { xs: 6, md: 10 },

        /* ======================================================
           MOBILE SIDE SPACING
        ====================================================== */
        px: { xs: 2, sm: 3, md: 0 },

        textAlign: "center",
        background: "#1C3563",
        color: "#fff",
      }}
    >
      {/* ======================================================
         TITLE
      ====================================================== */}
      <Typography
        sx={{
          mb: 4,
          fontSize: { xs: "24px", md: "32px" },
          fontWeight: 800,
          lineHeight: 1.3,
        }}
      >
        ช่องทางโซเชียลมีเดีย
      </Typography>

      {/* ======================================================
         ICON LIST
      ====================================================== */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: { xs: 2.5, md: 4 },
          flexWrap: "wrap",

          /* ======================================================
             PREVENT TOUCHING SCREEN EDGE
          ====================================================== */
          maxWidth: "100%",
        }}
      >
        {socials.map((item, i) => (
          <Box
            key={i}
            component="a"
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "0.3s",
              textDecoration: "none",

              "&:hover": {
                transform: "translateY(-5px)",
              },
            }}
          >
            <Image
              src={item.img}
              alt="social"
              width={60}
              height={60}
              style={{
                objectFit: "contain",
                width: "60px",
                height: "60px",
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}