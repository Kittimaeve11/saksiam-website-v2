"use client";

import { Box, Container, Skeleton, Stack } from "@mui/material";

export default function PolicySkeleton() {
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
            mx: "auto",
            maxWidth: { xs: 360, md: 820 },
            textAlign: "center",
          }}
        >
          <Skeleton
            variant="text"
            sx={{
              width: { xs: "92%", md: "78%" },
              height: { xs: 46, md: 48 },
              mx: "auto",
              borderRadius: 1,
            }}
          />
          <Skeleton
            variant="text"
            sx={{
              width: { xs: "72%", md: "52%" },
              height: { xs: 42, md: 44 },
              mx: "auto",
              mt: { xs: 0.4, md: 0 },
              borderRadius: 1,
            }}
          />
        </Box>

        <Stack
          spacing={{ xs: 1.4, md: 1.7 }}
          sx={{
            maxWidth: "960px",
            mx: "auto",
          }}
        >
          {[0, 1, 2, 3, 4, 5, 6, 7].map((item) => (
            <Skeleton
              key={item}
              variant="text"
              sx={{
                width:
                  item === 7
                    ? { xs: "72%", md: "70%" }
                    : item === 0
                      ? { xs: "88%", md: "92%" }
                      : "100%",
                height: { xs: 26, md: 30 },
                borderRadius: 1,
              }}
            />
          ))}

          <Box sx={{ height: { xs: 10, md: 16 } }} />

          {[0, 1, 2].map((group) => (
            <Stack key={group} spacing={{ xs: 1.2, md: 1.5 }}>
              <Skeleton
                variant="text"
                sx={{
                  width: { xs: "56%", md: "38%" },
                  height: { xs: 30, md: 34 },
                  borderRadius: 1,
                }}
              />
              {[0, 1, 2].map((item) => (
                <Skeleton
                  key={item}
                  variant="text"
                  sx={{
                    width:
                      item === 2
                        ? { xs: "76%", md: "82%" }
                        : "100%",
                    height: { xs: 25, md: 29 },
                    borderRadius: 1,
                  }}
                />
              ))}
            </Stack>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
