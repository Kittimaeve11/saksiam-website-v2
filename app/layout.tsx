import localFont from "next/font/local";
import { Suspense } from "react";
import Script from "next/script";
import "./globals.css";
/* ======================================================
   MUI PROVIDER (Fix Hydration Error)
====================================================== */

import MuiProvider from "./providers/MuiProvider";

/* ======================================================
   PROVIDERS
====================================================== */

import { LocaleProvider } from "./providers/LocaleContext";
import ThemeMode from "./providers/ThemeMode";
// import GoogleAnalytics from "./providers/GoogleAnalytics";
import ToastProvider from "./providers/ToastProvider";

/* ======================================================
   LAYOUT COMPONENTS
====================================================== */

import Navbar from "./components/layout/Navbar/Navbar";
import TabMenu from "./components/layout/TabMenu/TabMenu";
import Footer from "./components/layout/Footer/Footer";

/* ======================================================
   UI COMPONENTS
====================================================== */

import CookieBanner from "./components/ui/CookieBanner/CookieBanner";
import FloatingButtons from "./components/ui/FloatingButtons/FloatingButtons";
import BackToTopButton from "./components/ui/BackToTopButton/BackToTopButton";

/* ======================================================
   LOCAL FONT
====================================================== */

const sukhumvitTadmai = localFont({
  src: [
    {
      path: "./fonts/SukhumvitTadmai-Text.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/SukhumvitTadmai-SemiBold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/SukhumvitTadmai-ExtraBold.otf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-sukhumvit",
  display: "swap",
});

/* ======================================================
   METADATA (SEO)
====================================================== */

export const metadata = {
  title: {
    default:
      "สินเชื่อศักดิ์สยาม สินเชื่อเพื่อสังคม | บริการสินเชื่อทะเบียนรถทุกชนิด | ดอกเบี้ยถูก บริการดี มีมาตรฐาน โทร 055 440 371",
    template: "%s | SAKSIAM LEASING PUBLIC COMPANY LIMITED",
  },
  description:
    "บริษัท ศักดิ์สยามลิสซิ่ง จำกัด (มหาชน) สำนักงานใหญ่ 49/47 ถ.เจษฎาบดินทร์ ต.ท่าอิฐ อ.เมืองอุตรดิตถ์ จ.อุตรดิตถ์ 53000 อีเมล : saksiam@saksiam.co.th โทรศัพท์ : 1487 แฟกซ์ : 055 440 371",
};

/* ======================================================
   ROOT LAYOUT
====================================================== */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="th"
      className={sukhumvitTadmai.variable}
      suppressHydrationWarning
    >

      {/* Flaticon Icons */}
      <head>
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/uicons-solid-rounded/css/uicons-solid-rounded.css"
        />

        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/uicons-regular-rounded/css/uicons-regular-rounded.css"
        />

        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/uicons-bold-rounded/css/uicons-bold-rounded.css"
        />
      </head>

      <body
        className={sukhumvitTadmai.className}      >
        {/* ======================================================
           MUI Provider (Fix SSR Hydration)
        ====================================================== */}

        <MuiProvider>

          {/* Theme Provider */}
          <ThemeMode />

          {/* Locale Provider */}
          <LocaleProvider>

            {/* Google Analytics */}
            {/* <GoogleAnalytics GA_MEASUREMENT_ID="G-GRQS76P3XV" /> */}

            {/* Header */}
            <Navbar />
            <TabMenu />

            {/* Main Content */}
            <main
            >
              {children}
            </main>

            {/* Footer */}
            <Footer />

            {/* Toast Notification */}
            <ToastProvider />

          </LocaleProvider>
          {/* Floating UI */}
          <FloatingButtons />
          <BackToTopButton />
          {/* <CookieBanner /> */}


        </MuiProvider>

        {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
          <Script
            src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
            strategy="afterInteractive"
          />
        )}


      </body>


    </html>
  );
}