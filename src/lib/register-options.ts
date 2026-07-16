/**
 * Select-option data for the registration form (faculties, name prefixes,
 * guardian relations, vehicles, health checklists, PR questions).
 *
 * Faculties source: the official registrar faculty list
 * https://cas.reg.chula.ac.th/cu/general/PersonalInformation/Faculty/IndexDisplayFaculty.html
 *
 * `value` is what's stored in form state / sent to the backend — for prefix
 * and vehicle it's the exact backend enum token, and for the survey answers
 * it's the code `students` documents itself as taking. `th`/`en` are
 * display-only. FirstDate's copy of this file uses the same tokens, so a
 * student's answers carry across the two projects' shared `students` row.
 */

import type { LocaleType } from "./i18n/locale";
import type { Prefix, Vehicle } from "./api/rpkm";

export type Faculty = {
  code: string;
  name: string;
  nameEn: string;
};

export type LabeledOption<V extends string = string> = {
  value: V;
  th: string;
  en: string;
};

export function labelOf(locale: LocaleType, option: LabeledOption): string {
  return locale === "th" ? option.th : option.en;
}

export const FACULTIES: Faculty[] = [
  {
    code: "01",
    name: "สถาบันภาษาไทยสิรินธร",
    nameEn: "The Sirindhorn Thai Language Institute",
  },
  {
    code: "02",
    name: "ศูนย์การศึกษาทั่วไป",
    nameEn: "Office of Academic Affairs",
  },
  { code: "20", name: "บัณฑิตวิทยาลัย", nameEn: "Graduate School" },
  { code: "21", name: "คณะวิศวกรรมศาสตร์", nameEn: "Faculty of Engineering" },
  { code: "22", name: "คณะอักษรศาสตร์", nameEn: "Faculty of Arts" },
  { code: "23", name: "คณะวิทยาศาสตร์", nameEn: "Faculty of Science" },
  { code: "24", name: "คณะรัฐศาสตร์", nameEn: "Faculty of Political Science" },
  {
    code: "25",
    name: "คณะสถาปัตยกรรมศาสตร์",
    nameEn: "Faculty of Architecture",
  },
  {
    code: "26",
    name: "คณะพาณิชยศาสตร์และการบัญชี",
    nameEn: "Faculty of Commerce and Accountancy",
  },
  { code: "27", name: "คณะครุศาสตร์", nameEn: "Faculty of Education" },
  {
    code: "28",
    name: "คณะนิเทศศาสตร์",
    nameEn: "Faculty of Communication Arts",
  },
  { code: "29", name: "คณะเศรษฐศาสตร์", nameEn: "Faculty of Economics" },
  { code: "30", name: "คณะแพทยศาสตร์", nameEn: "Faculty of Medicine" },
  {
    code: "31",
    name: "คณะสัตวแพทยศาสตร์",
    nameEn: "Faculty of Veterinary Science",
  },
  { code: "32", name: "คณะทันตแพทยศาสตร์", nameEn: "Faculty of Dentistry" },
  {
    code: "33",
    name: "คณะเภสัชศาสตร์",
    nameEn: "Faculty of Pharmaceutical Sciences",
  },
  { code: "34", name: "คณะนิติศาสตร์", nameEn: "Faculty of Law" },
  {
    code: "35",
    name: "คณะศิลปกรรมศาสตร์",
    nameEn: "Faculty of Fine and Applied Arts",
  },
  { code: "36", name: "คณะพยาบาลศาสตร์", nameEn: "Faculty of Nursing" },
  {
    code: "37",
    name: "คณะสหเวชศาสตร์",
    nameEn: "Faculty of Allied Health Sciences",
  },
  { code: "38", name: "คณะจิตวิทยา", nameEn: "Faculty of Psychology" },
  {
    code: "39",
    name: "คณะวิทยาศาสตร์การกีฬา",
    nameEn: "Faculty of Sports Science",
  },
  {
    code: "40",
    name: "สำนักวิชาทรัพยากรการเกษตร",
    nameEn: "School of Agricultural Resources",
  },
  {
    code: "51",
    name: "วิทยาลัยประชากรศาสตร์",
    nameEn: "College of Population Studies",
  },
  {
    code: "53",
    name: "วิทยาลัยวิทยาศาสตร์สาธารณสุข",
    nameEn: "College of Public Health Sciences",
  },
  { code: "55", name: "สถาบันภาษา", nameEn: "Language Institute" },
  {
    code: "56",
    name: "สถาบันนวัตกรรมบูรณาการ",
    nameEn: "School of Integrated Innovation",
  },
  {
    code: "58",
    name: "สถาบันบัณฑิตบริหารธุรกิจ ศศินทร์ฯ",
    nameEn: "Sasin Graduate Institute of Business Administration",
  },
];

/**
 * The faculty a CUNET ID belongs to: its last two digits are the registrar's
 * faculty code (the first two are the entry year).
 *
 * Returns "" when the code matches no known faculty — the caller must keep the
 * field editable in that case rather than trapping the student with a blank
 * required field.
 */
export const facultyCodeOf = (studentId: string): string => {
  const code = studentId.trim().slice(-2);
  return FACULTIES.some((faculty) => faculty.code === code) ? code : "";
};

export const PREFIX_OPTIONS: LabeledOption<Prefix>[] = [
  { value: "mr", th: "นาย", en: "Mr." },
  { value: "mrs", th: "นาง", en: "Mrs." },
  { value: "ms", th: "นางสาว", en: "Ms." },
  { value: "not_specified", th: "ไม่ระบุ", en: "Not specified" },
  { value: "other", th: "อื่นๆ", en: "Other" },
];

/** The backend `prefix` enum's tokens, for validating the form field against
 *  the same set the options are built from. */
export const PREFIX_VALUES = PREFIX_OPTIONS.map((option) => option.value);

export const RELATION_OPTIONS: LabeledOption[] = [
  { value: "father", th: "บิดา", en: "Father" },
  { value: "mother", th: "มารดา", en: "Mother" },
  { value: "sibling", th: "พี่น้อง", en: "Sibling" },
  { value: "relative", th: "ญาติ", en: "Relative" },
  { value: "other", th: "อื่น ๆ", en: "Other" },
];

/** The "other" checkbox that reveals a free-text field. */
export const OTHER_OPTION = "other";

/** อาหารที่แพ้ (Step 2) */
export const FOOD_ALLERGY_OPTIONS: LabeledOption[] = [
  { value: "seafood", th: "อาหารทะเล", en: "Seafood" },
  { value: "dairy", th: "นม/แลกโตส", en: "Milk / Lactose" },
  { value: "wheat", th: "แป้งสาลี", en: "Wheat flour" },
  { value: "egg", th: "ไข่", en: "Egg" },
  { value: "nuts", th: "ถั่ว", en: "Nuts" },
  { value: "msg", th: "ผงชูรส", en: "MSG" },
  { value: OTHER_OPTION, th: "อื่น ๆ", en: "Other" },
];

/** ข้อจำกัดด้านอาหาร (Step 2) */
export const DIETARY_OPTIONS: LabeledOption[] = [
  { value: "halal", th: "ฮาลาล", en: "Halal" },
  { value: "vegetarian", th: "มังสวิรัติ", en: "Vegetarian" },
  { value: "no_meat", th: "ไม่ทานเนื้อสัตว์", en: "No meat" },
  { value: "no_beef", th: "ไม่ทานเนื้อวัว", en: "No beef" },
  { value: "no_pork", th: "ไม่ทานเนื้อหมู", en: "No pork" },
  { value: "no_chicken", th: "ไม่ทานไก่", en: "No chicken" },
  { value: "no_spicy", th: "ไม่ทานเผ็ด", en: "No spicy food" },
  { value: "no_vegetable", th: "ไม่ทานผัก", en: "No vegetables" },
  { value: OTHER_OPTION, th: "อื่น ๆ", en: "Other" },
];

/** ท่านรู้จัก อบจ. หรือไม่ (Step 3) — same question and codes as FirstDate, so
 *  the answer carries over both ways. */
export const SGCU_AWARENESS_OPTIONS: LabeledOption[] = [
  {
    value: "aware_and_understand",
    th: "รู้จักและเข้าใจบทบาทหน้าที่ของอบจ.เป็นอย่างดี",
    en: "I know and understand the SGCU's role well",
  },
  {
    value: "aware_not_sure",
    th: "รู้จัก แต่ยังไม่แน่ใจว่าอบจ.มีบทบาทหน้าที่อย่างไร",
    en: "I know it but am unsure of the SGCU's role",
  },
  { value: "not_aware", th: "ไม่รู้จัก", en: "I don't know it" },
];

/** ท่านเห็นการประชาสัมพันธ์จากช่องทางไหนมากที่สุด (Step 3) — asked per project,
 *  so the first two codes name RPKM's own account, not FirstDate's. */
export const PR_CHANNEL_OPTIONS: LabeledOption[] = [
  {
    value: "ig_feed_rpkm",
    th: "ฟีดใน instagram ของ rubpuenkaomai2026",
    en: "Feed on rubpuenkaomai2026's Instagram",
  },
  {
    value: "ig_story_rpkm",
    th: "สตอรี่ใน instagram ของ rubpuenkaomai2026",
    en: "Story on rubpuenkaomai2026's Instagram",
  },
  {
    value: "ig_feed_sgcu",
    th: "ฟีดใน instagram ของ อบจ. (sgcu.chula)",
    en: "Feed on the SGCU's Instagram (sgcu.chula)",
  },
  {
    value: "ig_story_sgcu",
    th: "สตอรี่ใน instagram ของ อบจ. (sgcu.chula)",
    en: "Story on the SGCU's Instagram (sgcu.chula)",
  },
  {
    value: "ig_feed_faculty",
    th: "ฟีดใน instagram ของคณะ",
    en: "Feed on your faculty's Instagram",
  },
  {
    value: "ig_story_faculty",
    th: "สตอรี่ใน instagram ของคณะ",
    en: "Story on your faculty's Instagram",
  },
  {
    value: "line_faculty",
    th: "ข้อความใน line รุ่นของคณะ",
    en: "Message in your faculty class LINE",
  },
  {
    value: "line_openchat",
    th: "ข้อความใน line openchat CU110",
    en: "Message in LINE OpenChat CU110",
  },
  {
    value: "friend_referral",
    th: "เพื่อนหรือคนรู้จักส่งให้ดู",
    en: "A friend or acquaintance shared it",
  },
];

/** ท่านตั้งใจจะเข้าร่วมกิจกรรมกี่วัน (Step 3) — the value is what
 *  `registrations.attendedDays` stores, so it parses straight to an integer. */
export const ATTEND_DAYS_OPTIONS: LabeledOption[] = [
  { value: "1", th: "1 วัน", en: "1 day" },
  { value: "2", th: "2 วัน", en: "2 days" },
  { value: "3", th: "3 วัน", en: "3 days" },
];

/** เตรียมกระบอกน้ำมามั้ย (Step 3) — maps to the boolean `students.bottle`. */
export const WATER_BOTTLE_OPTIONS: LabeledOption[] = [
  { value: "yes", th: "เตรียม", en: "Brought one" },
  { value: "no", th: "ไม่ได้เตรียม", en: "Didn't bring one" },
];

/** ประเภทยานพาหนะ (Step 4) */
export const VEHICLE_OPTIONS: LabeledOption<Vehicle>[] = [
  { value: "private_car", th: "รถยนต์ส่วนบุคคล", en: "Private Car" },
  {
    value: "private_ev",
    th: "รถยนต์ไฟฟ้าส่วนบุคคล",
    en: "Private Electric Vehicle",
  },
  {
    value: "transit",
    th: "BTS/MRT/Airport Rail Link",
    en: "BTS / MRT / Airport Rail Link",
  },
  {
    value: "bus",
    th: "รถโดยสารประจำทาง / รถโดยสารไม่ประจำทาง",
    en: "Bus / Coach",
  },
  { value: "taxi", th: "แท็กซี่", en: "Taxi" },
  { value: "motorcycle", th: "รถจักรยานยนต์", en: "Motorcycle" },
  { value: "bike_walk", th: "รถจักรยาน/เดิน", en: "Bicycle or Walking" },
];

/** Max number of travel legs (ต่อ). */
export const MAX_TRAVEL_LEGS = 4;
