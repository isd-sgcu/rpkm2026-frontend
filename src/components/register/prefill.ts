import {
  DIETARY_OPTIONS,
  FACULTIES,
  FOOD_ALLERGY_OPTIONS,
  OTHER_OPTION,
  PREFIX_VALUES,
  RELATION_OPTIONS,
  SGCU_AWARENESS_OPTIONS,
  type LabeledOption,
} from "@lib/register-options";
import { PROVINCES, DISTRICTS } from "@lib/thai-geo";
import type { MeUser } from "@lib/api/rpkm";

import type { RegisterFormValues } from "./types";

/**
 * `students` is shared across FirstDate/RPKM, so a returning FirstDate
 * registrant already has these fields set before ever opening RPKM's form.
 *
 * getProfile() hands back what's stored — display strings for the free-text
 * columns (faculty/province/district as Thai names, allergies/dietary as
 * ", "-joined Thai labels), tokens for the enum columns and the P&O answers.
 * The form works in tokens throughout, so the stored labels are reversed here.
 * That reversal is lossy for the checklists (free text is merged into the same
 * string), so anything unrecognised lands in the "อื่น ๆ" free-text field
 * rather than being dropped.
 */

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
function parseAllergies(allergies: string | null) {
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

export function prefillFromMeUser(user: MeUser): Partial<RegisterFormValues> {
  const values: Partial<RegisterFormValues> = {};

  if (user.prefix && PREFIX_VALUES.includes(user.prefix)) {
    values.prefix = user.prefix;
  }
  if (user.firstName) values.firstName = user.firstName;
  if (user.lastName) values.lastName = user.lastName;
  if (user.nickname) values.nickname = user.nickname;
  if (user.phone) values.phone = user.phone;
  if (user.emergencyContactPhone)
    values.guardianPhone = user.emergencyContactPhone;

  // emergencyContactName holds the relation's Thai label, not a token.
  const relation = RELATION_OPTIONS.find(
    (o) => o.th === user.emergencyContactName,
  );
  if (relation) values.guardianRelation = relation.value;

  // Same question and codes on both projects, so the answer carries over. Guard
  // anyway: a row written before the code contract landed still holds a label.
  if (
    user.pnoSgcuAwareness &&
    SGCU_AWARENESS_OPTIONS.some((o) => o.value === user.pnoSgcuAwareness)
  ) {
    values.sgcuAwareness = user.pnoSgcuAwareness;
  }

  const faculty = facultyCodeOf(user.faculty);
  if (faculty) values.faculty = faculty;

  if (typeof user.bottle === "boolean") {
    values.waterBottle = user.bottle ? "yes" : "no";
  }

  const { food, drug } = parseAllergies(user.allergies);
  if (food.trim()) {
    const checklist = reverseChecklist(FOOD_ALLERGY_OPTIONS, food);
    values.foodAllergyHas = true;
    values.foodAllergyItems = checklist.items;
    values.foodAllergyOther = checklist.other;
  }
  if (drug.trim()) {
    values.drugAllergyHas = true;
    values.drugAllergyDetail = drug;
  }

  if (user.dietary?.trim()) {
    const checklist = reverseChecklist(DIETARY_OPTIONS, user.dietary);
    values.dietaryHas = true;
    values.dietaryItems = checklist.items;
    values.dietaryOther = checklist.other;
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
