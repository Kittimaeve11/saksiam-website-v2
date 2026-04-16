import { NextResponse } from "next/server";

/* ================= TYPE ================= */
type Testimonial = {
  id: number;
  title: string;
  videoUrl: string;
  videoId: string;
  publishedAt: string;
};

/* ================= MOCK DATA ================= */
const testimonials: Testimonial[] = [
  {
    id: 1,
    title: "ไกลแค่ไหนเราก็ไปถึง",
    videoUrl: "https://www.youtube.com/embed/lnHi0dOW0jw",
    videoId: "lnHi0dOW0jw",
    publishedAt: "2020-10-15",
  },
  {
    id: 2,
    title: "สินเชื่อศักดิ์สยาม สนับสนุนการลงทุนทุกกลุ่มอาชีพ (EP.1)",
    videoUrl: "https://www.youtube.com/embed/ysEAazXFY9k",
    videoId: "ysEAazXFY9k",
    publishedAt: "2020-07-28",
  },
  {
    id: 3,
    title: "ศักดิ์สยาม เคียงข้างในทุกโอกาสของชีวิต",
    videoUrl: "https://www.youtube.com/embed/lnQM_nytNC4",
    videoId: "lnQM_nytNC4",
    publishedAt: "2021-05-10",
  },
];

/* ================= GET ================= */
export async function GET() {
  return NextResponse.json({
    success: true,
    data: testimonials,
  });
}