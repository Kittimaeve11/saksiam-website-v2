/* ======================================================
   TYPE
====================================================== */
type Service = {
  id: number;
  titleTH: string;
  titleENG: string;
  image: string;
  descriptionTH: string;
  descriptionENG: string;

  minAmount: number;   
  maxAmount: number;  
};

/* ======================================================
   API
====================================================== */
export async function GET() {
  const services: Service[] = [
    {
      id: 1,
      titleTH: "สินเชื่อทะเบียนรถเป็นประกัน",
      titleENG: "Car Title Loan",
      image: "/Service/Service1.png",
      descriptionTH: "ใช้รถค้ำ อนุมัติไว ไม่ต้องโอนเล่ม",
      descriptionENG: "Fast approval, no transfer needed",
      minAmount: 3000,
      maxAmount: 400000
    },
    {
      id: 2,
      titleTH: "สินเชื่อรถจักรยานยนต์ใหม่",
      titleENG: "New Motorcycle Loan",
      image: "/Service/Service2.png",
      descriptionTH: "ออกรถใหม่ง่าย ผ่อนสบาย ดอกเบี้ยคุ้มค่า",
      descriptionENG: "Easy approval for new motorcycles",
      minAmount: 10000,
      maxAmount: 500000
    },
    {
      id: 3,
      titleTH: "สินเชื่อรถแลกเงิน (สินเชื่อเช่าซื้อ)",
      titleENG: "Car Refinance Loan",
      image: "/Service/Service3.png",
      descriptionTH: "เปลี่ยนรถเป็นเงินสด เพิ่มสภาพคล่องทันที",
      descriptionENG: "Turn your car into cash instantly",
      minAmount: 10000,
      maxAmount: 500000
    },
    {
      id: 4,
      titleTH: "สินเชื่อทะเบียนรถ (เพื่อการลงทุน)",
      titleENG: "Investment Car Loan",
      image: "/Service/Service8.png",
      descriptionTH: "เพิ่มทุนธุรกิจ ด้วยวงเงินจากรถของคุณ",
      descriptionENG: "Boost your business with your car",
      minAmount: 3000,
      maxAmount: 400000
    },
    {
      id: 5,
      titleTH: "สินเชื่อรายย่อยเพื่อการประกอบอาชีพ (นาโนไฟแนนซ์)",
      titleENG: "Nano Finance Loan",
      image: "/Service/Service4.png",
      descriptionTH: "สำหรับผู้ประกอบอาชีพอิสระ เข้าถึงง่าย",
      descriptionENG: "For freelancers and small business owners",
      minAmount: 5000,
      maxAmount: 100000
    },
    {
      id: 6,
      titleTH: "สินเชื่อส่วนบุคคล",
      titleENG: "Personal Loan",
      image: "/Service/Service5.png",
      descriptionTH: "เงินก้อนเพื่อทุกความต้องการ อนุมัติไว",
      descriptionENG: "Flexible loan for your needs",
      minAmount: 5000,
      maxAmount: 100000
    },
    {
      id: 7,
      titleTH: "สินเช่าที่ดินเป็นประกัน",
      titleENG: "Land Mortgage Loan",
      image: "/Service/Service7.png",
      descriptionTH: "ใช้ที่ดินเป็นหลักทรัพย์ วงเงินสูง",
      descriptionENG: "Use land as collateral for higher limits",
      minAmount: 5000,
      maxAmount: 300000
    },
    {
      id: 8,
      titleTH: "สินเชื่อโซลาร์รูฟท็อป",
      titleENG: "Solar Rooftop Loan",
      image: "/Service/Service6.png",
      descriptionTH: "ติดตั้งโซลาร์ ลดค่าไฟ ผ่อนสบาย",
      descriptionENG: "Install solar panels and save costs",
      minAmount: 10000,
      maxAmount: 1000000
    },

  ];

  return Response.json({ services });
}