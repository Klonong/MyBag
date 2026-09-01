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

const client = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

async function request<T>(config: AxiosRequestConfig): Promise<ApiResult<T>> {
  try {
    const res = await client.request<T | ApiEnvelope<T>>(config);
    if (res.status === 204) return { data: null, error: null };
    const body = res.data;
    return { data: isEnvelope<T>(body) ? body.data : (body as T), error: null };
  } catch (err) {
    if (isAxiosError(err)) {
      const body = err.response?.data;
      const message =
        (body && typeof body === "object" && "message" in body && String(body.message)) ||
        err.message;
      return { data: null, error: { message, status: err.response?.status ?? 0 } };
    }
    const message = err instanceof Error ? err.message : "Network error.";
    return { data: null, error: { message, status: 0 } };
  }
}

export const api = {
  get: <T>(path: string) => request<T>({ url: path, method: "GET" }),
  post: <T>(path: string, body?: unknown) => request<T>({ url: path, method: "POST", data: body }),
  patch: <T>(path: string, body?: unknown) => request<T>({ url: path, method: "PATCH", data: body }),
  delete: <T>(path: string) => request<T>({ url: path, method: "DELETE" }),
  upload: <T>(path: string, formData: FormData) =>
    request<T>({
      url: path,
      method: "POST",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export { API_URL };
