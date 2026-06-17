import { apiFetch } from "../client";
import { buildImageUrl } from "@/app/Utils/imageUrl";

type RawContactApiData = {
  company_name?: {
    th?: string;
    en?: string;
  };
  address?: {
    th?: string;
    en?: string;
  };
  office_hours?: {
    th?: string;
    en?: string;
  };
  contact?: {
    callcenter?: string;
    fax?: string;
    contactpersonal?: string;
    email_main?: string;
    email_sub?: string;
  };
  company_info?: {
    established?: string;
    branches?: string;
    employees?: string;
  };
  location?: {
    lat?: string;
    lng?: string;
  };
  social?: {
    facebook?: string;
    line?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
  };
  images?: {
    cover?: string;
    qr_line?: string;
    register?: string;
    regiter?: string;
  };
};

const toText = (value: string | number | null | undefined): string => {
  if (typeof value === "number") return String(value);
  return typeof value === "string" ? value.trim() : "";
};

const normalizeContact = (data: RawContactApiData = {}) => {
  const email = [
    toText(data.contact?.email_main),
    toText(data.contact?.email_sub),
  ].filter(Boolean);

  const companyTH = toText(data.company_name?.th);
  const companyEN = toText(data.company_name?.en);
  const addressTH = toText(data.address?.th);
  const addressEN = toText(data.address?.en);
  const callCenter = toText(data.contact?.callcenter);
  const fax = toText(data.contact?.fax);
  const register = toText(data.images?.register || data.images?.regiter);

  return {
    companyTH,
    companyEN,
    addressTH,
    addressEN,
    fax,
    callCenter,
    email,
    social: {
      facebook: toText(data.social?.facebook),
      line: toText(data.social?.line),
      instagram: toText(data.social?.instagram),
      youtube: toText(data.social?.youtube),
      tiktok: toText(data.social?.tiktok),
    },
    company_name: {
      th: companyTH,
      en: companyEN,
    },
    address: {
      th: addressTH,
      en: addressEN,
    },
    office_hours: {
      th: toText(data.office_hours?.th),
      en: toText(data.office_hours?.en),
    },
    contact: {
      callcenter: callCenter,
      fax,
      contactpersonal: toText(data.contact?.contactpersonal),
      email_main: email[0] || "",
      email_sub: email[1] || "",
    },
    company_info: {
      established: toText(data.company_info?.established),
      branches: toText(data.company_info?.branches),
      employees: toText(data.company_info?.employees),
    },
    location: {
      lat: toText(data.location?.lat),
      lng: toText(data.location?.lng),
    },
    images: {
      cover: buildImageUrl(toText(data.images?.cover)),
      qr_line: "/Social/Qrcode-Line.png",
      register: buildImageUrl(register),
    },
  };
};

export async function GET() {
  try {
    const response = await apiFetch<RawContactApiData>("/api/contactapi");

    if (response.status === false) {
      throw new Error(response.message || "Contact API error");
    }

    return Response.json(normalizeContact(response.data || response.result || {}));
  } catch (error) {
    console.error("Contact API error:", error);
    return Response.json(normalizeContact(), { status: 502 });
  }
}
