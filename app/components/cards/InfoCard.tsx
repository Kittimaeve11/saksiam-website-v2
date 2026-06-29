import { Box, Card, Grid, Stack, Typography } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

export default function InfoCard({
  icon,
  title,
  children,
}: InfoCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 7,
        display: "flex",
        flexDirection: "column",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        overflow: "hidden",
        border: "transparent",
        width: "100%",
        position: "relative",
        mb: 3,
        backgroundColor: "#fff",
      }}
    >
      <Box sx={{ p: 4 }}>
        {/* HEADER */}
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: "center",
            mb: 4,
          }}
        >
          {icon}

          <Typography
            sx={{
              fontWeight: 800,
              fontSize: {
                xs: 24,
                md: 32,
              },
              color: "var(--color-primary)",
              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>
        </Stack>

        {children}
      </Box>
    </Card>
  );
}