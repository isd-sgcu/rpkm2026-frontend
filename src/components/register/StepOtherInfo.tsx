import { useStore } from "@nanostores/react";

import { $locale } from "@lib/i18n/locale";
import { useT } from "@lib/i18n/useT";
import {
  ATTEND_DAYS_OPTIONS,
  PR_CHANNEL_OPTIONS,
  SGCU_AWARENESS_OPTIONS,
  WATER_BOTTLE_OPTIONS,
  localizeOption,
} from "@lib/register-options";

import { RadioGroupField, SectionHeading } from "./fields";

export function StepOtherInfo() {
  const t = useT();
  const locale = useStore($locale);
  const getLabel = (value: string) => localizeOption(locale, value);

  return (
    <div className="flex flex-col pb-2">
      <SectionHeading>{t("register.sections.other")}</SectionHeading>

      <div className="mt-3 flex flex-col gap-6">
        <RadioGroupField
          name="sgcuAwareness"
          question={t("register.questions.sgcu")}
          options={SGCU_AWARENESS_OPTIONS}
          getLabel={getLabel}
        />

        <RadioGroupField
          name="prChannel"
          question={t("register.questions.pr")}
          options={PR_CHANNEL_OPTIONS}
          getLabel={getLabel}
        />

        <RadioGroupField
          name="attendDays"
          question={t("register.questions.attendDays")}
          options={ATTEND_DAYS_OPTIONS}
          getLabel={getLabel}
        />

        <RadioGroupField
          name="waterBottle"
          question={t("register.questions.water")}
          options={WATER_BOTTLE_OPTIONS}
          getLabel={getLabel}
        />
      </div>
    </div>
  );
}
