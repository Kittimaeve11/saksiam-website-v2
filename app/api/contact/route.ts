/* ======================================================
   CONTACT API (GET ONLY)
====================================================== */

export async function GET() {
  return Response.json({
    companyTH: "บริษัท ศักดิ์สยามลิสซิ่ง จำกัด (มหาชน) สำนักงานใหญ่",
    companyEN: "SAKSIAM LEASING PUBLIC COMPANY LIMITED",

    addressTH: "49/47 ถ.เจษฎาบดินทร์ ต.ท่าอิฐ อ.เมืองอุตรดิตถ์ จ.อุตรดิตถ์ 53000",
    addressEN: "",

    fax: "055 440 371",
    callCenter: "1487",

    email: [
      "saksiam@saksiam.co.th",
      "secretary.s@saksiam.co.th",
    ],

    social: {
      facebook: "https://www.facebook.com/saksiamofficial",
      line: "https://page.line.me/wbu5287w?openQrModal=true",
      youtube: "https://www.youtube.com/channel/UCSkTr6d-9ElKUzjQIRKUxIA",
      instagram: "https://www.instagram.com/saksiamofficial?igsh=Z3M1dmRtcTJ1MW1w",
      tiktok: "https://www.tiktok.com/@saksiamofficial?_r=1&_t=ZS-951p3IhQ28m",
    },
  });
}