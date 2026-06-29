"use client";

import { useEffect, useState } from "react";
import { Box, Skeleton, Typography } from "@mui/material";
import { apiFetch, getCachedApiResponse } from "@/app/api/client";
import { useLocale } from "@/app/providers/LocaleContext";
import { toPolicyHtml, type Policy } from "@/app/Utils/policy";
import { toText } from "@/app/Utils/imageUrl";

type RawRecord = Record<string, unknown>;

const pick = (item: RawRecord, keys: string[]): unknown => {
  for (const key of keys) {
    if (item[key] !== undefined && item[key] !== null) return item[key];
  }

  return "";
};

const getRecord = (response: unknown): RawRecord | null => {
  if (Array.isArray(response)) return (response[0] as RawRecord) || null;

  if (response && typeof response === "object") {
    const record = response as RawRecord;

    if (
      record.data &&
      typeof record.data === "object" &&
      !Array.isArray(record.data)
    ) {
      return record.data as RawRecord;
    }

    if (Array.isArray(record.data)) return (record.data[0] as RawRecord) || null;
    if (Array.isArray(record.result)) {
      return (record.result[0] as RawRecord) || null;
    }
  }

  return null;
};

const cleanHtml = (value: unknown): string => {
  const text = toText(value).trim();

  if (!text) return "";

  try {
    const parsed = JSON.parse(text);
    return typeof parsed === "string" ? parsed : text;
  } catch {
    return text.replace(/^"|"$/g, "");
  }
};

const normalizePolicy = (item: RawRecord): Policy => ({
  id: toText(pick(item, ["policyNum", "policyID", "id"])),
  titleTH: toText(pick(item, ["nameTH", "titleTH"])),
  titleEN: toText(pick(item, ["nameEN", "titleEN"])),
  detailTH: cleanHtml(pick(item, ["detailTH", "descriptionTH"])),
  detailEN: cleanHtml(pick(item, ["detailEN", "descriptionEN"])),
});

export default function PrivacyConsent() {
  const { locale } = useLocale();
  const endpoint = "/api/policyapi/PO2605180001";
  const cached = getCachedApiResponse<unknown>(endpoint);
  const cachedRecord = cached ? getRecord(cached) : null;
  const [policy, setPolicy] = useState<Policy | null>(
    cachedRecord ? normalizePolicy(cachedRecord) : null
  );
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    let mounted = true;
    const cached = getCachedApiResponse<unknown>(endpoint);
    if (cached) {
      const record = getRecord(cached);
      setPolicy(record ? normalizePolicy(record) : null);
      setLoading(false);
      return;
    }

    const fetchPolicy = async () => {
      try {
        setLoading(true);
        const response = await apiFetch<unknown>(endpoint);
        const record = getRecord(response);

        if (mounted) {
          setPolicy(record ? normalizePolicy(record) : null);
        }
      } catch (error) {
        console.error("Fetch privacy consent policy error:", error);
        if (mounted) setPolicy(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPolicy();

    return () => {
      mounted = false;
    };
  }, [endpoint]);

  if (loading) {
    return (
      <Box sx={{ px: { xs: 1, md: 3 }, py: 1 }}>
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton
            key={index}
            variant="text"
            height={26}
            sx={{ mb: 0.75 }}
          />
        ))}
      </Box>
    );
  }

  if (!policy) {
    return (
      <Box className="api-content-fade-in" sx={{ px: { xs: 1, md: 3 }, py: 1 }}>
        <Typography sx={{ color: "var(--gray-500)", fontSize: 14 }}>
          {locale === "en"
            ? "Unable to load privacy policy."
            : "ไม่สามารถโหลดนโยบายได้"}
        </Typography>
      </Box>
    );
  }

  const detail = locale === "en" ? policy.detailEN : policy.detailTH;

    return (
      <Box
        className="api-content-fade-in"
        sx={{
        px: { xs: 1, md: 3 },
        py: 1,
        color: "var(--gray-700)",
        fontSize: 14,
        lineHeight: 1.9,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        "& p": {
          mt: 0,
          mb: 1.5,
          lineHeight: 1.9,
        },
        "& p:empty": {
          minHeight: "1.9em",
          mb: 0,
        },
        "& ul, & ol": {
          mt: 1,
          mb: 2,
          pl: { xs: 3, md: 4 },
        },
        "& li": {
          mb: 0.75,
        },
        "& strong, & b": {
          color: "var(--main-blue-700)",
          fontWeight: 700,
        },
        "& a": {
          color: "var(--color-info)",
          textDecoration: "underline",
          textUnderlineOffset: "3px",
        },
      }}
      dangerouslySetInnerHTML={{ __html: toPolicyHtml(detail) }}
    />
  );
}
