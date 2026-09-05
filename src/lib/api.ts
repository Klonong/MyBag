/**
 * Axios wrapper around the NestJS backend REST API.
 * Sends/receives the httpOnly JWT cookie set by the backend (`withCredentials: true`).
 */
import axios, { type AxiosRequestConfig, isAxiosError } from "axios";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001").replace(/\/$/, "");

export type ApiError = { message: string; status: number };
export type ApiResult<T> = { data: T | null; error: ApiError | null };

/** Envelope the NestJS backend wraps every response body in. */
type ApiEnvelope<T> = { success: boolean; statusCode: number; message: string; data: T };

function isEnvelope<T>(body: unknown): body is ApiEnvelope<T> {
  return !!body && typeof body === "object" && "success" in body && "data" in body;
}

/** Query-param values; `undefined`/`null`/`""` entries are dropped automatically. */
export type QueryParams = Record<string, string | number | boolean | undefined | null>;

function buildQuery(params?: QueryParams): string {
  if (!params) return "";
  const entries = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== null && value !== "",
  );
  if (!entries.length) return "";
  return `?${new URLSearchParams(entries.map(([key, value]) => [key, String(value)])).toString()}`;
}

/** Reads a list out of a response body, unwrapping `{ items: [...] }` or nested `{ data: ... }` shapes. */
export function unwrapList<T>(body: unknown): T[] {
  if (Array.isArray(body)) return body as T[];
  if (!body || typeof body !== "object") return [];
  if ("items" in body && Array.isArray((body as { items: unknown }).items)) {
    return (body as { items: T[] }).items;
  }
  if ("data" in body) return unwrapList<T>((body as { data: unknown }).data);
  return [];
}

const client = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export const SESSION_EXPIRED_EVENT = "session:expired";

/** Endpoints where a 401 is an expected outcome, not an expired session. */
const AUTH_ENDPOINTS = ["/auth/login", "/auth/register", "/auth/me", "/auth/logout"];

async function request<T>(config: AxiosRequestConfig): Promise<ApiResult<T>> {
  try {
    const res = await client.request<T | ApiEnvelope<T>>(config);
    if (res.status === 204) return { data: null, error: null };
    const body = res.data;
    return { data: isEnvelope<T>(body) ? body.data : (body as T), error: null };
  } catch (err) {
    if (isAxiosError(err)) {
      const status = err.response?.status ?? 0;
      const path = config.url?.split("?")[0] ?? "";
      if (
        status === 401 &&
        typeof window !== "undefined" &&
        !AUTH_ENDPOINTS.some((endpoint) => path.startsWith(endpoint))
      ) {
        window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
      }
      const body = err.response?.data;
      const message =
        (body && typeof body === "object" && "message" in body && String(body.message)) ||
        err.message;
      return { data: null, error: { message, status } };
    }
    const message = err instanceof Error ? err.message : "Network error.";
    return { data: null, error: { message, status: 0 } };
  }
}

export const api = {
  get: <T>(path: string, params?: QueryParams) =>
    request<T>({ url: `${path}${buildQuery(params)}`, method: "GET" }),
  post: <T>(path: string, body?: unknown, params?: QueryParams) =>
    request<T>({ url: `${path}${buildQuery(params)}`, method: "POST", data: body }),
  patch: <T>(path: string, body?: unknown, params?: QueryParams) =>
    request<T>({ url: `${path}${buildQuery(params)}`, method: "PATCH", data: body }),
  delete: <T>(path: string, params?: QueryParams) =>
    request<T>({ url: `${path}${buildQuery(params)}`, method: "DELETE" }),
  upload: <T>(path: string, formData: FormData, params?: QueryParams) =>
    request<T>({
      url: `${path}${buildQuery(params)}`,
      method: "POST",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export { API_URL, buildQuery };
