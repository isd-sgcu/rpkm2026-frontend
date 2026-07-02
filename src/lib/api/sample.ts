import { API } from "@lib/client";

export type GetProjectNameResponse = {
  name: string;
  version: string;
};

export function getProjectName() {
  return API.get<GetProjectNameResponse>("/");
}
