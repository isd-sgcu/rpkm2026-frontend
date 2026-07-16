import { API } from "@lib/client";

export type HouseRecord = {
  id: string;
  code: string;
  capacity: number | null;
  info: unknown | null;
  createdAt: string;
  updatedAt: string;
};

export async function getHouses() {
  return API.get<HouseRecord[]>("/v1/rpkm/houses/");
}

export async function getHouseDetail(id: string) {
  return API.get<HouseRecord>(`/v1/rpkm/houses/${id}`);
}
