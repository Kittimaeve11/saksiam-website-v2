import { cookies } from "next/headers";
import type { Metadata } from "next";
import { Box, Container, Typography } from "@mui/material";
import { apiFetch } from "@/app/api/client";
import type { Policy } from "@/app/Utils/policy";
import { toPolicyHtml } from "@/app/Utils/policy";
import { toText } from "@/app/Utils/imageUrl";

type RawRecord = Record<string, unknown>;

const BASE_POLICY_KEYWORDS = [
  "นโยบาย",
  "นโยบายบริษัท",
  "นโยบายศักดิ์สยาม",
  "นโยบาย SAKSIAM",
  "นโยบาย Saksiam Leasing",
  "ประกาศบริษัท",
  "เอกสารนโยบาย",
  "เอกสารบริษัท",
  "เอกสารสำคัญบริษัท",
  "ข้อกำหนดบริษัท",
  "เงื่อนไขการให้บริการ",
  "ข้อกำหนดและเงื่อนไข",
  "ข้อมูลส่วนบุคคล",
  "คุ้มครองข้อมูลส่วนบุคคล",
  "การคุ้มครองข้อมูลส่วนบุคคล",
  "พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล",
  "นโยบายคุกกี้",
  "นโยบายการใช้งานคุกกี้",
  "การใช้งานคุกกี้",
  "การจัดการคุกกี้",
  "คุกกี้เว็บไซต์",
  "นโยบายการคุ้มครองข้อมูลส่วนบุคคล",
  "ประกาศความเป็นส่วนตัว",
  "ความเป็นส่วนตัว",
  "ข้อมูลลูกค้า",
  "การเก็บข้อมูลส่วนบุคคล",
  "การใช้ข้อมูลส่วนบุคคล",
  "สิทธิของเจ้าของข้อมูล",
  "สิทธิเจ้าของข้อมูลส่วนบุคคล",
  "การขอใช้สิทธิข้อมูลส่วนบุคคล",
  "การรักษาความปลอดภัยข้อมูล",
  "การเปิดเผยข้อมูลส่วนบุคคล",
  "การประมวลผลข้อมูลส่วนบุคคล",
  "นโยบายการรับเรื่องร้องเรียน",
  "ช่องทางร้องเรียน",
  "ร้องเรียนทุจริต",
  "แจ้งเบาะแส",
  "นโยบายต่อต้านทุจริต",
  "นโยบายการกำกับดูแลกิจการ",
  "นโยบายความยั่งยืน",
  "บรรษัทภิบาล",
  "การกำกับดูแลกิจการ",
  "ความโปร่งใส",
  "ผู้มีส่วนได้เสีย",
  "PDPA",
  "Personal Data Protection Act",
  "Privacy Policy",
  "Cookie Policy",
  "Privacy Notice",
  "Data Protection Policy",
  "Personal Data Protection Policy",
  "Data Subject Rights",
  "Terms and Conditions",
  "Corporate Policy",
  "Company Policy",
  "Whistleblowing Policy",
  "Complaint Policy",
  "Corporate Governance Policy",
  "Sustainability Policy",
  "Saksiam",
  "Saksiam Leasing",
  "SAKSIAM",
  "SAKSIAM policy",
  "Saksiam policy",
  "Saksiam privacy policy",
  "Saksiam cookie policy",
  "Saksiam PDPA",
  "Saksiam personal data protection",
  "บริษัท ศักดิ์สยามลิสซิ่ง จำกัด (มหาชน)",
  "SAKSIAM LEASING PUBLIC COMPANY LIMITED",
];

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

const buildPolicyDescription = (policy: Policy): string => {
  const policyName = [policy.titleTH, policy.titleEN].filter(Boolean).join(" หรือ ");

  return `ศึกษา${policyName}ของ บริษัท ศักดิ์สยามลิสซิ่ง จำกัด (มหาชน) พร้อมรายละเอียด เงื่อนไข และแนวทางปฏิบัติที่เกี่ยวข้อง เพื่อให้ลูกค้า ผู้ถือหุ้น และผู้มีส่วนได้เสียเข้าถึงข้อมูลได้อย่างถูกต้อง โปร่งใส และเป็นปัจจุบัน`;
};

const buildPolicyKeywords = (policy: Policy): string[] =>
  Array.from(
    new Set(
      [
        policy.titleTH,
        policy.titleEN,
        policy.titleTH ? `${policy.titleTH} ศักดิ์สยาม` : "",
        policy.titleEN ? `${policy.titleEN} Saksiam` : "",
        ...BASE_POLICY_KEYWORDS,
      ].filter(Boolean)
    )
  );

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ segment: string }>;
}): Promise<Metadata> {
  const { segment } = await params;
  const policy = await getPolicy(segment);

  if (!policy) {
    return {
      title: "นโยบาย",
      description:
        "ศูนย์รวมนโยบาย ประกาศ และเอกสารสำคัญของ บริษัท ศักดิ์สยามลิสซิ่ง จำกัด (มหาชน)",
      keywords: BASE_POLICY_KEYWORDS,
      alternates: {
        canonical: `/policy/${segment}`,
      },
    };
  }

  const title = [policy.titleTH, policy.titleEN].filter(Boolean).join(" | ");
  const description = buildPolicyDescription(policy);
  const keywords = buildPolicyKeywords(policy);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/policy/${segment}`,
    },
    openGraph: {
      title,
      description,
      url: `https://saksiam.com/policy/${segment}`,
      siteName: "SAKSIAM",
      locale: "th_TH",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
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
      className="api-content-fade-in"
      sx={{
        position: "relative",
        isolation: "isolate",
        overflow: "hidden",
        background:
          "linear-gradient(180deg, rgba(244,248,252,0.95) 0%, #fff 34%)",
        pt: { xs: 7, md: 8 },
        pb: { xs: 2, md: 4 },
        "&::before": {
          content: '""',
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          backgroundImage:
            'url("/Icons/logo saksiam59(150x150px).png")',
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: { xs: "230px 230px", md: "420px 420px" },
          opacity: 0.06,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
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
            textAlign: "justify",
            textJustify: "inter-character",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            px: { xs: 0.5, sm: 0 },
            "& p": {
              mt: 0,
              mb: 2,
              lineHeight: 1.85,
              textAlign: "justify",
              textAlignLast: "left",
              textJustify: "inter-character",
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
              textAlign: "justify",
              textAlignLast: "left",
              textJustify: "inter-character",
            },
            "& strong, & b": {
              color: "var(--gray-700)",
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
