/**
 * Thin fetch wrapper around the NestJS backend REST API.
 * Sends/receives the httpOnly JWT cookie set by the backend (`credentials: "include"`).
 */

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001").replace(/\/$/, "");

export type ApiError = { message: string; status: number };
export type ApiResult<T> = { data: T | null; error: ApiError | null };

async function request<T>(
  path: string,
  init?: RequestInit
): Promise<ApiResult<T>> {
  try {
    const isFormData = init?.body instanceof FormData;
    const res = await fetch(`${API_URL}${path}`, {
      credentials: "include",
      ...init,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...init?.headers,
      },
    });

    const body = res.status === 204 ? null : await res.json().catch(() => null);

    if (!res.ok) {
      const message =
        (body && typeof body === "object" && "message" in body && String(body.message)) ||
        res.statusText;
      return { data: null, error: { message, status: res.status } };
    }

    return { data: body as T, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Network error.";
    return { data: null, error: { message, status: 0 } };
  }
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
  upload: <T>(path: string, formData: FormData) =>
    request<T>(path, { method: "POST", body: formData, headers: {} }),
};

export { API_URL };
