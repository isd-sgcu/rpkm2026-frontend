import { DIETARY_OPTIONS, FOOD_ALLERGY_OPTIONS } from "@lib/register-options";

import { SectionHeading } from "./fields";
import { ChecklistCard, DetailCard } from "./health-cards";

// TODO: i18n — all copy in this step is hard-coded Thai.
export function StepHealthInfo() {
  return (
    <div className="flex flex-col pb-2">
      <SectionHeading>ข้อมูลสุขภาพ</SectionHeading>

      <div className="mt-3 flex flex-col gap-4">
        <ChecklistCard
          title="อาหารที่แพ้"
          noneSubtitle="ไม่มีอาหารที่แพ้"
          options={FOOD_ALLERGY_OPTIONS}
          hasName="foodAllergyHas"
          itemsName="foodAllergyItems"
          otherName="foodAllergyOther"
          otherPlaceholder="กรอกอาหารที่แพ้..."
        />

        <ChecklistCard
          title="ข้อจำกัดด้านอาหาร"
          noneSubtitle="ไม่มีข้อจำกัดด้านอาหาร"
          options={DIETARY_OPTIONS}
          hasName="dietaryHas"
          itemsName="dietaryItems"
          otherName="dietaryOther"
          otherPlaceholder="กรอกข้อจำกัดอาหารอื่นๆ..."
        />

        <DetailCard
          title="ยาที่แพ้"
          noneSubtitle="ไม่มียาที่แพ้"
          yesSubtitle="มียาที่แพ้"
          hasName="drugAllergyHas"
          detailName="drugAllergyDetail"
          placeholder="กรอกยาที่แพ้..."
        />

        <DetailCard
          title="โรคประจำตัว"
          noneSubtitle="ไม่มีโรคประจำตัว"
          yesSubtitle="มีโรคประจำตัว"
          hasName="chronicDiseaseHas"
          detailName="chronicDiseaseDetail"
          placeholder="กรอกโรคประจำตัว..."
        />
      </div>
    </div>
  );
}
