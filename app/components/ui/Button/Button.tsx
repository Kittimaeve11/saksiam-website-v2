
"use client";


import React from "react";

/* ======================================================
   TYPE : BUTTON PROPS
   ======================================================
   กำหนดประเภทของ props ที่ปุ่มสามารถรับได้
*/
interface ButtonProps {

  children: React.ReactNode;
  // เนื้อหาที่อยู่ภายในปุ่ม เช่น ข้อความ หรือ icon

  variant?: 
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "processing"
    | "error"
    | "info";
  // ประเภทของปุ่ม (กำหนดสีตาม Design System)

  disabled?: boolean;
  // ใช้กำหนดว่าปุ่มกดได้หรือไม่

  onClick?: () => void;
  // ฟังก์ชันที่ทำงานเมื่อคลิกปุ่ม
}


/* ======================================================
   COMPONENT : BUTTON
   ======================================================
   ปุ่มกลางของระบบ (Reusable Component)
   ใช้แทน <button> ปกติในทั้งเว็บ
*/
export default function Button({

  children,
  variant = "primary",
  // ค่า default ของปุ่มคือ primary

  disabled = false,
  // ค่า default ปุ่มกดได้

  onClick

}: ButtonProps) {


  /* ======================================================
     BASE STYLE
     ======================================================
     style พื้นฐานที่ใช้กับปุ่มทุกประเภท
  */
  const base =
    "px-4 py-2 rounded-lg font-medium transition duration-200";


  /* ======================================================
     VARIANT STYLE
     ======================================================
     style ของแต่ละประเภทปุ่ม
     อิงตาม Design System Colors
  */
  const variants = {

    primary:
      "bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white",
      // ปุ่มหลักของเว็บ

    secondary:
      "bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)] text-black",
      // ปุ่มรองของเว็บ

    success:
      "bg-[var(--color-success)] hover:bg-[var(--color-success-hover)] text-white",
      // ปุ่มบันทึก

    warning:
      "bg-[var(--color-warning)] hover:bg-[var(--color-warning-hover)] text-black",
      // ปุ่มคำเตือน แก้ไข

    processing:
      "bg-[var(--color-processing)] hover:bg-[var(--color-processing-hover)] text-white",
      // สถานะกำลังดำเนินการ

    error:
      "bg-[var(--color-error)] hover:bg-[var(--color-error-hover)] text-white",
      // ปุ่มอันตราย  ลบข้อมูล

    info:
      "bg-[var(--color-info)] hover:bg-[var(--color-info-hover)] text-white"
      // ปุ่มข้อมูลทั่วไป
  };


  /* ======================================================
     DISABLED STYLE
     ======================================================
     style ของปุ่มเมื่อไม่สามารถกดได้
  */
  const disabledStyle =
    "bg-gray-200 text-gray-400 cursor-not-allowed";


  /* ======================================================
     RENDER BUTTON
     ======================================================
  */
  return (

    <button
      onClick={onClick}
      disabled={disabled}

      className={`${base} ${
        disabled
          ? disabledStyle
          : variants[variant]
      }`}
      // ถ้าปุ่ม disabled จะใช้ style disabled
      // ถ้าไม่ disabled จะใช้ style ตาม variant
    >

      {children}
      {/* เนื้อหาที่อยู่ภายในปุ่ม */}

    </button>

  );
}

