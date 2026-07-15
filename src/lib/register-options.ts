/**
 * Select-option data for the registration form (faculties, name prefixes,
 * guardian relations).
 *
 * Faculties source: the official registrar faculty list
 * https://cas.reg.chula.ac.th/cu/general/PersonalInformation/Faculty/IndexDisplayFaculty.html
 */

import type { Prefix, Vehicle } from "./api/rpkm";

export type Faculty = {
  code: string;
  name: string;
  nameEn: string;
};

// TODO: i18n — `name` is Thai, `nameEn` is English; pick by locale when the app
// becomes bilingual (the select currently shows `name`).
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

// `value` is the backend's Postgres enum token for `students.prefix` — unlike
// the other option lists below, prefix is a real enum column, not free text,
// so the exact token must be sent on submit (see toRegistrationBody.ts).
export const PREFIX_ENUM_MAP: { value: Prefix; th: string }[] = [
  { value: "mr", th: "นาย" },
  { value: "mrs", th: "นาง" },
  { value: "ms", th: "นางสาว" },
  { value: "other", th: "อื่นๆ" },
];

// TODO: i18n — Thai-only; these are used as both the value and the label.
export const PREFIX_OPTIONS = PREFIX_ENUM_MAP.map((o) => o.th);

// TODO: i18n — Thai-only; these are used as both the value and the label.
export const RELATION_OPTIONS = [
  "บิดา",
  "มารดา",
  "พี่น้อง",
  "ญาติ",
  "อื่น ๆ",
] as const;

/** The "other" checkbox that reveals a free-text field. */
export const OTHER_OPTION = "อื่น ๆ";

// TODO: i18n — Thai-only; used as both the value and the label.
/** อาหารที่แพ้ (Step 2) */
export const FOOD_ALLERGY_OPTIONS = [
  "อาหารทะเล",
  "นม/แลกโตส",
  "แป้งสาลี",
  "ไข่",
  "ถั่ว",
  "ผงชูรส",
  OTHER_OPTION,
] as const;

// TODO: i18n — Thai-only; used as both the value and the label.
/** ข้อจำกัดด้านอาหาร (Step 2) */
export const DIETARY_OPTIONS = [
  "ฮาลาล",
  "มังสวิรัติ",
  "ไม่ทานเนื้อสัตว์",
  "ไม่ทานเนื้อวัว",
  "ไม่ทานเนื้อหมู",
  "ไม่ทานไก่",
  "ไม่ทานเผ็ด",
  "ไม่ทานผัก",
  OTHER_OPTION,
] as const;

// TODO: i18n — Thai-only; used as both the value and the label.
/** ท่านรู้จัก อบจ. หรือไม่ (Step 3) */
export const SGCU_AWARENESS_OPTIONS = [
  "รู้จักและเข้าใจบทบาทหน้าที่ของอบจ.เป็นอย่างดี",
  "รู้จัก แต่ยังไม่แน่ใจว่าอบจ.มีบทบาทหน้าที่อย่างไร",
  "ไม่รู้จัก",
] as const;

// TODO: i18n — Thai-only; used as both the value and the label.
/** ท่านเห็นการประชาสัมพันธ์จากช่องทางไหนมากที่สุด (Step 3) */
export const PR_CHANNEL_OPTIONS = [
  "ฟีดใน instagram ของ rubpuenkaomai2026",
  "สตอรี่ใน instagram ของ rubpuenkaomai2026",
  "ฟีดใน instagram ของ อบจ. (sgcu.chula)",
  "สตอรี่ใน instagram ของ อบจ. (sgcu.chula)",
  "ฟีดใน instagram ของคณะ",
  "สตอรี่ใน instagram ของคณะ",
  "ข้อความใน line รุ่นของคณะ",
  "ข้อความใน line openchat CU110",
  "เพื่อนหรือคนรู้จักส่งให้ดู",
] as const;

// TODO: i18n — Thai-only; used as both the value and the label.
/** ท่านตั้งใจจะเข้าร่วมกิจกรรมกี่วัน (Step 3) */
export const ATTEND_DAYS_OPTIONS = ["1 วัน", "2 วัน", "3 วัน"] as const;

// TODO: i18n — Thai-only; used as both the value and the label.
/** เตรียมกระบอกน้ำมามั้ย (Step 3) */
export const WATER_BOTTLE_OPTIONS = ["เตรียม", "ไม่ได้เตรียม"] as const;

// `value` is the backend's Postgres enum token for `travel_legs.vehicle` —
// a real enum column, so the exact token must be sent on submit (see
// toRegistrationBody.ts). `th` doubles as the label since it already carries
// the English name in parentheses.
export const VEHICLE_ENUM_MAP: { value: Vehicle; th: string }[] = [
  { value: "private_car", th: "รถยนต์ส่วนบุคคล (Private Car)" },
  {
    value: "private_ev",
    th: "รถยนต์ไฟฟ้าส่วนบุคคล (Private Electric Vehicle)",
  },
  { value: "transit", th: "BTS/MRT/Airport Rail Link" },
  { value: "bus", th: "รถโดยสารประจำทาง / รถโดยสารไม่ประจำทาง" },
  { value: "taxi", th: "แท็กซี่ (Taxi)" },
  { value: "motorcycle", th: "รถจักรยานยนต์ (Motorcycle)" },
  { value: "bike_walk", th: "รถจักรยาน/เดิน (Bicycle or Walking)" },
];

/** ประเภทยานพาหนะ (Step 4) */
export const VEHICLE_OPTIONS = VEHICLE_ENUM_MAP.map((o) => o.th);

/** Max number of travel legs (ต่อ). */
export const MAX_TRAVEL_LEGS = 4;

// TODO: i18n — English labels for the Thai option *values*. The stored form
// value stays Thai (backend contract); only the visible label is localized.
export const OPTION_EN: Record<string, string> = {
  // prefixes
  นาย: "Mr.",
  นาง: "Mrs.",
  นางสาว: "Ms.",
  อื่นๆ: "Other",
  // relations & the "other" checkbox
  "อื่น ๆ": "Other",
  บิดา: "Father",
  มารดา: "Mother",
  พี่น้อง: "Sibling",
  ญาติ: "Relative",
  // food allergy
  อาหารทะเล: "Seafood",
  "นม/แลกโตส": "Milk / Lactose",
  แป้งสาลี: "Wheat flour",
  ไข่: "Egg",
  ถั่ว: "Nuts",
  ผงชูรส: "MSG",
  // dietary
  ฮาลาล: "Halal",
  มังสวิรัติ: "Vegetarian",
  ไม่ทานเนื้อสัตว์: "No meat",
  ไม่ทานเนื้อวัว: "No beef",
  ไม่ทานเนื้อหมู: "No pork",
  ไม่ทานไก่: "No chicken",
  ไม่ทานเผ็ด: "No spicy food",
  ไม่ทานผัก: "No vegetables",
  // sgcu awareness
  "รู้จักและเข้าใจบทบาทหน้าที่ของอบจ.เป็นอย่างดี":
    "I know and understand the SGCU's role well",
  "รู้จัก แต่ยังไม่แน่ใจว่าอบจ.มีบทบาทหน้าที่อย่างไร":
    "I know it but am unsure of the SGCU's role",
  ไม่รู้จัก: "I don't know it",
  // pr channel
  "ฟีดใน instagram ของ rubpuenkaomai2026":
    "Feed on rubpuenkaomai2026's Instagram",
  "สตอรี่ใน instagram ของ rubpuenkaomai2026":
    "Story on rubpuenkaomai2026's Instagram",
  "ฟีดใน instagram ของ อบจ. (sgcu.chula)":
    "Feed on the SGCU's Instagram (sgcu.chula)",
  "สตอรี่ใน instagram ของ อบจ. (sgcu.chula)":
    "Story on the SGCU's Instagram (sgcu.chula)",
  "ฟีดใน instagram ของคณะ": "Feed on your faculty's Instagram",
  "สตอรี่ใน instagram ของคณะ": "Story on your faculty's Instagram",
  "ข้อความใน line รุ่นของคณะ": "Message in your faculty class LINE",
  "ข้อความใน line openchat CU110": "Message in LINE OpenChat CU110",
  เพื่อนหรือคนรู้จักส่งให้ดู: "A friend or acquaintance shared it",
  // vehicle
  "รถยนต์ส่วนบุคคล (Private Car)": "Private Car",
  "รถยนต์ไฟฟ้าส่วนบุคคล (Private Electric Vehicle)": "Private Electric Vehicle",
  "BTS/MRT/Airport Rail Link": "BTS / MRT / Airport Rail Link",
  "รถโดยสารประจำทาง / รถโดยสารไม่ประจำทาง": "Bus / Coach",
  "แท็กซี่ (Taxi)": "Taxi",
  "รถจักรยานยนต์ (Motorcycle)": "Motorcycle",
  "รถจักรยาน/เดิน (Bicycle or Walking)": "Bicycle or Walking",
  // attend days
  "1 วัน": "1 day",
  "2 วัน": "2 days",
  "3 วัน": "3 days",
  // water bottle
  เตรียม: "Brought one",
  ไม่ได้เตรียม: "Didn't bring one",
};

/** Localize a Thai option value; falls back to the Thai value itself. */
export function localizeOption(locale: "th" | "en", value: string): string {
  return locale === "en" ? (OPTION_EN[value] ?? value) : value;
}
