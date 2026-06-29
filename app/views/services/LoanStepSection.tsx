"use client";

import Image from "next/image";
import { Box, Grid, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { steps } from "@/app/api/service/route";
import { useLocale } from "@/app/providers/LocaleContext";

export default function LoanStepSection() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { messages, locale } = useLocale();
    return (
        <Box
            sx={{
                width: "100%",
                overflow: "hidden",
                py: 5
            }}
        >
            <Grid container spacing={2} >
                <Grid size={{ xs: 12, md: 6 }} sx={{ order: { xs: 2, md: 1 } }}>
                    <Box
                        sx={{
                            position: "relative",
                            width: "100%",
                            height: { xs: 420, sm: 520, md: 700 },
                        }}
                    >
                        <Image
                            src={
                                isMobile
                                    ? "/Employee/employeehome6.png"
                                    : "/Employee/employeehome7.png"
                            }
                            alt="loan-step"
                            fill
                            sizes="(max-width: 900px) 100vw, 50vw"
                            priority
                            draggable={false}
                            style={{
                                objectFit: "contain",
                                objectPosition: "center bottom",
                                userSelect: "none",
                                pointerEvents: "none",
                            }}
                        />
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }} sx={{ order: { xs: 1, md: 2 } }}>
                    <Box>
                        <Typography
                            variant="h2"
                            sx={{
                                fontSize: {
                                    xs: "2rem", // h4
                                    md: "3.75rem", // h2
                                },
                                fontWeight: 800,
                                lineHeight: 1.1,
                                color: "#1e376d",
                                mb: 6,
                                textAlign: {
                                    xs: "center",
                                    md: "left",
                                },
                            }}
                        >
                            {messages.loan.application_steps}
                        </Typography>
                    </Box>
                    <Stack spacing={0}>
                        {steps.map((item, index) => (
                            <Box
                                key={item.id}
                                sx={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    position: "relative",
                                    pb: index !== steps.length - 1 ? 5 : 0,
                                }}
                            >
                                <Box
                                    sx={{
                                        position: "relative",
                                        mr: 4,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                    }}
                                >
                                    {index !== steps.length - 1 && (
                                        <Box
                                            sx={{
                                                position: "absolute",
                                                top: 58,
                                                width: "6px",
                                                height: "100%",
                                                bgcolor: "#1f5bc4",
                                                borderRadius: 999,
                                            }}
                                        />
                                    )}
                                    <Box
                                        sx={{
                                            width: 52,
                                            height: 52,
                                            borderRadius: "50%",
                                            bgcolor:
                                                index === steps.length - 1
                                                    ? "#4b91ff"
                                                    : "#1f5bc4",
                                            color: "#fff",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontWeight: 700,
                                            fontSize: "1.5rem",
                                            zIndex: 2,
                                            flexShrink: 0,
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                                        }}
                                    >
                                        {item.id}
                                    </Box>
                                </Box>
                                <Box >
                                    <Typography
                                        sx={{
                                            fontSize: {
                                                xs: "1.35rem",
                                                md: "2rem",
                                            },
                                            fontWeight: 800,
                                            color:
                                                index === steps.length - 1
                                                    ? "#4b91ff"
                                                    : "#1f5bc4",
                                            lineHeight: 1.2,
                                        }}
                                    >
                                        {locale === "th"
                                            ? item.titleTH
                                            : item.titleEN}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            mt: 1,
                                            color: "#5f6368",
                                            fontSize: {
                                                xs: "0.95rem",
                                                md: "1.1rem",
                                            },
                                            lineHeight: 1.8,
                                            maxWidth: 500,
                                        }}
                                    >
                                        {locale === "th"
                                            ? item.descriptionTH
                                            : item.descriptionEN}

                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Stack>
                </Grid>


            </Grid>
        </Box>
    )
}
