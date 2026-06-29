// public/data/Address_Mannager
import provincesData from "./thai_provinces.json";
import amphuresData from "./thai_amphures.json";
import tambonsData from "./thai_tambons.json";

export interface Province {
  id: number;
  name_th: string;
  name_en: string;
  geography_id: number;
}

export interface Amphure {
  id: number;
  name_th: string;
  name_en: string;
  province_id: number;
}

export interface Tambon {
  id: number;
  name_th: string;
  name_en: string;
  zip_code: number;
  amphure_id: number;
}

export interface AddressItem {
  province: Province;
  amphure: Amphure;
  tambon: Tambon;
  zipcode: number;
  fullText: string;
}

const provinces: Province[] = provincesData;
const amphures: Amphure[] = amphuresData;
const tambons: Tambon[] = tambonsData;

// ⚡ ทำ cache map ให้ค้นหาเร็ว
const provinceMap = new Map(
  provinces.map((item) => [item.id, item])
);

const amphureMap = new Map(
  amphures.map((item) => [item.id, item])
);

export const addressList: AddressItem[] = tambons
  .map((tambon) => {
    const amphure = amphureMap.get(
      tambon.amphure_id
    );

    // ❌ ไม่มีอำเภอ
    if (!amphure) {
      return null;
    }

    const province = provinceMap.get(
      amphure.province_id
    );

    // ❌ ไม่มีจังหวัด
    if (!province) {
      return null;
    }

    return {
      province,
      amphure,
      tambon,

      zipcode: tambon.zip_code,

      fullText:
        `ต.${tambon.name_th} ` +
        `อ.${amphure.name_th} ` +
        `จ.${province.name_th} ` +
        `${tambon.zip_code}`,
    };
  })
  .filter(
    (item): item is AddressItem =>
      item !== null
  );
