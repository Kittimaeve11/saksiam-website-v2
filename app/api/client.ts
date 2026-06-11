const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY!;

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiResponse<T = unknown> {
  status: boolean;
  message?: string;
  data?: T;
  result?: T;
}

interface ApiFetchOptions extends RequestInit {
  method?: HttpMethod;
  memoryCache?: boolean;
}

const responseCache = new Map<string, ApiResponse<unknown>>();
const pendingCache = new Map<string, Promise<ApiResponse<unknown>>>();

const isBrowser = () => typeof window !== "undefined";

const getUrl = (endpoint: string): string =>
  `${BASE_URL.replace(/\/+$/, "")}/${endpoint.replace(/^\/+/, "")}`;

const getRequestMethod = (options: ApiFetchOptions = {}): HttpMethod =>
  (options.method || "GET").toUpperCase() as HttpMethod;

const shouldUseMemoryCache = (options: ApiFetchOptions = {}): boolean =>
  isBrowser() &&
  options.memoryCache !== false &&
  getRequestMethod(options) === "GET" &&
  !options.body;

const getCacheKey = (endpoint: string, options: ApiFetchOptions = {}): string =>
  `${getRequestMethod(options)}:${getUrl(endpoint)}`;

export function getCachedApiResponse<T = unknown>(
  endpoint: string,
  options: ApiFetchOptions = {}
): ApiResponse<T> | null {
  if (!shouldUseMemoryCache(options)) return null;

  return (responseCache.get(getCacheKey(endpoint, options)) as ApiResponse<T>) || null;
}

export function clearApiMemoryCache() {
  responseCache.clear();
  pendingCache.clear();
}

export async function apiFetch<T = unknown>(
  endpoint: string,
  options: ApiFetchOptions = {}
): Promise<ApiResponse<T>> {
  const { memoryCache: _memoryCache, ...fetchOptions } = options;
  const url = getUrl(endpoint);
  const cacheKey = getCacheKey(endpoint, options);
  const useMemoryCache = shouldUseMemoryCache(options);

  if (useMemoryCache) {
    const cached = responseCache.get(cacheKey);
    if (cached) return cached as ApiResponse<T>;

    const pending = pendingCache.get(cacheKey);
    if (pending) return pending as Promise<ApiResponse<T>>;
  }

  const userHeaders = (fetchOptions.headers || {}) as Record<string, string>;
  const headers: Record<string, string> = {
    ...userHeaders,
    "X-API-KEY": API_KEY,
  };

  if (!(fetchOptions.body instanceof FormData)) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }

  const request = (async () => {
    const res = await fetch(url, {
      ...fetchOptions,
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      let message = `API Error: ${res.status}`;

      try {
        const errorData = await res.clone().json();

        if (errorData && typeof errorData === "object") {
          message =
            errorData.message ||
            errorData.error ||
            errorData.errors ||
            message;
        }
      } catch {
        try {
          const errorText = await res.text();
          message = errorText || message;
        } catch {
          // Keep the original status message when the response body is empty.
        }
      }

      if (typeof message !== "string") {
        message = JSON.stringify(message);
      }

      throw new Error(message);
    }

    const data = await res.json();
    const normalized =
      data &&
      typeof data === "object" &&
      !Array.isArray(data) &&
      data.data === undefined &&
      data.result !== undefined
        ? {
            ...data,
            data: data.result,
          }
        : data;

    const response = normalized as ApiResponse<T>;

    if (useMemoryCache && response.status !== false) {
      responseCache.set(cacheKey, response as ApiResponse<unknown>);
    }

    return response;
  })();

  if (useMemoryCache) {
    pendingCache.set(cacheKey, request as Promise<ApiResponse<unknown>>);
  }

  try {
    return await request;
  } finally {
    if (useMemoryCache) {
      pendingCache.delete(cacheKey);
    }
  }
}
