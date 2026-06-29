"use client";

import { apiFetch } from '@/app/api/client';
import { useLocale } from '@/app/providers/LocaleContext';
import { ContactData } from '@/app/Utils/type';
import { Box, Card, Grid, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'

interface HeadingSectionProps {
    title1: string
    title2: string
    branch: string
    employees: string
    years: string
    subheadline_th: string | undefined
    subheadline_en: string | undefined
}

const HeadingSection: React.FC<HeadingSectionProps> = ({
    title1,
    title2,
    subheadline_th,
    subheadline_en,
    branch,
    employees,
    years
}) => {
    const [data, setData] = useState<ContactData | null>(null);
    const { locale } = useLocale();

    const companyYears = React.useMemo(() => {
        if (!data?.company_info.established) return 0;

        const establishedDate = new Date(data.company_info.established);
        const today = new Date();

        let years = today.getFullYear() - establishedDate.getFullYear();

        const hasBirthdayPassed =
            today.getMonth() > establishedDate.getMonth() ||
            (today.getMonth() === establishedDate.getMonth() &&
                today.getDate() >= establishedDate.getDate());

        if (!hasBirthdayPassed) {
            years--;
        }

        return years;
    }, [data]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await apiFetch<ContactData>(
                    "/api/contactapi"
                );

                if (!res.status) {
                    throw new Error(res.message || "API error");
                }

                setData(res.data ?? null);

            } catch (err) {
                console.error("fetch error:", err);
            }
        };

        fetchData();
    }, []);
    const renderTitle1 = (text: string) => {
        const parts = text.split(/(1|One|one)/g);

        return parts.map((part, index) => (
            <Box
                key={index}
                component="span"
                sx={{
                    color:
                        part === '1' ||
                            part === 'One' ||
                            part === 'one'
                            ? "var(--orange-soft-500)"
                            : "var(--main-blue-500)",
                }}
            >
                {part}
            </Box>
        ));
    };
    return (
        <>
            <Box sx={{ textAlign: 'center', mb: 8 }} >
                <Typography
                    variant="h4"
                    sx={{
                        fontSize: {
                            xs: '2rem',
                            md: '3rem',
                        },
                        lineHeight: 1.2,
                        fontWeight: 800,
                    }}
                >
                    <Box
                        component="span"
                        sx={{
                            color: "var(--main-blue-500)",
                        }}
                    >
                        {renderTitle1(title1)}{' '}
                    </Box>

                    <Box
                        component="span"
                        sx={{
                            color: "var(--orange-soft-500)",
                        }}
                    >
                        {data?.company_info.branches}
                    </Box>

                    <Box
                        component="span"
                        sx={{
                            color: "var(--main-blue-500)",
                        }}
                    >
                        {' '}{title2}
                    </Box>
                </Typography>

                <Typography
                    sx={{
                        mt: 4,
                        color: "var(--gray-500)",
                        fontSize: '1.2rem',
                    }}
                >
                    {locale === 'th' ? subheadline_th : subheadline_en}
                </Typography>
            </Box>
              {/* Stats */}
            <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Card
                        variant="outlined"
                        sx={{
                            borderRadius: 7,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center',

                            height: 120,

                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                            overflow: 'hidden',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            border: 'transparent',
                            gap: 1,
                            width: '100%',
                            position: 'relative',
                            cursor: 'pointer',

                            '&:hover': {
                                transform: 'translateY(-8px)',
                                border: '1px solid transparent',
                            },
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: {
                                    xs: '2rem',
                                    md: '2.6rem',
                                },
                                fontWeight: 800,
                                lineHeight: 1,

                                background:
                                    'linear-gradient(90deg, #FFAA37 0%, #FFC107 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            {Number(data?.company_info.branches ?? 0).toLocaleString()}
                        </Typography>

                        <Typography
                            variant='h6'
                            sx={{
                                color: 'var(--main-blue-500)',
                                fontWeight: 600,
                            }}
                        >
                            {branch}
                        </Typography>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Card
                        variant="outlined"
                        sx={{
                            borderRadius: 7,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center',

                            height: 120,

                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                            overflow: 'hidden',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            border: 'transparent',
                            gap: 1,
                            width: '100%',
                            position: 'relative',
                            cursor: 'pointer',

                            '&:hover': {
                                transform: 'translateY(-8px)',
                                border: '1px solid transparent',
                            },
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: {
                                    xs: '2rem',
                                    md: '2.6rem',
                                },
                                fontWeight: 800,
                                lineHeight: 1,

                                background:
                                    'linear-gradient(90deg, #243865 0%, #4871CB 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            {Number(data?.company_info.employees ?? 0).toLocaleString()}
                        </Typography>

                        <Typography
                            variant='h6'
                            sx={{
                                color: 'var(--main-blue-500)',
                                fontWeight: 600,
                            }}
                        >
                            {employees}
                        </Typography>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Card
                        variant="outlined"
                        sx={{
                            borderRadius: 7,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center',

                            height: 120,

                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                            overflow: 'hidden',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            border: 'transparent',
                            gap: 1,
                            width: '100%',
                            position: 'relative',
                            cursor: 'pointer',

                            '&:hover': {
                                transform: 'translateY(-8px)',
                                border: '1px solid transparent',
                            },
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: {
                                    xs: '2rem',
                                    md: '2.6rem',
                                },
                                fontWeight: 800,
                                lineHeight: 1,

                                background:
                                    'linear-gradient(90deg, #4D3617 0%, #FFAA37 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                              {companyYears}
                        </Typography>

                        <Typography
                            variant='h6'
                            sx={{
                                color: 'var(--main-blue-500)',
                                fontWeight: 600,
                            }}
                        >
                            {years}
                        </Typography>
                    </Card>
                </Grid>
            </Grid>
        </>
    )
}

export default HeadingSection
