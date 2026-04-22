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
   FETCH DATA (SERVER)
====================================================== */
async function getData() {
  try {
    const [p, a, t, s] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/data/thai_provinces.json`, {
        cache: "force-cache",
      }).then((r) => r.json()),

      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/data/thai_amphures.json`, {
        cache: "force-cache",
      }).then((r) => r.json()),

      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/data/thai_tambons.json`, {
        cache: "force-cache",
      }).then((r) => r.json()),

      fetch(`${process.env.NEXT_PUBLIC_BASE_URL_API}/api/service`, {
        cache: "no-store",
      }).then((r) => r.json()),
    ]);

    return {
      provinces: p,
      amphures: a,
      tambons: t,
      services: s?.services || [],
    };
  } catch (error) {
    console.error("HOME FETCH ERROR:", error);
    return {
      provinces: [],
      amphures: [],
      tambons: [],
      services: [],
    };
  }
}

/* ======================================================
   PAGE
====================================================== */
export default async function Page() {
  const data = await getData();

  return (
    <>
      {/* Banner */}
      <HomeBanner />

      {/* Main Client Section */}
      <HomeClient {...data} />

      {/* Bottom Section */}
      <TestimonialSection />
      <HomeIntroSection />
    </>
  );
}