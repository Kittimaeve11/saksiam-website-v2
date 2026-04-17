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