import localFont from "next/font/local";
import { cookies } from "next/headers";
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
import ApiCacheReset from "./providers/ApiCacheReset";

/* ======================================================
   LAYOUT COMPONENTS
====================================================== */

import Navbar from "./components/layout/Navbar/Navbar";
import NavigationRestore from "./components/layout/NavigationRestore/NavigationRestore";
import TabMenu from "./components/layout/TabMenu/TabMenu";
import Footer from "./components/layout/Footer/Footer";

/* ======================================================
   UI COMPONENTS
====================================================== */

import FloatingButtons from "./components/ui/FloatingButtons/FloatingButtons";
import BackToTopButton from "./components/ui/BackToTopButton/BackToTopButton";
import CookieBanner from "./components/ui/CookieBanner/CookieBanner";
import { getWebsiteMourningMode } from "./Utils/websiteTheme";

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
  preload: false, // 🔥 ใส่ตรงนี้
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

const getInitialLocale = async () => {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value;

  return locale === "en" ? "en" : "th";
};

const localeBootstrapScript = `
  (function () {
    try {
      var saved = localStorage.getItem("locale");
      if (saved !== "th" && saved !== "en") return;

      var match = document.cookie.match(/(?:^|; )locale=(th|en)(?:;|$)/);
      var cookieLocale = match ? match[1] : null;
      if (cookieLocale === saved) return;

      document.cookie = "locale=" + saved + "; path=/; max-age=31536000; samesite=lax";
      document.documentElement.lang = saved;

      var reloadKey = "locale-cookie-synced";
      if (sessionStorage.getItem(reloadKey) !== saved) {
        sessionStorage.setItem(reloadKey, saved);
        location.replace(location.href);
      }
    } catch (_) {}
  })();
`;

const scrollRestoreBootstrapScript = `
  (function () {
    try {
      if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
      }

      var nav = performance.getEntriesByType && performance.getEntriesByType("navigation")[0];
      var isReload = nav && nav.type === "reload";
      var raw = sessionStorage.getItem("saksiam-scroll-restore");
      var shouldFade = !!isReload;

      if (raw) {
        var data = JSON.parse(raw);
        var page = location.pathname + location.search;
        var shouldRestore =
          data &&
          data.page === page &&
          typeof data.y === "number" &&
          data.y > 0 &&
          typeof data.time === "number" &&
          Date.now() - data.time < 60000;

        if (shouldRestore) {
          shouldFade = true;

          document.documentElement.classList.add("scroll-restore-pending");
        }
      }

      if (shouldFade) {
        document.documentElement.classList.add("page-refresh-fade-pending");
      }
    } catch (_) {}
  })();
`;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [initialLocale, initialMourningMode] = await Promise.all([
    getInitialLocale(),
    getWebsiteMourningMode(),
  ]);

  return (
    <html
      lang={initialLocale}
      className={sukhumvitTadmai.variable}
      suppressHydrationWarning
    >

      {/* Flaticon Icons */}
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: localeBootstrapScript }}
        />
        <script
          dangerouslySetInnerHTML={{ __html: scrollRestoreBootstrapScript }}
        />

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
          <ApiCacheReset />

          {/* Locale Provider */}
          <LocaleProvider initialLocale={initialLocale}>

            {/* Google Analytics */}
            {/* <GoogleAnalytics GA_MEASUREMENT_ID="G-GRQS76P3XV" /> */}

            {/* Header */}
            <NavigationRestore />
            <Navbar initialMourningMode={initialMourningMode} />
            <TabMenu initialMourningMode={initialMourningMode} />

            {/* Main Content */}
            <main
            >
              {children}
            </main>

            {/* Footer */}
            <Footer initialMourningMode={initialMourningMode} />

            {/* Toast Notification */}
            <ToastProvider />

          </LocaleProvider>
          {/* Floating UI */}
          <FloatingButtons />
          <BackToTopButton />
          <CookieBanner />


        </MuiProvider>

      </body>


    </html>
  );
}
