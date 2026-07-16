import type { DefaultValues } from "react-hook-form";

import {
  CHULA_DISTRICT_ID,
  CHULA_PROVINCE_ID,
  DISTRICTS,
  PROVINCES,
} from "@lib/thai-geo";
import {
  DIETARY_OPTIONS,
  FACULTIES,
  FOOD_ALLERGY_OPTIONS,
  OTHER_OPTION,
  RELATION_OPTIONS,
  type LabeledOption,
} from "@lib/register-options";
import type { ProfileResult, TravelLegView } from "@lib/api/rpkm";
import type { RegisterFormValues } from "@components/register/types";

// getProfile() returns display strings (faculty/province/district as Thai names,
// allergies/dietary as joined labels), but the form works in codes/ids. These
// helpers reverse the toRegistrationBody() mapping as best they can. The mapping
// is lossy (free text merged with checklist labels), so parsing is best-effort:
// anything we can't match falls back to the "อื่น ๆ" free-text field.

const facultyCode = (name: string | null) =>
  (name && FACULTIES.find((f) => f.name === name)?.code) || "";

const provinceIdByName = (name: string | null) => {
  const found = name ? PROVINCES.find((p) => p.name === name) : undefined;
  return found ? String(found.id) : "";
};

const districtIdByName = (name: string, provinceName: string) => {
  const provinceId = PROVINCES.find((p) => p.name === provinceName)?.id;
  const found = DISTRICTS.find(
    (d) =>
      d.name === name && (provinceId == null || d.provinceId === provinceId),
  );
  return found ? String(found.id) : "";
};

const relationValueByLabel = (label: string | null) =>
  (label && RELATION_OPTIONS.find((o) => o.th === label)?.value) || "";

/** Split a stored ", "-joined checklist string back into option values +
 *  leftover free text (which maps to the "อื่น ๆ" field). */
function reverseChecklist(options: readonly LabeledOption[], text: string) {
  const items: string[] = [];
  const leftovers: string[] = [];
  for (const token of text.split(", ")) {
    const trimmed = token.trim();
    if (!trimmed) continue;
    const match = options.find(
      (o) => o.th === trimmed && o.value !== OTHER_OPTION,
    );
    if (match) items.push(match.value);
    else leftovers.push(trimmed);
  }
  let other = "";
  if (leftovers.length > 0) {
    items.push(OTHER_OPTION);
    other = leftovers.join(", ");
  }
  return { items, other };
}

/** allergies is `"<food> / <drug>"` (either part may be absent). With two
 *  parts we trust the join order; with one we classify by whether any token
 *  matches a known food-allergy label. */
export function parseAllergies(allergies: string | null) {
  if (!allergies) return { food: "", drug: "" };
  const parts = allergies.split(" / ");
  if (parts.length >= 2) {
    return { food: parts[0], drug: parts.slice(1).join(" / ") };
  }
  const only = parts[0];
  const looksLikeFood = only
    .split(", ")
    .some((tk) => FOOD_ALLERGY_OPTIONS.some((o) => o.th === tk.trim()));
  return looksLikeFood ? { food: only, drug: "" } : { food: "", drug: only };
}

function mapLeg(view: TravelLegView): RegisterFormValues["travelLegs"][number] {
  return {
    vehicle: view.vehicle,
    originProvince: provinceIdByName(view.originProvince),
    originDistrict: districtIdByName(view.originDistrict, view.originProvince),
    destProvince: provinceIdByName(view.destinationProvince),
    destDistrict: districtIdByName(
      view.destinationDistrict,
      view.destinationProvince,
    ),
  };
}

const chulaLeg = () => ({
  vehicle: "",
  originProvince: "",
  originDistrict: "",
  destProvince: String(CHULA_PROVINCE_ID),
  destDistrict: String(CHULA_DISTRICT_ID),
});

// DefaultValues (not RegisterFormValues) because an unset prefix seeds as
// undefined — the schema's enum has no "nothing chosen yet" member.
export function profileToFormValues(
  profile: ProfileResult,
): DefaultValues<RegisterFormValues> {
  const { user, registration, travelLegs } = profile;
  const { food, drug } = parseAllergies(user.allergies);
  const foodChecklist = reverseChecklist(FOOD_ALLERGY_OPTIONS, food);
  const dietaryChecklist = reverseChecklist(
    DIETARY_OPTIONS,
    user.dietary ?? "",
  );

  const legs = [...travelLegs].sort((a, b) => a.seq - b.seq).map(mapLeg);

  return {
    // ข้อมูลส่วนตัว
    prefix: user.prefix ?? undefined,
    firstName: user.firstName,
    lastName: user.lastName,
    nickname: user.nickname ?? "",
    faculty: facultyCode(user.faculty),
    studentId: user.studentId,
    phone: user.phone ?? "",
    guardianPhone: user.emergencyContactPhone ?? "",
    guardianRelation: relationValueByLabel(user.emergencyContactName),

    // ข้อมูลสุขภาพ
    foodAllergyHas: food.trim().length > 0,
    foodAllergyItems: foodChecklist.items,
    foodAllergyOther: foodChecklist.other,
    dietaryHas: (user.dietary ?? "").trim().length > 0,
    dietaryItems: dietaryChecklist.items,
    dietaryOther: dietaryChecklist.other,
    drugAllergyHas: drug.trim().length > 0,
    drugAllergyDetail: drug,
    chronicDiseaseHas: (user.medicalNotes ?? "").trim().length > 0,
    chronicDiseaseDetail: user.medicalNotes ?? "",

    // ข้อมูลอื่น ๆ — not editable here, but the shared schema declares them, and
    // the survey answers are already stored as the codes the options use.
    sgcuAwareness: user.pnoSgcuAwareness ?? "",
    prChannel: registration?.pnoReferralSource ?? "",
    attendDays: registration?.attendedDays
      ? String(registration.attendedDays)
      : "",
    waterBottle: user.bottle == null ? "" : user.bottle ? "yes" : "no",

    // ข้อมูลการเดินทาง
    residenceProvince: provinceIdByName(user.csoProvince),
    residenceDistrict: districtIdByName(
      user.csoDistrict ?? "",
      user.csoProvince ?? "",
    ),
    travelLegs: legs.length > 0 ? legs : [chulaLeg()],
  };
}
