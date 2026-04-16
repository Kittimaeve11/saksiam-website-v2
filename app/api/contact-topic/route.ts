/* ======================================================
   CONTACT TOPIC API
====================================================== */

export async function GET() {
  return Response.json({
    topics: [
      {
        id: "general",
        label: "สอบถามข้อมูลทั่วไป",
      },
      {
        id: "job",
        label: "สอบถามข้อมูลสมัครงาน",
      },
      {
        id: "complaint",
        label: "แจ้งเรื่องร้องเรียน",
      },
      {
        id: "fraud",
        label: "แจ้งเบาะแสการทุจริตของพนักงาน",
      },
    ],
  });
}