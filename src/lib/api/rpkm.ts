import { API } from "@lib/client";

export type MeResult = {
  id: string | null;
  studentId: string;
  firstName: string;
  lastName: string;
  faculty: string | null;
  role: string;
  registered: boolean;
};

type SuccessResponse<T> = {
  success: true;
  data: T;
};

export async function getMe() {
  const res = await API.get<SuccessResponse<MeResult>>("/v1/rpkm/users/me");
  return res.data;
}

export type Prefix = "mr" | "mrs" | "ms" | "not_specified" | "other";

export type Vehicle =
  | "private_car"
  | "private_ev"
  | "transit"
  | "bus"
  | "taxi"
  | "motorcycle"
  | "bike_walk"
  | "other";

export type MeUser = {
  id: string | null;
  studentId: string;
  prefix: Prefix | null;
  firstName: string;
  lastName: string;
  nickname: string | null;
  faculty: string | null;
  year: string | null;
  phone: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  allergies: string | null;
  dietary: string | null;
  medicalNotes: string | null;
  pnoSgcuAwareness: string | null;
  csoDistrict: string | null;
  csoProvince: string | null;
  bottle: boolean | null;
};

export type MeRegistration = {
  pdpaConsent: boolean;
  pnoReferralSource: string | null;
  attendedDays: number | null;
};

export type TravelLegView = {
  seq: number;
  vehicle: Vehicle;
  vehicleOther: string | null;
  originDistrict: string;
  originProvince: string;
  destinationDistrict: string;
  destinationProvince: string;
};

export type GroupView = {
  id: string;
  leaderId: string;
  joinCode: string;
  assignedHouseId: string | null;
};

export type ProfileResult = {
  user: MeUser;
  registration: MeRegistration | null;
  travelLegs: TravelLegView[];
  group: GroupView | null;
};

export type TravelLegInput = {
  vehicle: Vehicle;
  vehicleOther?: string | null;
  originDistrict: string;
  originProvince: string;
  destinationDistrict: string;
  destinationProvince: string;
};

export type RegistrationBody = {
  pdpaConsent: boolean;
  prefix: Prefix;
  firstName: string;
  lastName: string;
  nickname: string;
  faculty: string;
  phone: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  allergies: string | null;
  dietary: string | null;
  medicalNotes: string | null;
  pnoSgcuAwareness: string;
  pnoReferralSource: string;
  csoDistrict: string;
  csoProvince: string;
  travelLegs: TravelLegInput[];
  attendedDays: number;
  bottle: boolean;
};

export type UpdateProfileBody = Partial<RegistrationBody>;

export async function getProfile() {
  const res = await API.get<SuccessResponse<ProfileResult>>(
    "/v1/rpkm/users/profile",
  );
  return res.data;
}

export async function updateProfile(body: UpdateProfileBody) {
  const res = await API.patch<SuccessResponse<ProfileResult>>(
    "/v1/rpkm/users/profile",
    body,
  );
  return res.data;
}

export type RegistrationResult = {
  userId: string;
  registrationId: string;
  group: GroupView;
};

export async function registerRpkm(body: RegistrationBody) {
  const res = await API.post<SuccessResponse<RegistrationResult>>(
    "/v1/rpkm/users/registration",
    body,
  );
  return res.data;
}
