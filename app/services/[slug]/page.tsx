"use client";

import { apiFetch } from "@/app/api/client";
import { loanDetail } from "@/app/Utils/type";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Box, Card, Container, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import Stack from "@mui/material/Stack";
import EditDocumentIcon from '@mui/icons-material/EditDocument';
import PersonIcon from '@mui/icons-material/Person';
import { FaCircleCheck } from "react-icons/fa6";
import { BiSolidMessageSquareCheck } from "react-icons/bi";
import DescriptionIcon from '@mui/icons-material/Description';
import { BiSolidLike } from "react-icons/bi";
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import { formatTextList, safeParses } from "@/app/Utils/Format/format-json";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import InfoCard from "@/app/components/cards/InfoCard";
import Formloan from "@/app/views/services/Formloan";
import LoanStepSection from "@/app/views/services/LoanStepSection";
import SkeletonSectionsLoan from "@/app/views/services/SkeletonSectionsLoan";
const BASE_URL = process.env.NEXT_PUBLIC_API_PHOTO!;


export default function Page() {
  const theme = useTheme();
  const params = useParams();
  const slug = params.slug as string;

  const [servicesData, setServicesData] = useState<loanDetail>()
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  useEffect(() => {

    if (!slug) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await apiFetch<loanDetail>(
          `/api/loanapi/${slug}`
        );

        if (!res.status) {
          throw new Error(res.message || "API error");
        }

        setServicesData(res.data);
      } catch (err) {
        console.error("fetch error:", err);
        setError("โหลดข้อมูลไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    };
    fetchData();

  }, [slug]);

  if (loading) {
    return <SkeletonSectionsLoan />;
  }

  if (error) {
    return <Typography>{error}</Typography>;
  }
  const pdfList = servicesData?.dose
    ? servicesData.dose.split(',')
    : [];

  const productPDF = pdfList[0];
  const feePDF = pdfList[1];
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
      }}
    >
      {/* ======================================================
          HERO
      ====================================================== */}
      {servicesData?.isopen === '1' ? (
        <Box
          // sx={{
          //   position: "relative",
          //   overflow: "visible",
          //   background: isMobile
          //     ? `url('/background/bg-loanmobile.jpg')`
          //     : `url('/background/bg-loan.jpg')`,
          //   backgroundRepeat: "no-repeat",
          //   backgroundSize: "cover",
          //   aspectRatio: isMobile ? " 678 / 1032" : "3840 / 1851",
          //   backgroundPosition: "center center",
          //   width: "100%",
          //   minHeight: {
          //     xs: "auto",
          //     md: 750,
          //   },
          //   "&::after": {
          //     content: '""',
          //     position: "absolute",
          //     bottom: 0,
          //     left: 0,
          //     width: "100%",
          //     height: "6px",

          //   },

          //   py: { xs: 6, md: 10 },
          // }}
          sx={{
            position: "relative",
            overflow: "visible",
            background: isMobile
              ? `url('/background/bg-loanmobile.jpg')`
              : `url('/background/bg-loan.jpg')`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",

            // ลบบรรทัดนี้ออก
            // aspectRatio: isMobile ? "678 / 1032" : "3840 / 1851",

            backgroundPosition: "top center",
            width: "100%",

            minHeight: {
              xs: "auto",
              s: 750,
            },

            pb: {
              xs: 8,
              md: 15,
            },

            py: { xs: 6, md: 10 },
          }}
        >
          <Container maxWidth='lg'>
            <Grid container spacing={4} >
              <Grid size={{ xs: 12, md: 6 }}>
                <Box
                  sx={{
                    position: "relative",
                    minHeight: { xs: 600, sm: 780 },
                  }}
                >
                  {/* <Box
                    component="img"
                    src={`${BASE_URL}/${servicesData?.imagesmall}`}
                    alt={servicesData?.nameTH || "presenter"}
                    sx={{
                      width: "100%",
                      maxWidth: 900,
                      height: "auto",
                      objectFit: "contain",
                      display: "block",
                      mx: "auto",

                      transform: "translateY(45px)",

                      transition: "0.3s",

                      "&:hover": {
                        transform: "translateY(45px) scale(1.02)",
                      },
                    }}
                  /> */}
                  <Box
                    component="img"
                    src={`${BASE_URL}/${servicesData?.imagesmall}`}
                    alt={servicesData?.nameTH || "presenter"}
                    draggable={false}
                    sx={{
                      position: "absolute",

                      left: {
                        xs: "50%",
                        md: -40,
                      },

                      transform: {
                        xs: "translateX(-50%)",
                        md: "none",
                      },

                      bottom: 0,

                      width: {
                        xs: "90%",
                        sm: "80%",
                        md: "100%",
                      },

                      maxWidth: {
                        xs: 420,
                        sm: 500,
                        md: 600,
                      },

                      height: "auto", // <-- สำคัญ

                      objectFit: "contain",

                      transition: "0.3s",

                      "&:hover": {
                        transform: {
                          xs: "translateX(-50%) scale(1.02)",
                          md: "scale(1.02)",
                        },
                      },
                    }}
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Formloan
                  loanid={servicesData?.id}
                  name={servicesData?.nameTH}
                  vehicleTypes={servicesData?.vehicleType}
                  minamount={servicesData?.minamount}
                  maxamount={servicesData?.maxamount}
                />
              </Grid>
            </Grid>
          </Container>
        </Box>
      ) : (
        <Box
          sx={{
            position: "relative",
            overflow: "visible",
            background: isMobile
              ? `url('/background/bg-loanmobile.jpg')`
              : `url('/background/bg-loan.jpg')`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            aspectRatio: isMobile ? " 678 / 1032" : "3840 / 1851",
            backgroundPosition: "center center",
            width: "100%",

            minHeight: {
              xs: 400,
              md: 750,
            },

            display: "flex",

            justifyContent: { xs: "center", lg: "flex-end" }, // 👉 ชิดขวา
            alignItems: "flex-end", // 👉 ชิดล่าง

            "&::after": {
              content: '""',
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: "6px",
            },
          }}
        >
          <Box
            component="img"
            src={`${BASE_URL}/${servicesData?.imagesmall}`}
            alt={servicesData?.nameTH || "presenter"}
            draggable={false}
            sx={{
              width: "100%",
              maxWidth: { xs: 700, lg: 900 },

              height: "auto",
              objectFit: "contain",

              display: "block",

              transition: "0.3s",

              mr: {
                xs: 0,
                md: 5,
              },

              mb: {
                xs: 0,
                md: 0,
              },

              userSelect: "none",
              WebkitUserDrag: "none",

              "&:hover": {
                transform: "scale(1.02)",
              },
            }}
          />
        </Box>
      )}
      {/* ======================================================
          CONTENT
      ====================================================== */}

      <Container
        maxWidth="lg"
        sx={{
          pt: { xs: 8, md: 16 },
        }}
      >
        <Grid container spacing={4}>
          {/* LEFT */}
          <Grid size={{ xs: 12, md: 6 }}>
            {/* HIGHLIGHT */}
            <InfoCard
              icon={
                <EditDocumentIcon
                  sx={{
                    color: "var(--color-primary)",
                    fontSize: 40,
                  }}
                />
              }
              title="สมัครสินเชื่อกับเราดียังไง?"
            >
              <Stack spacing={2} sx={{ mt: 3, mx: 2 }}>
                {formatTextList(servicesData?.highlight)?.map((item, index) => (
                  <Stack
                    key={index}
                    direction="row"
                    spacing={1.5}
                    sx={{
                      alignItems: "center",
                      borderBottom: "1px dashed rgba(0,0,0,0.15)",
                      pb: 1,
                    }}
                  >
                    <BiSolidMessageSquareCheck
                      size={24}
                      color="var(--green-500)"
                      style={{ marginTop: "2px", flexShrink: 0 }}
                    />

                    <Typography
                      variant="body2"
                      sx={{
                        color: "rgba(0,0,0,0.6)",
                        lineHeight: 1.5,
                        fontSize: 18,
                        fontWeight: 600,
                      }}
                    >
                      {item}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </InfoCard>
            <InfoCard
              icon={
                <PersonIcon
                  sx={{
                    color: "var(--color-primary)",
                    fontSize: 40,
                  }}
                />
              }
              title=" คุณสมบัติผู้สมัครสินเชื่อ"
            >
              <Stack spacing={2} sx={{ mt: 3, mx: 2 }}>
                {formatTextList(servicesData?.qualifications)?.map((item, index) => (
                  <Stack
                    key={index}
                    direction="row"
                    spacing={1.5}
                    sx={{
                      alignItems: "center",
                      borderBottom: "1px dashed rgba(0,0,0,0.15)",
                      pb: 1,
                    }}
                  >
                    <BiSolidLike
                      size={24}
                      color="var(--red-500)"
                      style={{ marginTop: "2px", flexShrink: 0 }}
                    />

                    <Typography
                      variant="body2"
                      sx={{
                        color: "rgba(0,0,0,0.6)",
                        lineHeight: 1.5,
                        fontSize: 18,
                        fontWeight: 600,
                      }}
                    >
                      {item}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </InfoCard>
          </Grid>

          {/* RIGHT */}
          <Grid size={{ xs: 12, md: 6 }}>
            <InfoCard
              icon={
                <DescriptionIcon
                  sx={{
                    color: "var(--color-primary)",
                    fontSize: 40,
                  }}
                />
              }
              title="เอกสารประกอบการพิจารณา"
            >
              {/* LIST */}
              <Grid container spacing={3} sx={{ mt: 1 }}>
                {Array.isArray(safeParses(servicesData?.documens || "[]")) &&
                  safeParses(servicesData?.documens || "[]").map(
                    (
                      item: {
                        title: string;
                        description?: string;
                      },
                      index: number
                    ) => {
                      const title = item.title || "";
                      const splitTitle = title.split("(ตัวจริง)*");

                      return (
                        <Grid size={{ xs: 12, md: 6 }} key={index}>
                          <Box
                            sx={{
                              backgroundColor: "var(--main-blue-50)",
                              borderRadius: 4,
                              p: 2,

                              display: "flex",
                              alignItems: "flex-start",
                              gap: 1,
                            }}
                          >
                            {/* ICON */}

                            <FaCircleCheck
                              size={22}
                              color="var(--light-blue-700)"
                            />


                            {/* TEXT */}
                            <Box>
                              <Typography
                                sx={{
                                  fontWeight: 400,
                                  fontSize: 16,
                                  color: "var(--color-primary)",
                                  lineHeight: 1.5,
                                }}
                              >
                                {splitTitle[0]}

                                {title.includes("(ตัวจริง)*") && (
                                  <Box
                                    component="span"
                                    sx={{
                                      color: "var(--red-500)",
                                      fontWeight: 400,
                                    }}
                                  >
                                    {" "}
                                    (ตัวจริง)*
                                  </Box>
                                )}
                              </Typography>

                            </Box>
                          </Box>
                          {item.description && (
                            <Typography
                              sx={{
                                fontSize: 14,
                                color: "var(--red-500)",
                                mt: 0.7,
                                lineHeight: 1.7,
                              }}
                            >
                              {item.description}
                            </Typography>
                          )}
                        </Grid>
                      );
                    }
                  )}
              </Grid>
            </InfoCard>
            <InfoCard
              icon={
                <FolderSpecialIcon
                  sx={{
                    color: "var(--color-primary)",
                    fontSize: 40,
                  }}
                />
              }
              title="ต้องการดูรายละเอียดเพิ่มเติม"
            >
              <Stack spacing={3}>
                {/* PDF 1 */}
                {productPDF && (
                  <Box
                    component="a"
                    href={`${BASE_URL}/${productPDF}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      textDecoration: "none",
                      display: "block",
                    }}
                  >
                    <Stack
                      direction="row"
                      sx={{
                        pb: 1,
                        borderBottom: "1px dashed #d6d6d6",
                        cursor: "pointer",
                        transition: "0.2s",
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        "&:hover": {
                          opacity: 0.8,
                        },
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{

                          fontWeight: 600,
                          color: "#243b6b",
                        }}
                      >
                        รายละเอียดเกี่ยวกับผลิตภัณฑ์
                      </Typography>

                      <ChevronRightIcon
                        sx={{
                          fontSize: 32,
                          color: "#243b6b",
                        }}
                      />
                    </Stack>
                  </Box>
                )}

                {/* PDF 2 */}
                {feePDF && (
                  <Box
                    component="a"
                    href={`${BASE_URL}/${feePDF}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      textDecoration: "none",
                      display: "block",
                    }}
                  >
                    <Stack
                      direction="row"
                      sx={{
                        pb: 1,
                        borderBottom: "1px dashed #d6d6d6",
                        cursor: "pointer",
                        transition: "0.2s",
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        "&:hover": {
                          opacity: 0.8,
                        },
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{

                          fontWeight: 600,
                          color: "#243b6b",
                        }}
                      >
                        อัตราดอกเบี้ยและค่าธรรมเนียม
                      </Typography>

                      <ChevronRightIcon
                        sx={{
                          fontSize: 32,
                          color: "#243b6b",
                        }}
                      />
                    </Stack>
                  </Box>
                )}
              </Stack>
            </InfoCard>
            {/* CONTACT */}
            <Card
              variant="outlined"
              sx={{
                borderRadius: 7,
                display: "flex",
                flexDirection: "column",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
                border: "transparent",
                width: "100%",
                position: "relative",
                backgroundColor: "#fff",
              }}
            >
              <Box
                sx={{
                  py: 6,
                  px: 4,
                  textAlign: "center",
                  justifyItems: 'center'
                }}
              >
                {/* TITLE */}
                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: {
                      xs: 24,
                      md: 32,
                    },
                    color: "var(--color-primary)",
                    lineHeight: 1.2,
                    mb: 5,
                  }}
                >
                  ช่องทางสอบถามเพิ่มเติม
                </Typography>

                {/* SOCIAL */}
                <Stack
                  direction="row"
                  spacing={4}
                  sx={{
                    alignItems: "center",
                  }}
                >
                  {/* FACEBOOK */}
                  <Box
                    component="a"
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      width: ' 100%',
                      borderRadius: 3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textDecoration: "none",
                      transition: "0.2s",

                      "&:hover": {
                        transform: "translateY(-3px)",
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src="/Social/facebook.png"
                      alt="facebook"
                      sx={{
                        width: '70px',
                        height: "auto",
                        objectFit: "contain",
                      }}
                    />
                  </Box>

                  {/* LINE */}
                  <Box
                    component="a"
                    href="https://line.me"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      width: ' 100%',
                      borderRadius: 3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textDecoration: "none",
                      transition: "0.2s",

                      "&:hover": {
                        transform: "translateY(-3px)",
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src="/Social/line.png"
                      alt="line"
                      sx={{
                        width: '70px',
                        height: "auto",
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                </Stack>
              </Box>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 12 }}>
            <LoanStepSection />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}