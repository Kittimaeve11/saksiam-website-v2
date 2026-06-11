"use client";

import { Box, Container, Grid, Skeleton, Stack } from "@mui/material";

export default function NewsDetaiSkeleton() {
  return (
    <Box>
      <Container
        maxWidth="xl"
        sx={{
          pt: { xs: 2.5, md: 3 },
          px: { xs: 2, md: 3 },
        }}
      >
        <Skeleton
          variant="text"
          sx={{
            width: { xs: "92%", sm: 560, md: 720 },
            height: { xs: 54, md: 28 },
            borderRadius: 1,
          }}
        />
      </Container>

      <Box
        sx={{
          maxWidth: "lg",
          mx: "auto",
          mt: { xs: 3, md: 4 },
          px: { xs: 2, md: 2 },
          pb: 8,
        }}
      >
        <Box
          sx={{
            width: "100%",
            aspectRatio: "16 / 9",
            borderRadius: { xs: "20px", md: "30px" },
            overflow: "hidden",
            position: "relative",
            mb: 0,
          }}
        >
          <Skeleton
            variant="rectangular"
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              transform: "none",
            }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            my: 3,
            mx: { xs: 0, md: 2 },
            flexWrap: "wrap",
            gap: { xs: 1.5, md: 2 },
          }}
        >
          <Stack
            direction="row"
            spacing={{ xs: 1.5, md: 2 }}
            sx={{
              alignItems: "center",
              order: { xs: 1, md: 0 },
            }}
          >
            <Skeleton
              variant="text"
              sx={{ width: { xs: 132, md: 140 }, height: 24 }}
            />
            <Skeleton
              variant="text"
              sx={{ width: { xs: 74, md: 86 }, height: 24 }}
            />
          </Stack>

          <Stack
            direction="row"
            spacing={{ xs: 1, md: 1.5 }}
            sx={{
              ml: { xs: "auto", md: 0 },
              order: { xs: 2, md: 0 },
            }}
          >
            {[0, 1, 2].map((item) => (
              <Skeleton
                key={item}
                variant="circular"
                sx={{
                  width: { xs: 36, md: 40 },
                  height: { xs: 36, md: 40 },
                }}
              />
            ))}
          </Stack>
        </Box>

        <Skeleton
          variant="text"
          sx={{
            width: { xs: "100%", sm: "86%", md: "70%" },
            height: { xs: 76, sm: 48, md: 48 },
            mb: 2,
            borderRadius: 1,
          }}
        />

        <Stack spacing={{ xs: 1.15, md: 1.5 }} sx={{ mb: 5 }}>
          {[0, 1, 2, 3, 4].map((item) => (
            <Skeleton
              key={item}
              variant="text"
              sx={{
                width:
                  item === 4
                    ? { xs: "78%", md: "72%" }
                    : "100%",
                height: { xs: 25, md: 28 },
                borderRadius: 1,
              }}
            />
          ))}
        </Stack>

        <Grid container spacing={2} sx={{ mb: { xs: 5, md: 5 } }}>
          {[0, 1, 2].map((item) => (
            <Grid key={item} size={{ xs: 12, sm: 4 }}>
              <Skeleton
                variant="rounded"
                sx={{
                  width: "100%",
                  aspectRatio: "16 / 9",
                  borderRadius: "14px",
                }}
              />
            </Grid>
          ))}
        </Grid>

        <Skeleton variant="text" sx={{ width: 220, height: 34, mb: 2 }} />

        <Grid container spacing={2}>
          {[0, 1, 2].map((item) => (
            <Grid key={item} size={{ xs: 12, md: 4 }}>
              <Skeleton
                variant="rounded"
                sx={{
                  width: "100%",
                  height: { xs: 330, md: 320 },
                  borderRadius: "16px",
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
