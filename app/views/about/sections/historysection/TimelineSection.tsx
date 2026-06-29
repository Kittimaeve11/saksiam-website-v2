import { useLocale } from '@/app/providers/LocaleContext';
import { HistoryEra } from '@/app/Utils/type'
import { Box, Typography } from '@mui/material'
import React from 'react'

const BASE_URL = process.env.NEXT_PUBLIC_API_PHOTO!;

interface TimelineSectionProps {
    timelineData: HistoryEra[] | undefined
}

const TimelineSection: React.FC<TimelineSectionProps> = ({ timelineData }) => {
    const { locale } = useLocale();

    return (
        <Box
            sx={{
                py: { xs: 5, md: 8 },
            }}
        >
            {timelineData?.map((era) => {
                const hideTimeline =
                    era.era_th === 'ยุคเข้าสู่มหาชน';

                return (
                    <Box
                        key={era.era_th}
                        sx={{
                            position: 'relative',
                            pb: { xs: 8, md: 12 },
                        }}
                    >
                        {!hideTimeline && (
                            <>
                                {/* เส้น Timeline */}
                                <Box
                                    sx={{
                                        display: {
                                            xs: 'none',
                                            md: 'block',
                                        },
                                        position: 'absolute',
                                        top: 10,
                                        bottom: 40,
                                        left: '50%',
                                        width: '6px',
                                        bgcolor: '#d8d8d8b1',
                                        transform: 'translateX(-50%)',
                                        zIndex: 0,
                                        borderRadius: 4,
                                    }}
                                />

                                {/* วงกลม */}
                                <Box
                                    sx={{
                                        display: {
                                            xs: 'none',
                                            md: 'block',
                                        },
                                        position: 'absolute',
                                        top: 0,
                                        left: '50%',
                                        width: 32,
                                        height: 32,
                                        borderRadius: '50%',
                                        bgcolor: '#fff',
                                        border: '6px solid #F5A623',
                                        transform: 'translateX(-50%)',
                                        zIndex: 2,
                                    }}
                                />
                            </>
                        )}
                        <Box
                            sx={{
                                mb: 2,
                                pt: 12,
                                pr: { md: 'calc(50% + 110px)' },
                                pl: { xs: 5, md: 0 },
                                textAlign: { xs: 'left', md: 'right' },
                            }}
                        >
                            <Typography
                                sx={{
                                    color: "var(--orange-soft-500)",
                                    fontWeight: 600,
                                    fontSize: 'clamp(1.25rem, 2vw, 2rem)', // 20px - 32px
                                    lineHeight: 1.3,
                                }}
                            >
                                {locale === 'th' ? era.era_th : era.era_en}
                            </Typography>
                        </Box>
                        {era.sections.map((item, index) => {
                            const isImageLeft = index % 2 === 0;
                            const hasImage = !!item.images;
                            const imageBox = (
                                <Box
                                    sx={{
                                        width: {
                                            xs: '100%',
                                            md: 400,
                                        },
                                        maxWidth: '100%',
                                        mx: {
                                            xs: 0,
                                            md: 'auto',
                                        },
                                        position: 'relative',
                                    }}
                                >
                                    {index > 0 && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 14,
                                                height: 5,
                                                bgcolor: '#d8d8d8b1',
                                                borderRadius: 10,

                                                width: {
                                                    xs: 0,
                                                    md: 100,
                                                },

                                                ...(isImageLeft
                                                    ? {
                                                        right: -120,
                                                    }
                                                    : {
                                                        left: -120,
                                                    }),
                                            }}
                                        />
                                    )}
                                    <Typography
                                        sx={{
                                            fontWeight: 600,
                                            fontSize: {
                                                xs: '1rem',
                                                sm: '1.125rem',
                                                md: '1.25rem',
                                                lg: '1.5rem',
                                            },
                                            lineHeight: 1.3,
                                            mb: 2,
                                            textAlign: {
                                                xs: 'left',
                                                md: isImageLeft ? 'right' : 'left',
                                            },
                                            background:
                                                'linear-gradient(90deg, #243865 0%, #4871CB 100%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text',
                                        }}
                                    >
                                        {locale === 'th'
                                            ? item.title_th
                                            : item.title_en}
                                    </Typography>
                                    {hasImage ? (
                                        <Box
                                            component="img"
                                            src={`${BASE_URL}/${item.images}`}
                                            alt={
                                                locale === 'th'
                                                    ? item.title_th
                                                    : item.title_en
                                            }
                                            sx={{
                                                width: '100%',
                                                height: 250,
                                                objectFit: 'cover',
                                                display: 'block',
                                                borderRadius: 3,
                                                boxShadow:
                                                    '0 6px 18px rgba(0,0,0,0.12)',
                                            }}
                                        />
                                    ) : (
                                        <Typography
                                            sx={{
                                                color: '#555',
                                                fontSize: {
                                                    xs: 14,
                                                    md: 15,
                                                },

                                                lineHeight: 2,
                                                fontWeight: 400,
                                                textAlign: 'left',

                                                display: 'flex',
                                                alignItems: 'center',
                                            }}
                                        >
                                            {locale === 'th'
                                                ? item.description_th
                                                : item.description_en}
                                        </Typography>
                                    )}
                                </Box>
                            );
                            const textBox = hasImage ? (
                                <Box
                                    sx={{
                                        minHeight: 250,
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            color: '#555',
                                            fontSize: {
                                                xs: 14,
                                                md: 15,
                                            },
                                            lineHeight: 2,
                                            fontWeight: 400,
                                            textAlign: 'left',
                                        }}
                                    >
                                        {locale === 'th'
                                            ? item.description_th
                                            : item.description_en}
                                    </Typography>
                                </Box>
                            ) : null;
                            return (
                                <Box
                                    key={`${item.title_th}-${index}`}
                                    sx={{
                                        position: 'relative',
                                        display: 'flex',
                                        flexDirection: {
                                            xs: 'column',
                                            md: 'row',
                                        },
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        gap: {
                                            xs: 4,
                                            md: 10,
                                        },
                                        mb: {
                                            xs: 0,
                                            md: 12,
                                        },
                                        pl: {
                                            xs: 0,
                                            md: 0,
                                        },
                                    }}
                                >
                                    {/* ซ้าย */}
                                    <Box
                                        sx={{
                                            width: {
                                                xs: '100%',
                                                md: '43%',
                                            },
                                            order: {
                                                xs: 1,
                                                md: 0,
                                            },
                                        }}
                                    >
                                        {isImageLeft ? imageBox : textBox}
                                    </Box>

                                    {/* ขวา */}
                                    <Box
                                        sx={{
                                            width: {
                                                xs: '100%',
                                                md: '43%',
                                            },
                                            order: {
                                                xs: 2,
                                                md: 0,
                                            },
                                        }}
                                    >
                                        {isImageLeft ? textBox : imageBox}
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                );
            })}
        </Box>
    )
}

export default TimelineSection