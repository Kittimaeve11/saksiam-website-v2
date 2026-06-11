"use client";

import { Box, Card, CardContent, Skeleton } from "@mui/material";

type Variant = "default" | "readmore" | "overlay" | "simple" | "minimal" | "list";

type Props = {
  variant?: Variant;
};

export default function NewsCardSkeleton({ variant = "default" }: Props) {
  if (variant === "list") {
    return <NewsListCardSkeleton />;
  }

  if (variant === "overlay") {
    return (
      <Card
        elevation={0}
        sx={{
          position: "relative",
          borderRadius: "20px",
          overflow: "hidden",
          height: "100%",
          minHeight: { xs: 260, sm: 300, md: 306 },
          background: "#fff",
        }}
      >
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            width: "100%",
            height: "100%",
            transform: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            left: 16,
            right: 16,
            bottom: 18,
            zIndex: 1,
          }}
        >
          <Skeleton
            variant="rounded"
            animation="wave"
            width="88%"
            height={22}
            sx={{ bgcolor: "rgba(255,255,255,0.35)", mb: 1 }}
          />
          <Skeleton
            variant="rounded"
            animation="wave"
            width="64%"
            height={22}
            sx={{ bgcolor: "rgba(255,255,255,0.28)" }}
          />
        </Box>
      </Card>
    );
  }

  if (variant === "minimal") {
    return (
      <BaseSkeletonCard radius="28px" bordered>
        <ImageSkeleton />
        <CardContent sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 1 }}>
          <TextLine width="92%" height={22} />
          <TextLine width="76%" height={22} />
          <TextLine width="96%" />
          <TextLine width="68%" />
        </CardContent>
      </BaseSkeletonCard>
    );
  }

  if (variant === "simple" || variant === "readmore") {
    return (
      <BaseSkeletonCard>
        <ImageSkeleton />
        <CardContent
          sx={{
            p: 2.5,
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            "&:last-child": { pb: 2.5 },
          }}
        >
          <TextLine width="94%" height={22} />
          <TextLine width="82%" height={22} sx={{ mt: 1 }} />
          <TextLine width="58%" height={18} sx={{ mt: "auto" }} />
        </CardContent>
      </BaseSkeletonCard>
    );
  }

  return (
    <BaseSkeletonCard>
      <ImageSkeleton />
      <CardContent
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
        }}
      >
        <Skeleton
          variant="rounded"
          animation="wave"
          width={78}
          height={28}
          sx={{
            borderRadius: "999px",
            transform: "none",
          }}
        />
        <TextLine width="94%" height={22} sx={{ mt: 1.5 }} />
        <TextLine width="78%" height={22} sx={{ mt: 1 }} />
        <Box
          sx={{
            mt: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            pt: 2,
          }}
        >
          <TextLine width={112} height={18} />
          <TextLine width={92} height={18} />
        </Box>
      </CardContent>
    </BaseSkeletonCard>
  );
}

function NewsListCardSkeleton() {
  return (
    <Card
      elevation={0}
      sx={{
        width: "100%",
        minHeight: { xs: 318, sm: 336, md: 354 },
        display: "flex",
        flexDirection: "column",
        borderRadius: "20px",
        background: "#fff",
        overflow: "hidden",
        border: "1px solid #D8DADC",
        boxShadow: `
          0 2px 6px rgba(0,0,0,0.04),
          0 12px 24px rgba(0,0,0,0.06)
        `,
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: 0,
          pt: "56.25%",
          overflow: "hidden",
          flexShrink: 0,
          bgcolor: "#E1E1E1",
        }}
      >
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            transform: "none",
            bgcolor: "#E1E1E1",
          }}
        />
      </Box>

      <CardContent
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          "&:last-child": { pb: 2 },
        }}
      >
        <Skeleton
          variant="rounded"
          animation="wave"
          width={78}
          height={28}
          sx={{
            borderRadius: "999px",
            transform: "none",
            bgcolor: "#E6E6E6",
            mb: 1,
          }}
        />

        <TextLine
          width="92%"
          height={22}
          sx={{ mt: 0.5, bgcolor: "#E0E0E0" }}
        />
        <TextLine
          width="82%"
          height={22}
          sx={{ mt: 1, bgcolor: "#E0E0E0" }}
        />
        <TextLine
          width="64%"
          height={22}
          sx={{ mt: 1, bgcolor: "#E0E0E0" }}
        />

        <Box
          sx={{
            mt: "auto",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            pt: 2,
          }}
        >
          <TextLine width={108} height={18} sx={{ bgcolor: "#E0E0E0" }} />
          <TextLine width={10} height={18} sx={{ bgcolor: "#E0E0E0" }} />
          <TextLine width={84} height={18} sx={{ bgcolor: "#E0E0E0" }} />
        </Box>
      </CardContent>
    </Card>
  );
}

function BaseSkeletonCard({
  children,
  radius = "20px",
  bordered = false,
}: {
  children: React.ReactNode;
  radius?: string;
  bordered?: boolean;
}) {
  return (
    <Card
      elevation={0}
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: radius,
        background: "#fff",
        overflow: "hidden",
        border: bordered ? "1px solid #D8DADC" : 0,
        boxShadow: `
          0 1px 2px rgba(0,0,0,0.02),
          0 4px 8px rgba(0,0,0,0.04)
        `,
      }}
    >
      {children}
    </Card>
  );
}

function ImageSkeleton() {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: 0,
        pt: "56.25%",
        overflow: "hidden",
        flexShrink: 0,
        bgcolor: "#E1E1E1",
      }}
    >
      <Skeleton
        variant="rectangular"
        animation="wave"
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          transform: "none",
          bgcolor: "#E1E1E1",
        }}
      />
    </Box>
  );
}

function TextLine({
  width,
  height = 16,
  sx,
}: {
  width: string | number;
  height?: number;
  sx?: object;
}) {
  return (
    <Skeleton
      variant="rounded"
      animation="wave"
      width={width}
      height={height}
      sx={{
        transform: "none",
        ...sx,
      }}
    />
  );
}
