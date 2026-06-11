import { FormConctactDataErrors, FormContactData, FormLoanData, FormLoanDataErrors } from "./type";

export const validateForm = (formData: any, services: any[] = []) => {
  const errors: any = {};

  /* ======================================================
     REGEX
  ====================================================== */
  const nameRegex = /^[ก-๙\s]+$/;
  const numberOnly = /^\d+$/;
  const phoneRegex = /^\d{10}$/;

  /* ======================================================
     CLEAN
  ====================================================== */
  const clean = (val: any) => (val ? String(val).trim() : "");

  /* ======================================================
     🔥 CONTEXT
  ====================================================== */
  const isLoanForm = services.length > 0;
  const isContactForm = !isLoanForm;

  /* ======================================================
     1. เคยใช้บริการ (เฉพาะ loan)
  ====================================================== */
  if (isLoanForm && !formData.isCustomer) {
    errors.isCustomer = "*กรุณาระบุว่าเคยเป็นลูกค้าศักดิ์สยามหรือไม่";
  }

  /* ======================================================
     2. ประเภท (สินเชื่อ / หัวข้อ)
  ====================================================== */
  if (!formData.loanType) {
    errors.loanType = isLoanForm
      ? "*กรุณาเลือกสินเชื่อที่ต้องการสมัคร"
      : "*กรุณาเลือกหัวข้อ";
  }

  /* ======================================================
     🔥 หา service (เฉพาะ loan)
  ====================================================== */
  let selectedService: any = null;

  if (isLoanForm) {
    selectedService = services.find(
      (s: any) => Number(s.id) === Number(formData.loanType)
    );
  }

  /* ======================================================
     3. วงเงิน (เฉพาะ loan)
  ====================================================== */
  if (isLoanForm) {
    const amountRaw = clean(formData.amount).replace(/,/g, "");
    const amount = amountRaw;

    if (!amount) {
      errors.amount = "*กรุณาระบุวงเงินที่ต้องการ";
    } else if (!numberOnly.test(amount)) {
      errors.amount = "*กรอกได้เฉพาะตัวเลขเท่านั้น";
    } else {
      const num = Number(amount);

      if (Number.isNaN(num) || num <= 0) {
        errors.amount = "*กรุณากรอกวงเงินให้ถูกต้อง";
      }

      if (selectedService) {
        if (num < selectedService.minAmount) {
          errors.amount = `*วงเงินต้องไม่น้อยกว่า ${selectedService.minAmount.toLocaleString()} บาท`;
        }

        if (num > selectedService.maxAmount) {
          errors.amount = `*วงเงินต้องไม่เกิน ${selectedService.maxAmount.toLocaleString()} บาท`;
        }
      }
    }
  }

  /* ======================================================
     4. ชื่อ - นามสกุล
  ====================================================== */
  const fullname = clean(formData.fullname || formData.name);

  if (!fullname) {
    errors.fullname = "*กรุณากรอกชื่อและนามสกุล";
  } else if (!nameRegex.test(fullname)) {
    errors.fullname =
      "*กรอกได้เฉพาะภาษาไทย และห้ามมีตัวเลขหรืออักขระพิเศษ";
  }

  /* ======================================================
     5. เบอร์โทร
  ====================================================== */
  const phone = clean(formData.phone);

  if (!phone) {
    errors.phone = "*กรุณากรอกหมายเลขโทรศัพท์";
  } else if (!phoneRegex.test(phone)) {
    errors.phone = "*กรุณากรอกเบอร์โทรให้ถูกต้อง";
  }

  /* ======================================================
     6. ที่อยู่ (เฉพาะ loan)
  ====================================================== */
  if (isLoanForm) {
    const address = clean(formData.address || formData.query);

    if (!address) {
      errors.address = "*กรุณาระบุที่อยู่";
    }
  }

  /* ======================================================
     7. เวลา (เฉพาะ loan)
  ====================================================== */
  if (isLoanForm && !formData.contactTime) {
    errors.contactTime = "*กรุณาเลือกช่วงเวลาที่สะดวกให้ติดต่อกลับ";
  }

  /* ======================================================
     8. ข้อความ (เฉพาะ contact)
  ====================================================== */
  if (isContactForm) {
    const message = clean(formData.message);

    if (!message) {
      errors.message = "*กรุณากรอกข้อความ";
    }
  }

  return errors;
};

//Loan
export const validataLoanForm = (
  formData: FormLoanData
): FormLoanDataErrors => {

  const errors: FormLoanDataErrors = {}
  // ลูกค้าเดิม / ใหม่
  if (formData.isCuntomer === null) {
    errors.isCuntomer =
      'กรุณาระบุว่าเคยเป็นลูกค้าศักดิ์สยามหรือไม่'
  }
  // สินเชื่อ
  if (!formData.selectedLoan) {
    errors.selectedLoan = 'กรุณาเลือกสินเชื่อที่ต้องการสมัคร'
  }
  // ✅ typeCar เช็คเฉพาะตอนที่ selectedLoan มีค่า typeCar
  if (
    formData.selectedLoan?.vehicleType &&
    !formData.typeCar
  ) {
    errors.typeCar = 'กรุณาเลือกประเภทรถ'
  }
  // วงเงิน
  if (!formData.amount) {
    errors.amount =
      'กรุณากรอกจำนวนวงเงินที่ต้องการ'
  }

  // ✅ เช็ค min/max วงเงิน
  else if (formData.selectedLoan) {

    const amount = Number(
      formData.amount.replace(/,/g, "")
    );

    // กรอกไม่ใช่ตัวเลข
    if (isNaN(amount)) {
      errors.amount =
        'กรุณากรอกวงเงินเป็นตัวเลข';
    }

    else {

      const minAmount = Number(
        formData.selectedLoan.minamount
      );

      const maxAmount = Number(
        formData.selectedLoan.maxamount
      );

      // ต่ำกว่าขั้นต่ำ
      if (amount < minAmount) {
        errors.amount =
          `กรุณากรอกวงเงินตั้งแต่ ${minAmount.toLocaleString()} บาท`;
      }

      // สูงกว่าขั้นสูงสุด
      else if (amount > maxAmount) {
        errors.amount =
          `กรุณากรอกวงเงินไม่เกิน ${maxAmount.toLocaleString()} บาท`;
      }
    }
  }
  // เวลาที่สะดวก
  if (!formData.selectedtime) {
    errors.selectedtime = 'กรุณาเลือกช่วงเวลาที่สะดวก'
  }
  // ชื่อ
  if (!formData.fullname) {
    errors.fullname = 'กรุณากรอกชื่อ-นามสกุล'
  }

  // เบอร์โทร
  // เบอร์โทร
  if (!formData.phone) {
    errors.phone =
      'กรุณากรอกหมายเลขโทรศัพท์'
  }

  // ต้องเป็นตัวเลขเท่านั้น
  else if (!/^[0-9]+$/.test(formData.phone)) {
    errors.phone =
      'กรุณากรอกเฉพาะตัวเลข';
  }

  // ต้อง 10 หลัก
  else if (formData.phone.length !== 10) {
    errors.phone =
      'กรอกหมายเลข 10 หลัก';
  }
  // -------------------------------------------------------------------
  // ✅ ไม่เช็คบ้านเลขที่แล้ว
  // -------------------------------------------------------------------
if (!formData.province) {
  errors.province = '*กรุณาเลือกจังหวัด'
}

if (!formData.amphoe) {
  errors.amphoe = '*กรุณาเลือกอำเภอ'
}

if (!formData.district) {
  errors.district = '*กรุณาเลือกตำบล'
}

if (
  !formData.province ||
  !formData.amphoe ||
  !formData.district
) {
  errors.address = '*กรุณากรอกที่อยู่'
}

  return errors
}


//Contact
export const validataContactForm = (formData: FormContactData): FormConctactDataErrors => {
  const errors: FormConctactDataErrors = {}
  // ชื่อ
  if (!formData.fullname) {
    errors.fullname = 'กรุณากรอกชื่อ-นามสกุล'
  }

  // เบอร์โทร
  // เบอร์โทร
  if (!formData.phone) {
    errors.phone =
      'กรุณากรอกหมายเลขโทรศัพท์'
  }

  // ต้องเป็นตัวเลขเท่านั้น
  else if (!/^[0-9]+$/.test(formData.phone)) {
    errors.phone =
      'กรุณากรอกเฉพาะตัวเลข';
  }

  // ต้อง 10 หลัก
  else if (formData.phone.length !== 10) {
    errors.phone =
      'กรอกหมายเลข 10 หลัก';
  }
  // topic
  if (!formData.selectedTopic) {
    errors.selectedTopic = 'กรุณาเลือกสินเชื่อที่ต้องการสมัคร'
  }

  if (!formData.detail) {
    errors.detail = 'กรุณากรอกระบุข้อความ'
  }
  return errors
} 

