import React, { useEffect, useState } from 'react'
import {
  Box,
  Container,
  Typography
} from '@mui/material'
import { useLocale } from '@/app/providers/LocaleContext'
import { HistoryData } from '@/app/Utils/type'
import { apiFetch } from '@/app/api/client'
import HeadingSection from './historysection/HeadingSection'
import TimelineSection from './historysection/TimelineSection'

const HistorySection = () => {
  const [data, setData] = useState<HistoryData | null>(null);
  const { messages, locale } = useLocale();
  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        const res = await apiFetch<HistoryData>(
          "/api/historyapi"
        );

        if (!res.status) {
          if (active) setData(null);
          console.warn("history api unavailable:", res.message || "API error");
          return;
        }

        if (active) setData(res.data ?? null);

      } catch (err) {
        if (active) setData(null);
        console.warn("history api unavailable:", err);
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, []);
  return (
    <Box
      sx={{
        py: { xs: 4, md: 8 },
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 350,
          height: 350,
          borderRadius: '50%',
        }}
      />

      <Container maxWidth="lg">
        {/* Heading And Stats*/}
        <HeadingSection
          title1={messages.about.title1}
          title2={messages.about.title2}
          branch={messages.branch.branch}
          employees={messages.about.employees}
          years={messages.about.years}
          subheadline_th={data?.hero.subheadline_th}
          subheadline_en={data?.hero.subheadline_en}
        />
        {/* Stats */}
        {/* Founder Quote */}
        <Box
          sx={{
            mt: { xs: 8, md: 12 },
            textAlign: 'center',
            maxWidth: '650px',
            width: '100%',
            mx: 'auto',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: 'var(--main-blue-500)',
              fontWeight: 600,
              mb: 4,
            }}
          >
            {locale === 'th'
              ? data?.philosophy.title_th
              : data?.philosophy.title_en}
          </Typography>

          <Typography
            sx={{
              color: '#F5A623',
              fontWeight: 700,
              fontSize: {
                xs: '1.5rem',
                md: '2rem',
              },
              lineHeight: 1.8,
              maxWidth: '650px',
              mx: 'auto',
              textAlign: 'center',
              mb: 4,
            }}
          >
            ❝ {locale === 'th'
              ? data?.philosophy.quote_th
              : data?.philosophy.quote_en} ❞
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: 'var(--main-blue-500)',
              fontWeight: 600
            }}
          >
            {locale === 'th'
              ? data?.philosophy.description_th
              : data?.philosophy.description_en}
          </Typography>

        </Box>
        <Box
          sx={{
            py: { xs: 8, md: 12 },
            maxWidth: 900,
            mx: 'auto',
            textAlign: 'center',
          }}
        >
          <Typography
            sx={{
              color: "var(--gray-500)",
              fontWeight: 400,
              fontSize: {
                xs: "0.85rem", // มือถือ
                sm: "0.95rem", // Tablet
                md: "1rem",    // Desktop
              },
              lineHeight: 1.6,
            }}
          >
            {locale === 'th'
              ? data?.introduction.title_th
              : data?.introduction.title_en}
          </Typography>

          <Typography
            sx={{
              color: "var(--gray-500)",
              fontWeight: 400,
              fontSize: {
                xs: "0.8rem",
                sm: "0.9rem",
                md: "1rem",
              },
              lineHeight: 1.8,
              mx: "auto",
              textAlign: "center",
            }}
          >
            {locale === 'th'
              ? data?.introduction.description_th
              : data?.introduction.description_en}
          </Typography>
        </Box>
        {/* TimelineSection */}
        <TimelineSection
          timelineData={data?.eras}
        />
      </Container>
    </Box>
  )
}

export default HistorySection
