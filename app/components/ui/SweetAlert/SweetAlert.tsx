"use client";

import Swal, { type SweetAlertIcon } from "sweetalert2";

type SweetAlertOptions = {
  title?: string;
  text?: string;
  icon?: SweetAlertIcon;
  confirmButtonText?: string;
};

const defaultSuccessOptions: Required<SweetAlertOptions> = {
  title: "ส่งข้อมูลสำเร็จ",
  text: "บันทึกข้อมูลเรียบร้อย",
  icon: "success",
  confirmButtonText: "ตกลง",
};

export const showSweetAlert = ({
  title = defaultSuccessOptions.title,
  text = defaultSuccessOptions.text,
  icon = defaultSuccessOptions.icon,
  confirmButtonText = defaultSuccessOptions.confirmButtonText,
}: SweetAlertOptions = {}) =>
  Swal.fire({
    title,
    text,
    icon,
    confirmButtonText,
    confirmButtonColor: "#1C3563",
    buttonsStyling: true,
  });

export const showSuccessAlert = (options?: SweetAlertOptions) =>
  showSweetAlert({
    ...defaultSuccessOptions,
    ...options,
    icon: "success",
  });
