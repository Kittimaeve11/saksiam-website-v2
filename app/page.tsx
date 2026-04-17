// app/page.tsx

/* ======================================================
   IMPORT
====================================================== */
import HomeBanner from "./views/home/HomeBanner/HomeBanner";
import HomeClient from "./views/home/HomeClient";
import TestimonialSection from "./views/home/TestimonialSection/TestimonialSection";
import HomeIntroSection from "./views/home/HomeIntroSection/HomeIntroSection";

/* ======================================================
   NEXT CONFIG
====================================================== */
export const dynamic = "force-dynamic";

/* ======================================================
   PAGE
====================================================== */
export default function Page() {
  return (
    <>
      {/* Banner */}
      <HomeBanner />

      {/* Main Client Section */}
      <HomeClient />

      {/* Bottom Section */}
      <TestimonialSection />
      <HomeIntroSection />
    </>
  );
}