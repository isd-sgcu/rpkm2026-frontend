import { FACULTIES } from "@lib/register-options";
import { PROVINCES, DISTRICTS } from "@lib/thai-geo";
import type { MeUser, Prefix } from "@lib/api/rpkm";

import type { RegisterFormValues } from "./types";

/**
 * `students` is shared across FirstDate/RPKM, so a returning FirstDate
 * registrant already has these fields set before ever opening RPKM's form.
 * Only fields that are unambiguous to carry over are mapped here — checklist
 * fields (allergies/dietary) are stored as a single combined free-text string
 * server-side with no reliable way to split them back into items, so those
 * stay blank and the student re-enters them.
 */

const PREFIX_TO_TH: Record<Prefix, string | undefined> = {
  mr: "นาย",
  mrs: "นาง",
  ms: "นางสาว",
  other: "อื่นๆ",
  not_specified: undefined,
};

function facultyCodeOf(name: string | null): string | undefined {
  if (!name) return undefined;
  return FACULTIES.find((f) => f.name === name)?.code;
}

function provinceIdOf(name: string | null): string | undefined {
  if (!name) return undefined;
  const province = PROVINCES.find((p) => p.name === name);
  return province ? String(province.id) : undefined;
}

function districtIdOf(
  name: string | null,
  provinceId: string | undefined,
): string | undefined {
  if (!name || !provinceId) return undefined;
  const district = DISTRICTS.find(
    (d) => d.name === name && String(d.provinceId) === provinceId,
  );
  return district ? String(district.id) : undefined;
}

export function prefillFromMeUser(user: MeUser): Partial<RegisterFormValues> {
  const values: Partial<RegisterFormValues> = {};

  const prefix = user.prefix ? PREFIX_TO_TH[user.prefix] : undefined;
  if (prefix) values.prefix = prefix;
  if (user.firstName) values.firstName = user.firstName;
  if (user.lastName) values.lastName = user.lastName;
  if (user.phone) values.phone = user.phone;
  if (user.emergencyContactPhone)
    values.guardianPhone = user.emergencyContactPhone;
  if (user.emergencyContactName)
    values.guardianRelation = user.emergencyContactName;
  if (user.pnoSgcuAwareness) values.sgcuAwareness = user.pnoSgcuAwareness;

  const faculty = facultyCodeOf(user.faculty);
  if (faculty) values.faculty = faculty;

  if (typeof user.bottle === "boolean") {
    values.waterBottle = user.bottle ? "เตรียม" : "ไม่ได้เตรียม";
  }

  if (user.medicalNotes) {
    values.chronicDiseaseHas = true;
    values.chronicDiseaseDetail = user.medicalNotes;
  }

  const provinceId = provinceIdOf(user.csoProvince);
  if (provinceId) {
    values.residenceProvince = provinceId;
    const districtId = districtIdOf(user.csoDistrict, provinceId);
    if (districtId) values.residenceDistrict = districtId;
  }

  return values;
}
