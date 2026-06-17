"use client";

import Image from "next/image";
import Link from "next/link";

import Stack from "@mui/material/Stack";
import { Box, Grid, Skeleton, Typography } from "@mui/material";

import { footerMenu } from "@/app/config/footer";
import { useLocale } from "@/app/providers/LocaleContext";
import { getWebsiteMourningMode } from "@/app/Utils/websiteTheme";
import { apiFetch } from "@/app/api/client";
import { usePathname } from "next/navigation";

import { useEffect, useState } from "react";

/* ====================================================== */
type Policy = {
  id: string;
  titleTH: string;
  titleEN: string;
};

type Contact = {
  companyTH: string;
  companyEN: string;
  addressTH: string;
  addressEN: string;
  fax: string;
  callCenter: string;
  email: string[];
  social: {
    facebook: string;
    line: string;
    youtube: string;
    instagram: string;
    tiktok: string;
  };
  qrLine: string;
};

type RawContactApiData = {
  company_name?: {
    th?: string;
    en?: string;
  };
  address?: {
    th?: string;
    en?: string;
  };
  contact?: {
    callcenter?: string;
    fax?: string;
    email_main?: string;
    email_sub?: string;
  };
  social?: {
    facebook?: string;
    line?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
  };
  images?: {
    qr_line?: string;
  };
};

type FooterLoanItem = {
  id: string;
  nameTH: string;
  nameEN: string;
  href: string;
};

type FooterProps = {
  initialMourningMode?: boolean;
};

const footerSkeletonSx = {
  bgcolor: "rgba(255, 255, 255, 0.22)",
  borderRadius: "6px",
  transform: "none",
  "&::after": {
    background:
      "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.24), transparent)",
  },
};

const FooterLineSkeleton = ({
  width,
  height = 19,
}: {
  width: number | string;
  height?: number;
}) => (
  <Skeleton
    animation="wave"
    variant="rounded"
    width={width}
    height={height}
    sx={footerSkeletonSx}
  />
);

const FooterPolicySkeleton = () => (
  <Stack spacing={1.1}>
    <FooterLineSkeleton width="92%" />
    <FooterLineSkeleton width="84%" />
    <FooterLineSkeleton width="95%" />
    <FooterLineSkeleton width="78%" />
    <FooterLineSkeleton width="88%" />
  </Stack>
);

const FooterLoanSkeleton = () => (
  <Stack spacing={1.1}>
    {["92%", "88%", "96%", "84%", "98%", "78%", "90%", "86%", "94%", "82%"].map(
      (width) => (
        <FooterLineSkeleton key={width} width={width} />
      )
    )}
  </Stack>
);

const FooterContactSkeleton = () => (
  <Stack spacing={1.1}>
    <FooterLineSkeleton width="78%" />
    <FooterLineSkeleton width="96%" />
    <FooterLineSkeleton width="70%" />
  </Stack>
);

const fallbackFooterLoanItems: FooterLoanItem[] =
  footerMenu[0]?.items.map((item, index) => ({
    id: `fallback-${index}`,
    nameTH: item.label.th,
    nameEN: item.label.en,
    href: item.href,
  })) || [];

let cachedFooterPolicies: Policy[] | null = null;
let cachedFooterContact: Contact | null = null;
let cachedFooterLoans: FooterLoanItem[] | null = null;
let pendingFooterPolicies: Promise<Policy[]> | null = null;
let pendingFooterContact: Promise<Contact | null> | null = null;
let pendingFooterLoans: Promise<FooterLoanItem[]> | null = null;

const isExternalHref = (href: string) =>
  href.startsWith("http://") || href.startsWith("https://");

const ABOUT_TARGET_CLASS = "about-target-pending";
const ABOUT_TARGET_KEY = "saksiam-about-target";

const prepareFooterNavigation = (href: string) => {
  if (typeof window === "undefined" || !href.startsWith("/")) return;

  window.sessionStorage.setItem(
    ABOUT_TARGET_KEY,
    JSON.stringify({
      href,
      time: Date.now(),
    })
  );
  document.documentElement.classList.add(ABOUT_TARGET_CLASS);
};

const getFooterPolicies = async () => {
  if (cachedFooterPolicies) return cachedFooterPolicies;
  if (pendingFooterPolicies) return pendingFooterPolicies;

  pendingFooterPolicies = fetch("/api/policies")
    .then((res) => res.json())
    .then((data) => {
      const policies = data.data || [];
      cachedFooterPolicies = policies;
      return policies;
    })
    .finally(() => {
      pendingFooterPolicies = null;
    });

  return pendingFooterPolicies;
};

const toText = (value: string | number | null | undefined): string => {
  if (typeof value === "number") return String(value);
  return typeof value === "string" ? value.trim() : "";
};

const toApiAssetUrl = (value: string | number | null | undefined): string => {
  const src = toText(value);
  const base =
    process.env.NEXT_PUBLIC_API_PHOTO || process.env.NEXT_PUBLIC_API_URL || "";

  if (!src) return "";
  if (/^https?:\/\//i.test(src)) return src;
  if (!src.startsWith("/")) return src;
  if (!base) return src;

  return `${base.replace(/\/+$/, "")}${src}`;
};

const normalizeContact = (data: RawContactApiData = {}): Contact => {
  const email = [
    toText(data.contact?.email_main),
    toText(data.contact?.email_sub),
  ].filter(Boolean);

  return {
    companyTH: toText(data.company_name?.th),
    companyEN: toText(data.company_name?.en),
    addressTH: toText(data.address?.th),
    addressEN: toText(data.address?.en),
    fax: toText(data.contact?.fax),
    callCenter: toText(data.contact?.callcenter),
    email,
    social: {
      facebook: toText(data.social?.facebook),
      line: toText(data.social?.line),
      instagram: toText(data.social?.instagram),
      youtube: toText(data.social?.youtube),
      tiktok: toText(data.social?.tiktok),
    },
    qrLine: toApiAssetUrl(data.images?.qr_line) || "/Social/Qrcode-Line.png",
  };
};

const getFooterContact = async () => {
  if (cachedFooterContact) return cachedFooterContact;
  if (pendingFooterContact) return pendingFooterContact;

  pendingFooterContact = apiFetch<RawContactApiData>("/api/contactapi")
    .then((res) => {
      if (!res.status) {
        throw new Error(res.message || "Contact API error");
      }

      cachedFooterContact = normalizeContact(res.data || res.result || {});
      return cachedFooterContact;
    })
    .catch(() => null)
    .finally(() => {
      pendingFooterContact = null;
    });

  return pendingFooterContact;
};

const normalizeFooterLoans = (items: Partial<FooterLoanItem>[] = []) => {
  const loans = items
    .map((item, index) => {
      const id = toText(item.id);
      const nameTH = toText(item.nameTH);
      const nameEN = toText(item.nameEN);

      return {
        id: id || nameEN || nameTH,
        nameTH,
        nameEN,
        href: fallbackFooterLoanItems[index]?.href || "/loan/rate",
      };
    })
    .filter((item) => item.id && (item.nameTH || item.nameEN));

  return [
    ...loans,
    {
      id: "interest-rate-fee",
      nameTH: "อัตราดอกเบี้ยและค่าธรรมเนียม",
      nameEN: "Interest Rates and Fees",
      href: "/loan/rate",
    },
  ];
};

const getFooterLoans = async () => {
  if (cachedFooterLoans) return cachedFooterLoans;
  if (pendingFooterLoans) return pendingFooterLoans;

  pendingFooterLoans = apiFetch<Partial<FooterLoanItem>[]>("/api/listloanapi")
    .then((res) => {
      if (!res.status) {
        throw new Error(res.message || "Loan API error");
      }

      cachedFooterLoans = normalizeFooterLoans(res.data || res.result || []);
      return cachedFooterLoans;
    })
    .finally(() => {
      pendingFooterLoans = null;
    });

  return pendingFooterLoans;
};

export default function Footer({
  initialMourningMode = false,
}: FooterProps) {

  const { locale } = useLocale();
  const pathname = usePathname();
  const iconSize = 35;

  const [policies, setPolicies] = useState<Policy[]>(cachedFooterPolicies || []);
  const [contact, setContact] = useState<Contact | null>(cachedFooterContact);
  const [loanItems, setLoanItems] = useState<FooterLoanItem[]>(
    cachedFooterLoans || fallbackFooterLoanItems
  );

  const [loadingPolicies, setLoadingPolicies] = useState(!cachedFooterPolicies);
  const [loadingContact, setLoadingContact] = useState(!cachedFooterContact);
  const [loadingLoans, setLoadingLoans] = useState(!cachedFooterLoans);
  const [isMourningMode, setIsMourningMode] = useState(initialMourningMode);

  const [errorPolicies, setErrorPolicies] = useState(false);
  const isHomeMourningMode = pathname === "/" && isMourningMode;

  /* ================= FETCH ================= */
  useEffect(() => {
    let active = true;

    getWebsiteMourningMode().then((enabled) => {
      if (active) setIsMourningMode(enabled);
    });

    // ================= POLICY =================
    getFooterPolicies()
      .then(data => {
        if (!active) return;
        setPolicies(data);
        setLoadingPolicies(false);
      })
      .catch(() => {
        if (!active) return;
        setErrorPolicies(true);
        setLoadingPolicies(false);
      });

    // ================= CONTACT =================
    getFooterContact()
      .then(data => {
        if (!active) return;
        setContact(data);
        setLoadingContact(false);
      })
      .catch(() => {
        if (!active) return;
        setContact(null);
        setLoadingContact(false);
      });

    getFooterLoans()
      .then(data => {
        if (!active) return;
        setLoanItems(data);
        setLoadingLoans(false);
      })
      .catch(() => {
        if (!active) return;
        setLoanItems(fallbackFooterLoanItems);
        setLoadingLoans(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <Box
      component="footer"
      sx={{
        mt: "-1px",
        backgroundColor: isHomeMourningMode ? "#383838" : "var(--main-blue-950)",
      }}
    >
      {/* ================= BACKGROUND ================= */}
      <Grid
        container
        sx={{
          position: "relative",
          justifyContent: "center",
          width: "100%",
          minHeight: "420px",
          overflow: "hidden",
          color: "var(--neutral-white)",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            backgroundImage: "url('/Footer/Footer.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: isHomeMourningMode ? "grayscale(1)" : "none",
            zIndex: 0,
          },
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            background: isHomeMourningMode
              ? "rgba(42, 42, 42, 0.72)"
              : "rgba(28, 53, 99, 0.75)",
            zIndex: 1,
          },
        }}
      >
        {/* ================= CONTAINER ================= */}
        <Grid
          container
          spacing={6}
          sx={{
            width: "100%",
            maxWidth: "1200px",
            mx: "auto",
            position: "relative",
            zIndex: 2,

            px: {
              xs: 2,
              sm: 4,
              md: 15,   // 🔥 ดันเฉพาะตอน 2 คอลัม
              lg: 2      // 🔥 กลับเป็นปกติตอน 3 คอลัม
            },

            py: 8,
          }}
        >
          {/* ================= COLUMN 1 ================= */}
          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <Stack spacing={4}>
              <Grid>
                <Typography sx={{ fontWeight: "bold", mb: 1, fontSize: "20px" }}>
                  {footerMenu[0]?.title[locale]}
                </Typography>

                <Stack
                  spacing={0.7}
                  className={!loadingLoans ? "fade-in" : undefined}
                >
                  {loadingLoans ? (
                    <FooterLoanSkeleton />
                  ) : (
                    loanItems.map((item) => {
                      const isExternal = isExternalHref(item.href);

                      return (
                        <Typography
                          key={item.id}
                          component={isExternal ? "a" : Link}
                          href={item.href}
                          onMouseDown={() => prepareFooterNavigation(item.href)}
                          onClick={() => prepareFooterNavigation(item.href)}
                          scroll={isExternal ? undefined : false}
                          target={isExternal ? "_blank" : undefined}
                          rel={isExternal ? "noopener noreferrer" : undefined}
                          sx={{
                            fontSize: "16px",
                            textDecoration: "none",
                            color: "inherit",
                            "&:hover": {
                              color: "var(--main-yellow-500)",
                            },
                          }}
                        >
                          {locale === "th" ? item.nameTH : item.nameEN}
                        </Typography>
                      );
                    })
                  )}
                </Stack>
              </Grid>

              {/* POLICY */}
              <Grid>
                <Typography sx={{ fontWeight: "bold", mb: 1, fontSize: "20px" }}>
                  {locale === "th" ? "นโยบาย" : "Policies"}
                </Typography>

                <Stack
                  spacing={0.7}
                  className={!loadingPolicies ? "fade-in" : undefined}
                >
                  {loadingPolicies ? (
                    <FooterPolicySkeleton />

                  ) : errorPolicies ? (
                    // ================= ERROR =================
                    <Typography
                      sx={{
                        fontSize: "16px",
                        color: "inherit",
                        opacity: 0.7,
                      }}
                    >
                      {locale === "th" ? "โหลดข้อมูลไม่สำเร็จ" : "Failed to load"}
                    </Typography>

                  ) : policies.length > 0 ? (
                    // ================= SUCCESS =================
                    policies.map((item) => (
                      <Typography
                          key={item.id}
                          component={Link}
                          href={`/policy/${item.id}`}
                          onMouseDown={() => prepareFooterNavigation(`/policy/${item.id}`)}
                          onClick={() => prepareFooterNavigation(`/policy/${item.id}`)}
                          scroll={false}
                          sx={{
                          fontSize: "16px",
                          textDecoration: "none",
                          color: "inherit",
                          "&:hover": {
                            color: "var(--main-yellow-500)",
                          },
                        }}
                      >
                        {locale === "th" ? item.titleTH : item.titleEN}
                      </Typography>
                    ))
                  ) : (
                    // ================= NO DATA =================
                    <Typography
                      sx={{
                        fontSize: "16px",
                        color: "inherit",
                        opacity: 0.6,
                      }}
                    >
                      {locale === "th" ? "ไม่มีข้อมูล" : "No data"}
                    </Typography>
                  )}
                </Stack>              </Grid>
            </Stack>
          </Grid>

          {/* ================= COLUMN 2 ================= */}
          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <Stack spacing={4}>
              {footerMenu.slice(1, 2).map((menu) => (
                <Grid key={menu.title.th}>
                  <Typography sx={{ fontWeight: "bold", mb: 1, fontSize: "20px" }}>
                    {menu.title[locale]}
                  </Typography>

                  <Stack spacing={0.7}>
                    {menu.items.map((item, i) => {
                      const isExternal = isExternalHref(item.href);

                      return (
                        <Typography
                          key={i}
                          component={isExternal ? "a" : Link}
                          href={item.href}
                          onMouseDown={() => prepareFooterNavigation(item.href)}
                          onClick={() => prepareFooterNavigation(item.href)}
                          scroll={isExternal ? undefined : false}
                          target={isExternal ? "_blank" : undefined}
                          rel={isExternal ? "noopener noreferrer" : undefined}
                          sx={{
                            fontSize: "16px",
                            textDecoration: "none",
                            color: "inherit",
                            "&:hover": {
                              color: "var(--main-yellow-500)",
                            },
                          }}
                        >
                          {item.label[locale]}
                        </Typography>
                      );
                    })}
                  </Stack>
                </Grid>
              ))}
            </Stack>
          </Grid>

          {/* ================= COLUMN 3 ================= */}
          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <Stack spacing={2}>
              <Typography sx={{ fontWeight: "bold", mb: 1, fontSize: "20px" }}>
                {locale === "th" ? "ติดต่อเรา" : "Contact Us"}
              </Typography>

              {/*  ใช้ API */}
                {loadingContact ? (
                  <FooterContactSkeleton />
                ) : contact ? (
                  <Stack spacing={0.7} className="fade-in">
                  <Typography sx={{ fontSize: "16px" }}>
                    {locale === "th" ? contact.companyTH : contact.companyEN}
                  </Typography>

                  <Typography sx={{ fontSize: "16px" }}>
                    {locale === "th" ? contact.addressTH : contact.addressEN}
                  </Typography>
                </Stack>
              ) : (
                <Typography sx={{ fontSize: "16px", opacity: 0.7 }}>
                  {locale === "th" ? "ไม่มีข้อมูล" : "No data"}
                </Typography>
              )}

              {/* CONTACT */}
              <Grid
                container
                spacing={3}
                className={!loadingContact ? "fade-in" : undefined}
                sx={{
                  alignItems: "center",
                  flexWrap: "wrap",   // 🔥 ให้มัน wrap ได้ตลอด
                }}
              >
                <Grid
                  size={{ xs: 12, sm: "grow" }}   // 🔥 mobile = เต็มแถว
                >
                  <Stack spacing={2}>
                    {/* EMAIL */}
                    <Stack
                      direction="row"
                      sx={{
                        alignItems: "center",
                        columnGap: 1,
                        minWidth: 0,
                      }}
                    >
                      <Grid
                        component="i"
                        className="fi fi-rr-envelope"
                        sx={{
                          fontSize: "18px",
                          color: "var(--main-yellow-500)",
                          display: "flex",
                          alignItems: "center",
                          flex: "0 0 18px",
                          width: 18,
                        }}
                      />
                      <Typography sx={{ fontSize: "16px", flex: 1, minWidth: 0 }}>
                          {loadingContact ? (
                          <FooterLineSkeleton width="100%" />
                        ) : contact ? (
                            <span>
                              {contact.email?.[0] || (locale === "th" ? "ไม่มีข้อมูล" : "No data")}
                            </span>
                          ) : (
                          <span>{locale === "th" ? "ไม่มีข้อมูล" : "No data"}</span>
                        )}
                      </Typography>
                    </Stack>

                    {/* PHONE */}
                    {loadingContact ? (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          minHeight: 40,
                        }}
                      >
                        <FooterLineSkeleton width={120} height={40} />
                      </Box>
                    ) : contact ? (
                      <Stack
                        direction="row"
                        spacing={1.5}
                        sx={{ alignItems: "center" }}
                      >
                        {/* ICON */}
                        <Grid
                          container
                          sx={{
                            width: 40,
                            height: 40,
                            border: "2.5px solid var(--main-yellow-500)",
                            borderRadius: "10px",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Grid
                            component="i"
                            className="fi fi-sr-phone-call"
                            sx={{
                              fontSize: "20px",
                              color: "var(--main-yellow-500)",
                              lineHeight: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          />
                        </Grid>

                        {/* TEXT */}
                        <Typography
                          sx={{
                            fontSize: "36px",
                            fontWeight: 800,
                            color: "var(--main-yellow-500)",
                          }}
                        >
                          {contact.callCenter}
                        </Typography>
                      </Stack>
                    ) : (
                      <Typography sx={{ fontSize: "16px", opacity: 0.7 }}>
                        {locale === "th" ? "ไม่มีข้อมูล" : "No data"}
                      </Typography>
                    )}

                    {/* SOCIAL */}
                    <Stack direction="row" spacing={1}>
                      <Link href={contact?.social.facebook || "#"} target="_blank">
                        <Image
                          src="/Social/facebook.png"
                          width={iconSize}
                          height={iconSize}
                          alt="facebook"
                        />
                      </Link>

                      <Link href={contact?.social.youtube || "#"} target="_blank">
                        <Image
                          src="/Social/youtube.png"
                          width={iconSize}
                          height={iconSize}
                          alt="youtube"
                        />
                      </Link>

                      <Link href={contact?.social.instagram || "#"} target="_blank">
                        <Image
                          src="/Social/instagram.png"
                          width={iconSize}
                          height={iconSize}
                          alt="instagram"
                        />
                      </Link>

                      <Link href={contact?.social.tiktok || "#"} target="_blank">
                        <Image
                          src="/Social/tiktok.png"
                          width={iconSize}
                          height={iconSize}
                          alt="tiktok"
                        />
                      </Link>
                    </Stack>
                  </Stack>
                </Grid>

                {/* QR CLICK LINE */}
                <Grid
                  sx={{
                    flexBasis: { xs: "100%", sm: "auto" },   // 🔥 ตัวจริง
                    width: { xs: "100%", sm: "auto" },
                    display: "flex",
                    justifyContent: { xs: "flex-start", sm: "center" },
                    mt: { xs: 2, sm: 0 },
                  }}
                >
                  <Link href={contact?.social.line || "#"} target="_blank">
                    <Box
                      component="img"
                      src={contact?.qrLine || "/Social/Qrcode-Line.png"}
                      alt="line"
                      onError={(event) => {
                        event.currentTarget.src = "/Social/Qrcode-Line.png";
                      }}
                      sx={{
                        width: 150,
                        height: 150,
                        cursor: "pointer",
                        objectFit: "contain",
                        borderRadius: "18px",
                      }}
                    />
                  </Link>
                </Grid>
              </Grid>
            </Stack>
          </Grid>
        </Grid>
      </Grid>

      {/* COPYRIGHT */}
      <Grid
        sx={{
          width: "100%",
          backgroundColor: isHomeMourningMode ? "#303030" : "var(--main-blue-950)",
          py: 1.5,
          textAlign: "center",
        }}
      >
        <Typography
          sx={{
            color: "var(--neutral-white)",
            fontSize: { xs: "12px", md: "14px" },
          }}
        >
          © 2026 Copyright: Saksiam Leasing Public Company Limited. All Rights
          Reserved.
        </Typography>
      </Grid>
    </Box>
  );
}
