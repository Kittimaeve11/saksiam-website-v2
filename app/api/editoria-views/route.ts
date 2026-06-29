import { NextResponse } from "next/server";
import { apiFetch } from "../client";
import {
  getEditorialViewMap,
  incrementEditorialViews,
} from "./store";
import { toText } from "@/app/Utils/imageUrl";

const toId = (value: unknown): string => {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return String(value);
  }

  if (typeof value === "string") {
    return value.trim();
  }

  return "";
};

const writeEditorialViewLog = async (payload: {
  id: string;
  num?: string;
  title?: string;
  typeID?: string;
  category?: string;
}) => {
  const dataID = payload.id || "0";
  const datatypeID = payload.typeID || "0";
  const dataname = payload.title || "-";
  const editoriaNum = payload.num || "-";

  try {
    await apiFetch("/api/logapi", {
      method: "POST",
      body: JSON.stringify({
        actionType: "3",
        actionDetail: `หน้าข่าวและกิจกรรม รหัสข่าว: ${dataID} หมายเลข: ${editoriaNum} ชื่อข่าว: ${dataname}`,
        typeUser: "ผู้เยี่ยมชมเว็บไซต์",
        datatype: payload.category || "ข่าวและกิจกรรม",
        dataID,
        datatypeID,
        brandtype: "0",
        dataname,
      }),
    });
  } catch (error) {
    console.error("Editorial view log error:", error);
  }
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams
    .get("ids")
    ?.split(",")
    .map((id) => toId(id))
    .filter(Boolean);

  if (ids?.length) {
    const store = await getEditorialViewMap();
    const views = ids.reduce<Record<string, number>>((result, id) => {
      result[String(id)] = store[String(id)] || 0;
      return result;
    }, {});

    return NextResponse.json({ views });
  }

  return NextResponse.json({ views: await getEditorialViewMap() });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = toId(body?.id);
    const num = toText(body?.num);
    const title = toText(body?.title || body?.titleTH || body?.titleEN);
    const typeID = toText(body?.typeID);
    const category = toText(body?.category || body?.categoryTH || body?.categoryEN);

    if (!id) {
      return NextResponse.json(
        { message: "Invalid editorial id" },
        { status: 400 }
      );
    }

    await writeEditorialViewLog({ id, num, title, typeID, category });
    const views = await incrementEditorialViews(id);

    return NextResponse.json({ id, views });
  } catch (error) {
    console.error("Increment editorial views error:", error);
    return NextResponse.json(
      { message: "Unable to increment views" },
      { status: 500 }
    );
  }
}
