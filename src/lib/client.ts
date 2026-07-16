import { appConfig } from "@lib/env";

export class APIError extends Error {
  constructor(
    public readonly status: number,
    message?: string,
    /** Backend AppErrorCode, e.g. "STUDENT_NOT_FOUND" (see backend src/utils/error.ts). */
    public readonly code?: string,
    /** Extra payload for codes that carry one, e.g. ALREADY_CHECKED_IN's scannedAt/scannedBy. */
    public readonly context?: Record<string, unknown>,
  ) {
    super(message ?? `API error: ${status}`);
    this.name = "ApiError";
  }
}

type ErrorEnvelope = {
  success: false;
  error: { code: string; context?: Record<string, unknown> };
};

async function parseErrorBody(response: Response): Promise<APIError> {
  try {
    const body = (await response.json()) as ErrorEnvelope;
    if (body?.error?.code) {
      return new APIError(
        response.status,
        body.error.code,
        body.error.code,
        body.error.context,
      );
    }
  } catch {
    // non-JSON body — fall through to the bare status error
  }
  return new APIError(response.status);
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
    throw await parseErrorBody(response);
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
