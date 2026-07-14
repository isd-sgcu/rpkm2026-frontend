import { useStore } from "@nanostores/react";

import { $locale } from "@lib/i18n/locale";
import { useT } from "@lib/i18n/useT";
import {
  DIETARY_OPTIONS,
  FOOD_ALLERGY_OPTIONS,
  localizeOption,
} from "@lib/register-options";

import { SectionHeading } from "./fields";
import { ChecklistCard, DetailCard } from "./health-cards";

export function StepHealthInfo() {
  const t = useT();
  const locale = useStore($locale);
  const getLabel = (value: string) => localizeOption(locale, value);

  return (
    <div className="flex flex-col pb-2">
      <SectionHeading>{t("register.sections.health")}</SectionHeading>

      <div className="mt-3 flex flex-col gap-4">
        <ChecklistCard
          title={t("register.health.foodAllergy.title")}
          noneSubtitle={t("register.health.foodAllergy.none")}
          options={FOOD_ALLERGY_OPTIONS}
          getLabel={getLabel}
          hasName="foodAllergyHas"
          itemsName="foodAllergyItems"
          otherName="foodAllergyOther"
          otherPlaceholder={t("register.health.foodAllergy.placeholder")}
        />

        <ChecklistCard
          title={t("register.health.dietary.title")}
          noneSubtitle={t("register.health.dietary.none")}
          options={DIETARY_OPTIONS}
          getLabel={getLabel}
          hasName="dietaryHas"
          itemsName="dietaryItems"
          otherName="dietaryOther"
          otherPlaceholder={t("register.health.dietary.placeholder")}
        />

        <DetailCard
          title={t("register.health.drugAllergy.title")}
          noneSubtitle={t("register.health.drugAllergy.none")}
          yesSubtitle={t("register.health.drugAllergy.yes")}
          hasName="drugAllergyHas"
          detailName="drugAllergyDetail"
          placeholder={t("register.health.drugAllergy.placeholder")}
        />

        <DetailCard
          title={t("register.health.chronic.title")}
          noneSubtitle={t("register.health.chronic.none")}
          yesSubtitle={t("register.health.chronic.yes")}
          hasName="chronicDiseaseHas"
          detailName="chronicDiseaseDetail"
          placeholder={t("register.health.chronic.placeholder")}
        />
      </div>
    </div>
  );
}
