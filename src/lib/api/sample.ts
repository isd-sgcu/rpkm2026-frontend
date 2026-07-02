import { fetchApi } from "./client";

export const prerender = true;

export type GetProjectNameResponse = {
  name: string;
  version: string;
};

export function getProjectName() {
  return fetchApi<GetProjectNameResponse>("/");
}
