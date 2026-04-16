import { NextResponse } from "next/server";

export async function GET() {
  const data = [
    {
      id: 1,
      category: "loan",
      questionTH: "สินเชื่อศักดิ์สยาม คิดอัตราดอกเบี้ยเท่าไหร่ครับ",
      questionEN: "What is the interest rate for Saksiam loans?",
      answerTH:
        "ไม่เกิน 1.25%/เดือน แล้วแต่ประเภทของสินเชื่อและเงื่อนไขที่บริษัทกำหนด",
      answerEN:
        "Not exceeding 1.25% per month, depending on loan type and company conditions.",
    },
    {
      id: 2,
      category: "loan",
      questionTH: "จะทำสินเชื่อ ต้องเตรียมเอกสารอะไรไปบ้างครับ",
      questionEN: "What documents are required to apply for a loan?",
      answerTH:
        "ให้ท่านนำบัตรประชาชน ทะเบียนบ้านติดตัวมาด้วย ถ้าจะขอสินเชื่อทะเบียนรถ ให้นำรถและเล่มทะเบียนรถมาด้วย ถ้าเป็นสินเชื่อส่วนบุคคล ให้นำเอกสารแสดงรายได้มาด้วยครับ",
      answerEN:
        "Please bring your ID card and house registration. For vehicle loans, bring your vehicle and registration book. For personal loans, provide proof of income.",
    },
    {
      id: 3,
      category: "loan",
      questionTH: "สินเชื่อศักดิ์สยาม ให้บริการอะไรครับ",
      questionEN: "What services does Saksiam provide?",
      answerTH: `ให้บริการทางด้านสินเชื่อ ทั้งหมด 9 ประเภท ได้แก่
1. สินเชื่อทะเบียนรถเป็นประกัน
2. สินเชื่อรถจักรยานยนต์ใหม่
3. สินเชื่อเช่าซื้อ
4. สินเชื่อทะเบียนรถ (เพื่อการลงทุน)
5. สินเชื่อรายย่อยเพื่อการประกอบอาชีพ (นาโนไฟแนนซ์)
6. สินเชื่อส่วนบุคคล
7. สินเชื่อที่มีที่ดินเป็นประกัน
8. สินเชื่อโดรนเกษตร (สินเชื่อเช่าซื้อ)
9. สินเชื่อโซลาร์รูฟท็อป`,
      answerEN: `We provide 9 types of loan services:
1. Vehicle title loan
2. New motorcycle loan
3. Hire purchase loan
4. Investment vehicle loan
5. Nano finance loan
6. Personal loan
7. Land-secured loan
8. Agricultural drone loan
9. Solar rooftop loan`,
    },
    {
      id: 4,
      category: "loan",
      questionTH: "สินเชื่อทะเบียนรถ รออนุมัติภายในกี่วันครับ",
      questionEN: "How long does approval take for vehicle title loans?",
      answerTH:
        "โดยปกติถ้าเอกสารพร้อม หลักทรัพย์ค้ำประกันพร้อม ไม่เกิน 1 วันครับ",
      answerEN:
        "Normally within 1 day if all documents and collateral are complete.",
    },
    {
      id: 5,
      category: "contact",
      questionTH: "บริษัท เปิดทำการวันไหนบ้างค่ะ",
      questionEN: "What are the company's operating days?",
      answerTH:
        "บริษัทเปิดทำการวันจันทร์ - ศุกร์ ตั้งแต่เวลา 8.00 น. - 16.30 น.",
      answerEN:
        "Open Monday to Friday from 8:00 AM to 4:30 PM.",
    },
    {
      id: 6,
      category: "contact",
      questionTH: "สินเชื่อศักดิ์สยาม ติดต่อได้ทางไหนบ้างคะ",
      questionEN: "How can I contact Saksiam?",
      answerTH: `สามารถติดต่อสินเชื่อศักดิ์สยามได้จากช่องทางดังนี้
1. ติดต่อได้ทุกสาขาใกล้บ้าน
2. โทร 1487
3. Facebook "ศักดิ์สยามลิสซิ่ง"
4. เว็บไซต์ "สินเชื่อศักดิ์สยาม"`,
      answerEN: `You can contact us via:
1. Any nearby branch
2. Call 1487
3. Facebook "Saksiam Leasing"
4. Website "Saksiam Loan"`,
    },
    {
      id: 7,
      category: "contact",
      questionTH:
        "ต้องการแจ้งเรื่องร้องเรียนเกี่ยวกับการให้บริการ สามารถแจ้งได้ที่ไหนบ้างค่ะ",
      questionEN:
        "Where can I file a complaint about the service?",
      answerTH: `สามารถแจ้งผ่านช่องทางดังนี้
1. ทุกสาขาใกล้บ้าน
2. โทร 1487
3. Facebook "ศักดิ์สยามลิสซิ่ง"
4. เว็บไซต์ "สินเชื่อศักดิ์สยาม"`,
      answerEN: `You can submit complaints via:
1. Any branch
2. Call 1487
3. Facebook "Saksiam Leasing"
4. Website "Saksiam Loan"`,
    },
  ];

  return NextResponse.json({ faq: data });
}