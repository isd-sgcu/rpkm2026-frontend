import type { RegistrationBody } from "@lib/api/rpkm";
import {
  STEP_FIELDS,
  type RegisterFormValues,
} from "@components/register/types";

export type EditSection = "personal" | "health" | "travel";

/** Ordered list of the sections shown on the overview (register's step 3
 *  "ข้อมูลอื่น ๆ" is intentionally omitted from editing). */
export const EDIT_SECTIONS: EditSection[] = ["personal", "health", "travel"];

/** Form-field names each section owns — used to scope `trigger()` validation. */
export const SECTION_FIELDS: Record<EditSection, (keyof RegisterFormValues)[]> =
  {
    personal: STEP_FIELDS[1],
    health: STEP_FIELDS[2],
    travel: STEP_FIELDS[4],
  };

/** Which RegistrationBody keys each section's PATCH sends. */
export const SECTION_PATCH_KEYS: Record<
  EditSection,
  (keyof RegistrationBody)[]
> = {
  personal: [
    "prefix",
    "firstName",
    "lastName",
    "nickname",
    "faculty",
    "phone",
    "emergencyContactName",
    "emergencyContactPhone",
  ],
  health: ["allergies", "dietary", "medicalNotes"],
  travel: ["csoProvince", "csoDistrict", "travelLegs"],
};
