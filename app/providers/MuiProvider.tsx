"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";

/* ======================================================
   MUI THEME
====================================================== */

const theme = createTheme({
  typography: {
    fontFamily: "var(--font-sukhumvit), sans-serif",
  },
});

/* ======================================================
   PROVIDER
====================================================== */

export default function MuiProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppRouterCacheProvider>

      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>

    </AppRouterCacheProvider>
  );
}