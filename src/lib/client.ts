import { appConfig } from "@lib/env";

export class APIError extends Error {
  constructor(
    public readonly status: number,
    message?: string,
  ) {
    super(message ?? `API error: ${status}`);
    this.name = "ApiError";
  }
}

type RequestOptions = Omit<RequestInit, "method" | "body"> & {
  body?: unknown;
};

async function request<T>(
  method: string,
  path: string,
  { body, headers, ...init }: RequestOptions = {},
): Promise<T> {
  const response = await fetch(`${appConfig.apiBaseUrl}${path}`, {
    ...init,
    method,
    credentials: "include",
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401) {
    if (typeof window !== "undefined") {
      window.location.href = "/landing";
    }
    throw new APIError(401, "Unauthorized");
  }

  if (!response.ok) {
    throw new APIError(response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const API = {
  get: <T>(path: string, init?: RequestOptions) =>
    request<T>("GET", path, init),
  post: <T>(path: string, body?: unknown, init?: RequestOptions) =>
    request<T>("POST", path, { ...init, body }),
  put: <T>(path: string, body?: unknown, init?: RequestOptions) =>
    request<T>("PUT", path, { ...init, body }),
  patch: <T>(path: string, body?: unknown, init?: RequestOptions) =>
    request<T>("PATCH", path, { ...init, body }),
  del: <T>(path: string, init?: RequestOptions) =>
    request<T>("DELETE", path, init),
};
