import { Box, Skeleton, Typography } from "@mui/material";

import NewsCardSkeleton from "@/app/components/cards/NewsCard/NewsCardskeleton";
import { NewsContentScrollTracker } from "./NewsContentScrollKeeper";

const NewsContentSectionSkeleton = ({
  overlayLeft = true,
}: {
  overlayLeft?: boolean;
}) => (
  <Box sx={{ mb: 7 }}>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3,
      }}
    >
      <Skeleton variant="text" width={190} height={52} />
      <Skeleton variant="text" width={80} height={28} />
    </Box>

    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: overlayLeft ? "1.15fr 1fr" : "1fr 1.15fr",
          lg: overlayLeft ? "2fr 1fr 1fr" : "1fr 1fr 2fr",
        },
        gap: 3,
        alignItems: "stretch",
      }}
    >
      {overlayLeft ? (
        <>
          <NewsCardSkeleton variant="overlay" />
          <NewsCardSkeleton variant="simple" />
          <Box sx={{ display: { xs: "none", lg: "block" } }}>
            <NewsCardSkeleton variant="simple" />
          </Box>
        </>
      ) : (
        <>
          <NewsCardSkeleton variant="simple" />
          <Box sx={{ display: { xs: "none", lg: "block" } }}>
            <NewsCardSkeleton variant="simple" />
          </Box>
          <NewsCardSkeleton variant="overlay" />
        </>
      )}
    </Box>

    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 1,
        mt: 2,
      }}
    >
      <Skeleton
        variant="rounded"
        width={56}
        height={10}
        sx={{ borderRadius: "999px", bgcolor: "var(--yellow-500)" }}
      />
      <Skeleton variant="circular" width={10} height={10} />
    </Box>
  </Box>
);

export default function NewsContentSkeleton() {
  return (
    <Box
      component="main"
      sx={{
        width: "100%",
        maxWidth: "lg",
        mx: "auto",
        px: { xs: 2, sm: 3, md: 4 },
        pt: { xs: 5, md: 4 },
        pb: { xs: 2, md: 5 },
      }}
    >
      <NewsContentScrollTracker />
      <Typography
        component="span"
        sx={{
          position: "absolute",
          width: 1,
          height: 1,
          overflow: "hidden",
          clip: "rect(0 0 0 0)",
        }}
      >
        Loading news content
      </Typography>
      <NewsContentSectionSkeleton overlayLeft />
      <NewsContentSectionSkeleton overlayLeft={false} />
    </Box>
  );
}
