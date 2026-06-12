import { cookies } from "next/headers";
import { Box, Container, Typography } from "@mui/material";
import { apiFetch } from "@/app/api/client";
import type { Policy } from "@/app/Utils/policy";
import { toPolicyHtml } from "@/app/Utils/policy";

type RawRecord = Record<string, unknown>;

const toText = (value: unknown): string =>
  typeof value === "string" ? value : "";

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

    if (record.data && typeof record.data === "object" && !Array.isArray(record.data)) {
      return record.data as RawRecord;
    }

    if (Array.isArray(record.data)) return (record.data[0] as RawRecord) || null;
    if (Array.isArray(record.result)) return (record.result[0] as RawRecord) || null;
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

async function getPolicy(segment: string): Promise<Policy | null> {
  try {
    const response = await apiFetch<unknown>(
      `/api/policyapi/${encodeURIComponent(segment)}`
    );
    const record = getRecord(response);

    return record ? normalizePolicy(record) : null;
  } catch (error) {
    console.error("Fetch policy error:", error);
    return null;
  }
}

async function getLocale() {
  const cookieStore = await cookies();
  return cookieStore.get("locale")?.value === "en" ? "en" : "th";
}

export default async function Page({
  params,
}: {
  params: Promise<{ segment: string }>;
}) {
  const [{ segment }, locale] = await Promise.all([params, getLocale()]);
  const policy = await getPolicy(segment);

  if (!policy) {
    return (
      <Box sx={{ textAlign: "center", py: 12 }}>
        <Typography>{locale === "en" ? "Policy not found" : "ไม่พบนโยบาย"}</Typography>
      </Box>
    );
  }

  const detail = locale === "en" ? policy.detailEN : policy.detailTH;

  return (
    <Box
      component="main"
      sx={{
        background:
          "linear-gradient(180deg, rgba(244,248,252,0.95) 0%, #fff 34%)",
        pt: { xs: 7, md: 10 },
        pb: { xs: 8, md: 12 },
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            mb: { xs: 4, md: 6 },
            textAlign: "center",
            px: { xs: 1, sm: 0 },
          }}
        >
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: 31, sm: 36, md: 32 },
              fontWeight: 800,
              lineHeight: { xs: 1.22, md: 1.25 },
              wordBreak: "break-word",
            }}
          >
            <Box component="span" sx={{ color: "var(--color-primary)" }}>
              {policy.titleTH}
            </Box>
            {policy.titleEN && (
              <Box
                component="span"
                sx={{
                  color: "var(--color-secondary-hover)",
                  display: { xs: "inline", sm: "inline" },
                }}
              >
                {` (${policy.titleEN})`}
              </Box>
            )}
          </Typography>
        </Box>

        <Box
          sx={{
            maxWidth: "960px",
            mx: "auto",
            color: "var(--gray-700)",
            fontSize: { xs: "16px", md: "18px" },
            lineHeight: 1.85,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            px: { xs: 0.5, sm: 0 },
            "& p": {
              mt: 0,
              mb: 2,
              lineHeight: 1.85,
            },
            "& p:empty": {
              minHeight: "1.85em",
              mb: 0,
            },
            "& ul, & ol": {
              mt: 1,
              mb: 2,
              pl: { xs: 3, md: 5 },
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
      </Container>
    </Box>
  );
}
