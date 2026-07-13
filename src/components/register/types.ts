export type { RegisterFormValues } from "./schema";
import type { RegisterFormValues } from "./schema";

export const TOTAL_STEPS = 4;

/** Field names that belong to each step, used to scope validation per step. */
export const STEP_FIELDS: Record<number, (keyof RegisterFormValues)[]> = {
  1: [
    "prefix",
    "firstName",
    "lastName",
    "faculty",
    "studentId",
    "phone",
    "guardianPhone",
    "guardianRelation",
  ],
  2: [
    "foodAllergyHas",
    "foodAllergyItems",
    "foodAllergyOther",
    "dietaryHas",
    "dietaryItems",
    "dietaryOther",
    "drugAllergyHas",
    "drugAllergyDetail",
    "chronicDiseaseHas",
    "chronicDiseaseDetail",
  ],
  3: ["sgcuAwareness", "prChannel"],
  4: ["residenceProvince", "residenceDistrict", "travelLegs"],
};
