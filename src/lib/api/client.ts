import { appConfig } from "@lib/env";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message?: string,
  ) {
    super(message ?? `API error: ${status}`);
    this.name = "ApiError";
  }
}

async function fetchBase<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${appConfig.apiBaseUrl}${path}`, {
    ...init,
    credentials: "include",
  });

  if (!response.ok) {
    throw new ApiError(response.status);
  }

  return response.json() as Promise<T>;
}

export async function fetchApi<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  try {
    return await fetchBase<T>(path, init);
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      throw new ApiError(err.status, "Unauthorized");
    }
    throw err;
  }
}
