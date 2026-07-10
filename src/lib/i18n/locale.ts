import { atom } from "nanostores";

export const LOCALES = ["th", "en"] as const;
export type LocaleType = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: LocaleType = "th";

const STORAGE_KEY = "locale";

function readStoredLocale(): LocaleType {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "th" || stored === "en" ? stored : DEFAULT_LOCALE;
}

export const $locale = atom<LocaleType>(readStoredLocale());

export function setLocale(locale: LocaleType) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, locale);
  }
  $locale.set(locale);
}
