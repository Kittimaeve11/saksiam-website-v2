"use client";

/* ======================================================
   IMPORT
====================================================== */
import { Box, Typography } from "@mui/material";
import VideoCard from "@/app/components/cards/VideoCard/VideoCard";
import { useLocale } from "@/app/providers/LocaleContext";

/* ======================================================
   COMPONENT
====================================================== */
export default function HomeIntroSection() {
  const { messages } = useLocale();
  const loanFeatures = [
    messages.loan_features.low_interest,
    messages.loan_features.easy_payment,
    messages.loan_features.reduce_principal_interest,
  ];

  return (
    <Box
      sx={{
        width: "100%",
        background: "linear-gradient(90deg, #011643 0%, #243865 100%)",
        userSelect: "none",
        WebkitUserSelect: "none",
        msUserSelect: "none",
        pt: { xs: 4, md: 8 },
        pb: { xs: 6.5, md: 8 },
        px: { xs: 2, md: 6 },
      }}
    >
      <Box
        sx={{
          maxWidth: "lg",
          margin: "0 auto",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          gap: { xs: 4, md: 4, lg: 6 },
        }}
      >
        {/* ======================================================
            LEFT (TEXT)
        ====================================================== */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 2.5, md: 1, lg: 3 },
            color: "#fff",
          }}
        >
          {/* TITLE */}
          <Typography
            sx={{
              fontSize: { xs: 34, sm: 44, md: 36, lg: 48 },
              fontWeight: 700,
              color: "var(--main-yellow-500)",
              mb: 2,
            }}
          >
            {messages?.video_section?.title_main}

            <Box
              component="span"
              sx={{
                display: { xs: "block", md: "inline" },
              }}
            >
              {" "}
              {messages?.video_section?.title_sub}
            </Box>
          </Typography>

          {/* DESC */}
          <Typography
            variant="body1"
            sx={{
              fontSize: "18px",
              lineHeight: 1.8,
              opacity: 0.9,
              mb: 2.5,
            }}
          >
            {messages?.video_section?.description}
          </Typography>

          {/* LIST */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
            {loanFeatures.map((item, index) => (

              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.2,
                }}
              >
                {/* ✔ ICON (แก้ตรงนี้) */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 20,
                    height: 20,
                  }}
                >
                  <i
                    className="fi fi-br-checkbox"
                    style={{
                      fontSize: "18px",
                      color: "var(--main-yellow-500)",
                    }}
                  />
                </Box>

                <Typography variant="h6">
                  {item}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* ======================================================
            RIGHT (VIDEO)
        ====================================================== */}
        <Box
          sx={{
            flex: 1,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <VideoCard
            videoUrl="https://www.youtube.com/embed/5eI2jSRY1i8"
          />
        </Box>
      </Box>
    </Box>
  );
}
