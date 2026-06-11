// -------------------------------------------
// ----------------- Model --------------------
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
// ----------------- Form --------------------
// -------------------------------------------

//Loan
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
//Contact
export interface FormContactData {
  fullname: string
  email: string
  phone: string
  selectedTopic: string | number | null
  detail: string
}
// -------------------------------------------------------------------
// <-- error  -->
// -------------------------------------------------------------------


//Loan
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

//Contact
export interface FormConctactDataErrors {
  fullname?: string
  email?: string
  phone?: string
  selectedTopic?: string
  detail?: string
  [key: string]: string | undefined
}
// -------------------------------------------
// ----------------- Show --------------------
// -------------------------------------------
//
export interface bannerData {
  id: number
  name: string
  picturePC: string
  pictureMoblie: string
  link: string
}

export type BannerApiItem = {
  id?: number | string;
  int_saksiam_banner_ID?: number | string;
  picturePC?: string;
  int_saksiam_banner_picturePC?: string;
  pictureMoblie?: string;
  pictureMobile?: string;
  int_saksiam_banner_pictureMoblie?: string;
  link?: string;
  int_saksiam_banner_link?: string;
};

//News
export type NewsApiItem = {
  id?: string;
  editoriaID?: string;
  editoriaId?: string;
  editoriaNum?: string;
  int_saksiam_editoria_id?: string;
  typeNameTH?: string;
  typeNameEN?: string;
  categoryTH?: string;
  categoryEN?: string;
  titleTH?: string;
  titleEN?: string;
  int_saksiam_editoria_titieTH?: string;
  int_saksiam_editoria_titieEN?: string;
  descriptionTH?: string;
  descriptionEN?: string;
  int_saksiam_editoria_descriptionTH?: string;
  int_saksiam_editoria_descriptionEN?: string;
  approvedate?: string;
  createAt?: string;
  int_saksiam_editoria_approvedate?: string;
  galleryList?: string[] | string;
  gallaryList?: string[] | string;
  gallery?: string[] | string;
  gallary?: string[] | string;
  int_saksiam_editoria_gallary?: string[] | string;
};


export type TestimonialApiItem = {
  id?: number | string;
  vedioID?: number | string;
  videoID?: number | string;
  int_saksiam_vedio_id?: number | string;
  title?: string;
  nameTH?: string;
  vedio_nameTH?: string;
  int_saksiam_vedio_nameTH?: string;
  videoUrl?: string;
  link?: string;
  linkVedio?: string;
  vedio_link?: string;
  int_saksiam_vedio_link?: string;
  videoId?: string;
  youtubeID?: string;
  vedio_youtubeID?: string;
  int_saksiam_vedio_youtubeID?: string;
};
export type TestimonialApiData = {
  data?: TestimonialApiItem[];
  total_count?: number;
};

//Faq

export type FaqItem = {
  id: number;
  category: string;
  questionTH: string;
  questionEN: string;
  answerTH: string;
  answerEN: string;
};

export type FaqTypeItem = {
  id: string;
  nameTH: string;
  nameEN: string;
};


export type FaqApiItem = {
  id?: string | number;
  fqaID?: string | number;
  faqQuestionID?: string | number;
  int_saksiam_fqa_id?: string | number;
  faqtypeID?: string | number;
  typeID?: string | number;
  int_saksiam_fqa_type?: string | number;
  questionTH?: string;
  questionEN?: string;
  int_saksiam_fqa_questionTH?: string;
  int_saksiam_fqa_questionEN?: string;
  answerTH?: string;
  answerEN?: string;
  answersTH?: string;
  answersEN?: string;
  int_saksiam_fqa_answersTH?: string;
  int_saksiam_fqa_answersEN?: string;
};

export type FaqTypeApiItem = {
  id?: string | number;
  faqtypeID?: string | number;
  typeID?: string | number;
  int_saksiam_typefqa_id?: string | number;
  nameTH?: string;
  nameEN?: string;
  faqtypenameTH?: string;
  faqtypenameEN?: string;
  typeNameTH?: string;
  typeNameEN?: string;
  active?: boolean | number | string;
  faqtypeactive?: boolean | number | string;
  int_saksiam_typefqa_active?: boolean | number | string;
};


//Team
export type DirectorApiItem = {
  id?: string | number;
  nameTH?: string;
  nameEN?: string;
  positionTH?: string;
  positionEN?: string;
  picture?: string;
  tag?: string;
};

//AboutMenu
export type AboutMenuBannerItem = {
  id: number;
  name: string;
  picturePC: string;
  pictureMoblie: string;
};

//Mission
export type MissionApiItem = {
  id?: string | number;
  missionID?: string | number;
  mission_ID?: string | number;
  int_saksiam_mission_id?: string | number;
  titleTH?: string;
  titleEN?: string;
  topicTH?: string;
  topicEN?: string;
  nameTH?: string;
  nameEN?: string;
  mission_nameTH?: string;
  mission_nameEN?: string;
  detailTH?: string;
  detailEN?: string;
  descriptionTH?: string;
  descriptionEN?: string;
  mission_detailTH?: string;
  mission_detailEN?: string;
  image?: string;
  picture?: string;
  icon?: string;
  mission_picture?: string;
};

export type MissionItem = {
  id: string;
  titleTH: string;
  titleEN: string;
  detailTH: string;
  detailEN: string;
  image: string;
};
// Loan
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

//history
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


//map
export interface branchlocationsItem {
  id: string; // ✅ เปลี่ยน
  type: number;
  name: string;
  detail: string;
  lat: number;
  lng: number;
  distance: string | null; // ✅ เพราะ API เป็น null
  address: string;
  districtname: string;
  amphurname: string;
  provincename: string;
  zipcode: string;
  tel: string;
}

// contact
export interface ContactData {
  callCenter: string;
  fax: string;
  email: string[];

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
