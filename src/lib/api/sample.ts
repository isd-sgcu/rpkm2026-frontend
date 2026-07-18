import { APIError, eden } from "@lib/client";

export async function getProjectName() {
  const { data, error, response } = await eden.get();

  if (error) {
    throw new APIError(response.status);
  }

  return data;
}
