// หยร/logAction.ts
import { apiFetch } from "@/app/api/client";

type LogPayload = {
  actionType: string;
  actionDetail: string;
  typeUser: string;
  datatype: string;
  datatypeID?: string;
  dataID: string;
  dataname: string;
};

export const logAction = async (payload: LogPayload) => {
  try {
    await apiFetch("/api/logapi", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("log error:", err);
  }
};