"use client";

/* ====================================================== */
import { Box, Typography } from "@mui/material";
import Image from "next/image";

/* ====================================================== */
type Props = {
  data: any;
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
        py: 10,
        textAlign: "center",
        background: "#1C3563",
        color: "#fff",
      }}
    >
      {/* TITLE */}
      <Typography
        sx={{
          mb: 4,
          fontSize: "32px",
          fontWeight: 800,
        }}
      >
        ช่องทางโซเชียลมีเดีย
      </Typography>

      {/* ICON LIST */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 4,
          flexWrap: "wrap",
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
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}