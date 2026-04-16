// lib/client.ts

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY!;

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiResponse<T = unknown> {
  status: boolean;
  message?: string;
  data?: T;
}

interface ApiFetchOptions extends RequestInit {
  method?: HttpMethod;
}

/**
 * ฟังก์ชันกลางสำหรับเรียก API
 */
export async function apiFetch<T = unknown>(
  endpoint: string,
  options: ApiFetchOptions = {}
): Promise<ApiResponse<T>> {
  const url = `${BASE_URL}${endpoint}`;

  // แปลง headers เป็น object
  const userHeaders = (options.headers || {}) as Record<string, string>;

  const headers: Record<string, string> = {
    ...userHeaders,
    "X-API-KEY": API_KEY,
  };

  // ถ้าไม่ใช่ FormData → ใส่ Content-Type
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] =
      headers["Content-Type"] || "application/json";
  }

  const res = await fetch(url, {
    ...options,
    headers,
    cache: "no-store", // 🔥 กัน cache (สำคัญใน Next.js)
  });

  // 🔴 handle error status
  if (!res.ok) {
    throw new Error(`API Error: ${res.status}`);
  }

  // parse json
  const data = await res.json();

  return data;
}