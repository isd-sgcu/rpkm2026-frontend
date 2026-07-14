import { DISTRICTS, PROVINCES } from "@lib/thai-geo";
import {
  DIETARY_OPTIONS,
  FACULTIES,
  FOOD_ALLERGY_OPTIONS,
  OTHER_OPTION,
  PREFIX_ENUM_MAP,
  VEHICLE_ENUM_MAP,
} from "@lib/register-options";
import type { RegistrationBody, TravelLegInput } from "@lib/api/rpkm";

import type { RegisterFormValues } from "./types";

const provinceName = (id: string) =>
  PROVINCES.find((p) => String(p.id) === id)?.name ?? "";
const districtName = (id: string) =>
  DISTRICTS.find((d) => String(d.id) === id)?.name ?? "";
const facultyName = (code: string) =>
  FACULTIES.find((f) => f.code === code)?.name ?? code;

// prefix/vehicle are real Postgres enum columns on the backend — unlike the
// other free-text option lists, the exact enum token must be sent, not the
// Thai label the form stores as its value.
const prefixEnumOf = (th: string): RegistrationBody["prefix"] =>
  PREFIX_ENUM_MAP.find((o) => o.th === th)?.value ?? "not_specified";
const vehicleEnumOf = (th: string): TravelLegInput["vehicle"] =>
  VEHICLE_ENUM_MAP.find((o) => o.th === th)?.value ?? "other";

const ATTEND_DAYS_TO_NUMBER: Record<string, number> = {
  "1 วัน": 1,
  "2 วัน": 2,
  "3 วัน": 3,
};

function combineChecklist(
  options: readonly string[],
  items: string[],
  other: string,
): string {
  const chosen = items.filter(
    (item) => item !== OTHER_OPTION && options.includes(item),
  );
  if (items.includes(OTHER_OPTION) && other.trim()) {
    chosen.push(other.trim());
  }
  return chosen.join(", ");
}

function mapLeg(leg: RegisterFormValues["travelLegs"][number]): TravelLegInput {
  return {
    vehicle: vehicleEnumOf(leg.vehicle),
    vehicleOther: null,
    originProvince: provinceName(leg.originProvince),
    originDistrict: districtName(leg.originDistrict),
    destinationProvince: provinceName(leg.destProvince),
    destinationDistrict: districtName(leg.destDistrict),
  };
}

export function toRegistrationBody(data: RegisterFormValues): RegistrationBody {
  const allergyParts = [
    data.foodAllergyHas
      ? combineChecklist(
          FOOD_ALLERGY_OPTIONS,
          data.foodAllergyItems,
          data.foodAllergyOther,
        )
      : "",
    data.drugAllergyHas ? data.drugAllergyDetail.trim() : "",
  ].filter(Boolean);

  const dietary = data.dietaryHas
    ? combineChecklist(DIETARY_OPTIONS, data.dietaryItems, data.dietaryOther)
    : "";

  return {
    pdpaConsent: true,
    prefix: prefixEnumOf(data.prefix),
    firstName: data.firstName,
    lastName: data.lastName,
    nickname: data.nickname,
    faculty: facultyName(data.faculty),
    phone: data.phone,
    emergencyContactName: data.guardianRelation,
    emergencyContactPhone: data.guardianPhone,
    allergies: allergyParts.length > 0 ? allergyParts.join(" / ") : null,
    dietary: dietary || null,
    medicalNotes: data.chronicDiseaseHas
      ? data.chronicDiseaseDetail.trim() || null
      : null,
    pnoSgcuAwareness: data.sgcuAwareness,
    pnoReferralSource: data.prChannel,
    csoDistrict: districtName(data.residenceDistrict),
    csoProvince: provinceName(data.residenceProvince),
    travelLegs: data.travelLegs.map(mapLeg),
    attendedDays: ATTEND_DAYS_TO_NUMBER[data.attendDays] ?? 1,
    bottle: data.waterBottle === "เตรียม",
  };
}
