/**
 * Select-option data for the registration form (faculties, name prefixes,
 * guardian relations).
 *
 * Faculties source: the official registrar faculty list
 * https://cas.reg.chula.ac.th/cu/general/PersonalInformation/Faculty/IndexDisplayFaculty.html
 */

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

// TODO: i18n — Thai-only; these are used as both the value and the label.
export const PREFIX_OPTIONS = ["นาย", "นาง", "นางสาว", "อื่นๆ"] as const;

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
  "ฟีดใน instagram ของ cu.firstdate2026",
  "สตอรี่ใน instagram ของ cu.firstdate2026",
  "ฟีดใน instagram ของ อบจ. (sgcu.chula)",
  "สตอรี่ใน instagram ของ อบจ. (sgcu.chula)",
  "ฟีดใน instagram ของคณะ",
  "สตอรี่ใน instagram ของคณะ",
  "ข้อความใน line รุ่นของคณะ",
  "ข้อความใน line openchat CU110",
  "เพื่อนหรือคนรู้จักส่งให้ดู",
] as const;

// TODO: i18n — Thai + English labels; used as both the value and the label.
/** ประเภทยานพาหนะ (Step 4) */
export const VEHICLE_OPTIONS = [
  "รถยนต์ส่วนบุคคล (Private Car)",
  "รถยนต์ไฟฟ้าส่วนบุคคล (Private Electric Vehicle)",
  "BTS/MRT/Airport Rail Link",
  "รถโดยสารประจำทาง / รถโดยสารไม่ประจำทาง",
  "แท็กซี่ (Taxi)",
  "รถจักรยานยนต์ (Motorcycle)",
  "รถจักรยาน/เดิน (Bicycle or Walking)",
] as const;

/** Max number of travel legs (ต่อ). */
export const MAX_TRAVEL_LEGS = 4;
