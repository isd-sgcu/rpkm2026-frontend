import {
  DIETARY_OPTIONS,
  FACULTIES,
  FOOD_ALLERGY_OPTIONS,
  PREFIX_OPTIONS,
  RELATION_OPTIONS,
  VEHICLE_OPTIONS,
  labelOf,
  type LabeledOption,
} from "@lib/register-options";
import { DISTRICTS, PROVINCES } from "@lib/thai-geo";
import type { LocaleType } from "@lib/i18n/locale";

/**
 * The free-text columns store the Thai label whatever locale the form was
 * filled in (see toRegistrationBody.ts), so reading a profile back gives Thai
 * strings — not tokens the UI can translate. These look each stored label up in
 * the option list it came from and re-render it in the current locale.
 *
 * Anything with no match is passed through unchanged: it's either free text the
 * student typed (drug allergy, chronic disease, an "อื่น ๆ" answer), which has
 * no translation, or a value written before the option list changed.
 */

const localizedByTh = (
  locale: LocaleType,
  options: readonly LabeledOption[],
  stored: string,
) => {
  const match = options.find((o) => o.th === stored);
  return match ? labelOf(locale, match) : stored;
};

/** prefix and vehicle are stored as enum tokens, so they look up by value. */
const localizedByValue = (
  locale: LocaleType,
  options: readonly LabeledOption[],
  stored: string,
) => {
  const match = options.find((o) => o.value === stored);
  return match ? labelOf(locale, match) : stored;
};

export const prefixLabel = (locale: LocaleType, stored: string | null) =>
  stored ? localizedByValue(locale, PREFIX_OPTIONS, stored) : "";

export const vehicleLabel = (locale: LocaleType, stored: string) =>
  localizedByValue(locale, VEHICLE_OPTIONS, stored);

export const facultyLabel = (locale: LocaleType, stored: string | null) => {
  if (!stored) return "";
  const faculty = FACULTIES.find((f) => f.name === stored);
  if (!faculty) return stored;
  return locale === "th" ? faculty.name : faculty.nameEn;
};

export const relationLabel = (locale: LocaleType, stored: string | null) =>
  stored ? localizedByTh(locale, RELATION_OPTIONS, stored) : "";

export const provinceLabel = (locale: LocaleType, stored: string | null) => {
  if (!stored) return "";
  const province = PROVINCES.find((p) => p.name === stored);
  if (!province) return stored;
  return locale === "th" ? province.name : province.nameEn;
};

export const districtLabel = (locale: LocaleType, stored: string | null) => {
  if (!stored) return "";
  const district = DISTRICTS.find((d) => d.name === stored);
  if (!district) return stored;
  return locale === "th" ? district.name : district.nameEn;
};

/** Localize a stored ", "-joined checklist into display chips. */
const checklistLabels = (
  locale: LocaleType,
  options: readonly LabeledOption[],
  stored: string,
) =>
  stored
    .split(", ")
    .map((token) => token.trim())
    .filter(Boolean)
    .map((token) => localizedByTh(locale, options, token));

export const foodAllergyLabels = (locale: LocaleType, stored: string) =>
  checklistLabels(locale, FOOD_ALLERGY_OPTIONS, stored);

export const dietaryLabels = (locale: LocaleType, stored: string | null) =>
  checklistLabels(locale, DIETARY_OPTIONS, stored ?? "");

/** "<province>, <district>" as one localized line. */
export const placeLabel = (
  locale: LocaleType,
  province: string | null,
  district: string | null,
) =>
  [provinceLabel(locale, province), districtLabel(locale, district)]
    .filter(Boolean)
    .join(", ");
