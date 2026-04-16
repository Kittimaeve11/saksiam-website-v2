'use client';
// บอก Next.js ว่า component นี้ต้องทำงานฝั่ง Client
// เพราะ react-toastify ต้องใช้ DOM และ event ของ browser

import { ToastContainer } from 'react-toastify';
// import component หลักสำหรับแสดง Toast Notification

import 'react-toastify/dist/ReactToastify.css';
// import CSS ของ react-toastify เพื่อให้ toast แสดงผลสวยงาม

/* ======================================================
   ToastProvider
   Provider สำหรับแสดง Toast Notification ทั้งเว็บไซต์
====================================================== */

export default function ToastProvider() {
  return (
    <ToastContainer
      /* ======================================================
         ตำแหน่งของ Toast บนหน้าจอ
         top-center = อยู่ด้านบนตรงกลาง
      ====================================================== */
      position="top-center"

      /* ======================================================
         กำหนด Style ของ Toast แต่ละอัน
      ====================================================== */
      toastStyle={{
        margin: 'auto',        // จัด Toast ให้อยู่ตรงกลาง container
        minWidth: '300px',     // กำหนดความกว้างขั้นต่ำ
        textAlign: 'center',   // จัดข้อความให้อยู่ตรงกลาง
        fontWeight: 600,       // ทำตัวอักษรให้หนา
        fontSize: '1.1rem'     // ขนาดตัวอักษร
      }}

      /* ======================================================
         Style ของ Container ที่ครอบ Toast ทั้งหมด
      ====================================================== */
      style={{
        top: '50%',                         // ให้อยู่กึ่งกลางแนวตั้ง
        left: '50%',                        // ให้อยู่กึ่งกลางแนวนอน
        transform: 'translate(-50%, -50%)', // ปรับตำแหน่งให้ตรงกลางจริง
        position: 'fixed',                  // ให้ลอยอยู่เหนือ UI ทั้งหมด
        zIndex: 9999                        // ลำดับ layer สูงสุด กันโดน element อื่นบัง
      }}

      /* ======================================================
         Options ของ Toast
      ====================================================== */

      autoClose={3000}   // ปิดอัตโนมัติหลัง 3 วินาที
      newestOnTop        // Toast ใหม่จะแสดงด้านบน
      closeOnClick       // คลิกที่ Toast เพื่อปิดได้
      pauseOnHover       // หยุดเวลา autoClose เมื่อเอาเมาส์ไปชี้
      draggable          // สามารถลาก Toast เพื่อปิดได้
      theme="colored"    // ใช้ธีมสีของ react-toastify
    />
  );
}