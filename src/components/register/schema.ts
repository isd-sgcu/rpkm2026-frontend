import { z } from "zod";

import { OTHER_OPTION } from "@lib/register-options";

// TODO: i18n — validation messages are hard-coded Thai copy.

const required = (message: string) => z.string().trim().min(1, message);
const phone = z
  .string()
  .regex(/^0\d{9}$/, "เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก และขึ้นต้นด้วย 0");

export const registerSchema = z
  .object({
    // Step 1 — ข้อมูลส่วนตัว
    prefix: required("กรุณาเลือกคำนำหน้า"),
    firstName: required("กรุณากรอกชื่อจริง"),
    lastName: required("กรุณากรอกนามสกุล"),
    faculty: required("กรุณาเลือกคณะ"),
    studentId: z
      .string()
      .regex(/^69\d{8}$/, "เลขประจำตัวนิสิตต้องขึ้นต้นด้วย 69 และมี 10 หลัก"),
    phone,
    guardianPhone: phone,
    guardianRelation: required("กรุณาเลือกความสัมพันธ์"),

    // Step 2 — ข้อมูลสุขภาพ
    foodAllergyHas: z.boolean(),
    foodAllergyItems: z.array(z.string()),
    foodAllergyOther: z.string(),
    dietaryHas: z.boolean(),
    dietaryItems: z.array(z.string()),
    dietaryOther: z.string(),
    drugAllergyHas: z.boolean(),
    drugAllergyDetail: z.string(),
    chronicDiseaseHas: z.boolean(),
    chronicDiseaseDetail: z.string(),

    // Step 3 — ข้อมูลอื่น ๆ
    sgcuAwareness: required("กรุณาเลือกคำตอบ"),
    prChannel: required("กรุณาเลือกคำตอบ"),

    // Step 4 — ข้อมูลการเดินทาง
    residenceProvince: required("กรุณาเลือกจังหวัด"),
    residenceDistrict: required("กรุณาเลือกเขต/อำเภอ"),
    travelLegs: z
      .array(
        z.object({
          vehicle: required("กรุณาเลือกยานพาหนะ"),
          originProvince: required("กรุณาเลือกจังหวัด"),
          originDistrict: required("กรุณาเลือกเขต/อำเภอ"),
          // The final leg's destination is fixed to จุฬาฯ, so it isn't required
          // per-field; intermediate legs are checked in the superRefine below.
          destProvince: z.string(),
          destDistrict: z.string(),
        }),
      )
      .min(1)
      .max(4),
  })
  .superRefine((v, ctx) => {
    const need = (when: boolean, path: string, message: string) => {
      if (when) ctx.addIssue({ code: "custom", path: [path], message });
    };

    const checklists = [
      ["foodAllergyHas", "foodAllergyItems", "foodAllergyOther"],
      ["dietaryHas", "dietaryItems", "dietaryOther"],
    ] as const;
    for (const [has, items, other] of checklists) {
      if (!v[has]) continue;
      need(v[items].length === 0, items, "กรุณาเลือกอย่างน้อย 1 รายการ");
      need(
        v[items].includes(OTHER_OPTION) && v[other].trim() === "",
        other,
        "กรุณาระบุเพิ่มเติม",
      );
    }

    const details = [
      ["drugAllergyHas", "drugAllergyDetail", "กรุณากรอกยาที่แพ้"],
      ["chronicDiseaseHas", "chronicDiseaseDetail", "กรุณากรอกโรคประจำตัว"],
    ] as const;
    for (const [has, detail, message] of details) {
      need(v[has] && v[detail].trim() === "", detail, message);
    }

    // Every leg except the last must have a chosen destination (the last leg
    // always ends at จุฬาฯ, set automatically by the UI).
    v.travelLegs.forEach((leg, i) => {
      if (i === v.travelLegs.length - 1) return;
      if (leg.destProvince.trim() === "") {
        ctx.addIssue({
          code: "custom",
          path: ["travelLegs", i, "destProvince"],
          message: "กรุณาเลือกจังหวัด",
        });
      }
      if (leg.destDistrict.trim() === "") {
        ctx.addIssue({
          code: "custom",
          path: ["travelLegs", i, "destDistrict"],
          message: "กรุณาเลือกเขต/อำเภอ",
        });
      }
    });
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
