type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiResponse<T = unknown> {
  status: boolean | number;
  message?: string;
  data?: T;
  result?: T;
}

export type ApiFetchOptions = Omit<RequestInit, "method"> & {
  method?: HttpMethod;
  memoryCache?: boolean;
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
};

const responseCache = new Map<string, ApiResponse<unknown>>();
const pendingCache = new Map<string, Promise<ApiResponse<unknown>>>();

const isBrowser = () => typeof window !== "undefined";

const trimTrailingSlashes = (value: string): string => value.replace(/\/+$/, "");

const getRequiredEnv = (name: string, value: string | undefined): string => {
  if (value?.trim()) return value.trim();
  throw new Error(`Missing required environment variable: ${name}`);
};

const getBaseUrl = (): string =>
  trimTrailingSlashes(
    getRequiredEnv("NEXT_PUBLIC_API_URL", process.env.NEXT_PUBLIC_API_URL)
  );

const getApiKey = (): string =>
  getRequiredEnv("NEXT_PUBLIC_API_KEY", process.env.NEXT_PUBLIC_API_KEY);

const isAbsoluteUrl = (value: string): boolean => /^https?:\/\//i.test(value);

const getUrl = (endpoint: string): string => {
  const value = endpoint.trim();

  if (!value) throw new Error("apiFetch endpoint is required");

  return isAbsoluteUrl(value)
    ? value
    : `${getBaseUrl()}/${value.replace(/^\/+/, "")}`;
};

const getRequestMethod = (options: ApiFetchOptions = {}): HttpMethod =>
  (options.method || "GET").toUpperCase() as HttpMethod;

const shouldUseMemoryCache = (options: ApiFetchOptions = {}): boolean =>
  isBrowser() &&
  options.memoryCache !== false &&
  getRequestMethod(options) === "GET" &&
  !options.body;

const getCacheKey = (endpoint: string, options: ApiFetchOptions = {}): string =>
  `${getRequestMethod(options)}:${getUrl(endpoint)}`;

const createHeaders = (options: ApiFetchOptions): Headers => {
  const headers = new Headers(options.headers);

  headers.set("X-API-KEY", getApiKey());

  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return headers;
};

const readResponsePayload = async (response: Response): Promise<unknown> => {
  const text = await response.text();

  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const getErrorMessage = (payload: unknown, fallback: string): string => {
  if (!payload) return fallback;
  if (typeof payload === "string") return payload || fallback;
  if (typeof payload !== "object" || Array.isArray(payload)) return fallback;

  const record = payload as Record<string, unknown>;
  const message = record.message || record.error || record.errors;

  if (typeof message === "string") return message;
  if (message) return JSON.stringify(message);

  return fallback;
};

const normalizeApiResponse = <T>(payload: unknown): ApiResponse<T> => {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return {
      status: true,
      data: payload as T,
    };
  }

  const record = payload as Record<string, unknown>;
  const data =
    record.data === undefined && record.result !== undefined
      ? record.result
      : record.data;

  return {
    ...record,
    status:
      typeof record.status === "boolean" || typeof record.status === "number"
        ? record.status
        : true,
    data: data as T,
  } as ApiResponse<T>;
};

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
  const fetchOptions: ApiFetchOptions = { ...options };
  delete fetchOptions.memoryCache;
  const url = getUrl(endpoint);
  const cacheKey = getCacheKey(endpoint, options);
  const useMemoryCache = shouldUseMemoryCache(options);

  if (useMemoryCache) {
    const cached = responseCache.get(cacheKey);
    if (cached) return cached as ApiResponse<T>;

    const pending = pendingCache.get(cacheKey);
    if (pending) return pending as Promise<ApiResponse<T>>;
  }

  const request = (async () => {
    const requestInit: RequestInit & ApiFetchOptions = {
      ...fetchOptions,
      headers: createHeaders(fetchOptions),
    };

    if (requestInit.cache === undefined && requestInit.next === undefined) {
      requestInit.cache = "no-store";
    }

    const res = await fetch(url, requestInit);
    const payload = await readResponsePayload(res);

    if (!res.ok) {
      throw new Error(getErrorMessage(payload, `API Error: ${res.status}`));
    }

    const response = normalizeApiResponse<T>(payload);

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
