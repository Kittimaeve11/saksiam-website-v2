// -------------------------------------------
// ----------------- Model -------------------
// -------------------------------------------
export interface ComponentsRadioModelProps {
  name: string;
  titlename1: string;
  titlename2: string;
  subject: number | null;
  setsubject: (
    value: number | null
  ) => void;
  topon: number;
  handleFieldChange: (
    fieldName: string,
    value: unknown
  ) => void;
  error: string | undefined;
  fieldKey: string;
  specify: boolean;
}
export interface ComponentsTextModelProps {
  name: string;
  titlename: string;
  subject: string;
  setsubject: (value: string) => void;
  topon: number
  handleFieldChange: (fieldName: string, value: unknown) => void
  error: string | undefined
  row?: number
  fieldKey: string
  specify: boolean
}


export interface BasicDropDownSeleteProps {
  id: number;
  name: string;
}
export interface BasicDropDownSeleteLoanProps {
  id: number;
  name: string;
  nameTH?: string;
  nameEN?: string;
  titleTH?: string;
  titleEN?: string;
  vehicleType?: string;
  minamount: string;
  maxamount: string;
}
export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}
export interface ApplicationResponse {
  customer_id: number;
}

// -------------------------------------------
// ------------------ Form -------------------
// -------------------------------------------

// -------------------------------------------
// --------------- Loan Form -----------------
// -------------------------------------------
export interface FormLoanData {
  isCuntomer: number | null
  selectedLoan: BasicDropDownSeleteLoanProps | null
  typeCar: string | null
  amount: string
  selectedtime: string | null
  fullname: string
  phone: string
  address: string | null
  district: string | null
  amphoe: string | null;
  province: string | null
  zipcode: string
  tambonsID: number | null
}
// -------------------------------------------
// -------------- Contact Form ---------------
// -------------------------------------------
export interface FormContactData {
  fullname: string
  email: string
  phone: string
  selectedTopic: string | number | null
  detail: string
}
// -------------------------------------------
// ------------- Form Errors -----------------
// -------------------------------------------


// -------------------------------------------
// ---------- Loan Form Errors ---------------
// -------------------------------------------
export interface FormLoanDataErrors {
  isCuntomer?: string
  selectedLoan?: string
  typeCar?: string
  amount?: string
  selectedtime?: string
  fullname?: string
  phone?: string
  address?: string
  district?: string
  amphoe?: string
  province?: string
  zipcode?: string
  tambonsID?: string
  [key: string]: string | undefined
}

// -------------------------------------------
// -------- Contact Form Errors --------------
// -------------------------------------------
export interface FormConctactDataErrors {
  fullname?: string
  email?: string
  phone?: string
  selectedTopic?: string
  detail?: string
  [key: string]: string | undefined
}
// -------------------------------------------
// ------------------ Show -------------------
// -------------------------------------------

// -------------------------------------------
// ---------------- Banner -------------------
// -------------------------------------------
export interface bannerData {
  id: number
  name: string
  picturePC: string
  pictureMoblie: string
  link: string
}

export type BannerApiItem = {
  id: string;
  name: string;
  picturePC: string;
  pictureMoblie: string;
  link: string;
  active: string;
};

// -------------------------------------------
// ------------------ News -------------------
// -------------------------------------------
export type NewsApiItem = {
  editoriaNum: string;
  typeID: string;
  typeNameTH: string;
  typeNameEN: string;
  titleTH: string;
  titleEN: string;
  descriptionTH: string;
  descriptionEN: string;
  gallery: string[];
  pin: string;
  active: string;
  createname: string;
  createAt: string;
  updateAt: string | null;
  approvedate: string;
  approvename: string;
  note: string;
  rejectReason: string;
  reason: string;
  improvement: string;
  improvement_text: string;
  improvementText: string;
  cancellation: string;
};

export type HomeNewsItem = {
  id: string | number;
  categoryTH: string;
  categoryEN: string;
  titleTH: string;
  titleEN: string;
  detailTH: string;
  detailEN: string;
  createdAt: string;
  images: string[];
  views?: number;
};

  export type News = {
  id: string | number;
  categoryTH: string;
  categoryEN: string;
  titleTH: string;
  titleEN: string;
  detailTH: string;
  detailEN: string;
  createdAt: string;
  images: string[];
};

export type EditorialType = {
  id: string;
  nameTH: string;
  nameEN: string;
};



export type EditorialTypeApiItem = {
  id: string;
  editorialtypeID: string;
  typeeditoriaID: string;
  nameTH: string;
  nameEN: string;
  editorialtypenameTH: string;
  editorialtypenameEN: string;
  active: string;
  savename: string;
  createAt: string;
  updateAt: string | null;
  editorialtypeorder: string | null;
  typeeditoriaorder: string | null;
};

export type TestimonialApiItem = {
  id: string;
  title: string;
  link: string;
  youtubeID: string;
};

export type TestimonialItem = {
  id: number;
  title: string;
  videoUrl: string;
  videoId: string;
};

export type TestimonialApiData = {
  data: TestimonialApiItem[];
  total_count: number;
};

// -------------------------------------------
// ------------------ FAQ --------------------
// -------------------------------------------
export type FaqItem = {
  id: string;
  faqtypeID: string;
  typeID: string;
  faqtypeNameTH: string;
  faqtypeNameEN: string;
  typeNameTH: string;
  typeNameEN: string;
  questionTH: string;
  questionEN: string;
  answersTH: string;
  answersEN: string;
  active: string;
  savename: string;
  createAt: string;
  updateAt: string | null;
  fqaorder: string | null;
};

export type FaqTypeItem = {
  id: string;
  faqtypeID: string;
  typefaqID: string;
  nameTH: string;
  nameEN: string;
  faqtypenameTH: string;
  faqtypenameEN: string;
  active: string;
  savename: string;
  createAt: string;
  updateAt: string | null;
  faqtypeorder: string | null;
  typefaqorder: string | null;
};


export type FaqApiItem = {
  id: string;
  faqtypeID: string;
  typeID: string;
  faqtypeNameTH: string;
  faqtypeNameEN: string;
  typeNameTH: string;
  typeNameEN: string;
  questionTH: string;
  questionEN: string;
  answersTH: string;
  answersEN: string;
  active: string;
  savename: string;
  createAt: string;
  updateAt: string | null;
  fqaorder: string | null;
};

export type FaqTypeApiItem = {
  id: string;
  faqtypeID: string;
  typefaqID: string;
  nameTH: string;
  nameEN: string;
  faqtypenameTH: string;
  faqtypenameEN: string;
  active: string;
  savename: string;
  createAt: string;
  updateAt: string | null;
  faqtypeorder: string | null;
  typefaqorder: string | null;
};


// -------------------------------------------
// ------------------ Team -------------------
// -------------------------------------------
export type DirectorApiItem = {
  id: string;
  picture: string;
  nameTH: string;
  nameEN: string;
  positionTH: string;
  positionEN: string;
  active: string;
  createAt: string;
  savename: string;
  tag: string;
  updateAt: string | null;
  updatename: string | null;
  changetime: string | null;
  changename: string | null;
  order: string | null;
};

// -------------------------------------------
// ------------ About Menu Banner ------------
// -------------------------------------------
export type AboutMenuBannerItem = {
  id: string;
  name: string;
  picturePC: string;
  pictureMoblie: string;
  type: string;
  link: string;
  active: string;
  createAt: string;
  savename: string;
  updateAt: string | null;
};

// -------------------------------------------
// ---------------- Mission ------------------
// -------------------------------------------
export type MissionApiItem = {
  mission_ID: string;
  titleTH: string;
  titleEN: string;
  topicTH: string;
  topicEN: string;
  picture: string;
};

export type MissionItem = {
  id: string;
  titleTH: string;
  titleEN: string;
  detailTH: string;
  detailEN: string;
  image: string;
};
// -------------------------------------------
// ------------------ Loan -------------------
// -------------------------------------------
export interface loanDetail {
  id: number
  nameTH: string
  nameEN: string
  imagelarge: string
  imagesmall: string
  highlight: string
  qualifications: string
  vehicleType: string
  isopen: string
  documens: string
  dose: string
  minamount: string
  maxamount: string
  detail: string
}
export interface loanItem {
  id: number
  nameTH: string
  nameEN: string
  imagelarge: string
  vehicleType: string
  minamount: string
  maxamount: string
  detail: string
}

// -------------------------------------------
// ---------------- History ------------------
// -------------------------------------------
export interface HistorySection {
  title_th: string
  title_en: string
  description_th: string
  description_en: string
  images?: string
}

export interface HistoryEra {
  era_th: string
  era_en: string
  sections: HistorySection[]
}

export interface HistoryData {
  hero: {
    subheadline_th: string
    subheadline_en: string
  }

  philosophy: {
    title_th: string
    title_en: string
    quote_th: string
    quote_en: string
    description_th: string
    description_en: string
  }

  introduction: {
    title_th: string
    title_en: string
    description_th: string
    description_en: string
  }

  eras: HistoryEra[]
}


// -------------------------------------------
// ------------------ Map --------------------
// -------------------------------------------
export interface branchlocationsItem {
  id: string;
  type: number;
  name: string;
  detail: string;
  lat: number;
  lng: number;
  distance: string | null;
  address: string;
  districtname: string;
  amphurname: string;
  provincename: string;
  zipcode: string;
  tel: string;
}

// -------------------------------------------
// ---------------- Contact ------------------
// -------------------------------------------
export interface ContactData {
  callCenter: string;
  fax: string;
  email: string[];
  companyTH: string;
  companyEN: string;
  addressTH: string;
  addressEN: string;

  company_name: {
    th: string;
    en: string;
  };

  address: {
    th: string;
    en: string;
  };

  office_hours: {
    th: string;
    en: string;
  };

  contact: {
    callcenter: string;
    fax: string;
    contactpersonal: string;
    email_main: string;
    email_sub: string;
  };

  company_info: {
    established: string;
    branches: string;
    employees: string;
  };

  location: {
    lat: string;
    lng: string;
  };

  social: {
    facebook?: string;
    line?: string;
    youtube?: string;
    instagram?: string;
    tiktok?: string;
  };

  images: {
    cover: string;
    qr_line: string;
    register: string;
  };

}
export interface LoanApplicationResponse {
  application_id: number;
  customer_id?: number;
  ticket_id?: number;
  ticketNo?: string;
}
