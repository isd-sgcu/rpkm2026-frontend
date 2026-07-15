import { useT } from "@lib/i18n/useT";
import {
  ATTEND_DAYS_OPTIONS,
  PR_CHANNEL_OPTIONS,
  SGCU_AWARENESS_OPTIONS,
  WATER_BOTTLE_OPTIONS,
} from "@lib/register-options";

import { RadioGroupField, SectionHeading } from "./fields";

export function StepOtherInfo({
  showHeading = true,
}: { showHeading?: boolean } = {}) {
  const t = useT();

  return (
    <div className="flex flex-col pb-2">
      {showHeading && (
        <SectionHeading>{t("register.sections.other")}</SectionHeading>
      )}

      <div className="mt-3 flex flex-col gap-6">
        <RadioGroupField
          name="sgcuAwareness"
          question={t("register.questions.sgcu")}
          options={SGCU_AWARENESS_OPTIONS}
        />

        <RadioGroupField
          name="prChannel"
          question={t("register.questions.pr")}
          options={PR_CHANNEL_OPTIONS}
        />

        <RadioGroupField
          name="attendDays"
          question={t("register.questions.attendDays")}
          options={ATTEND_DAYS_OPTIONS}
        />

        <RadioGroupField
          name="waterBottle"
          question={t("register.questions.water")}
          options={WATER_BOTTLE_OPTIONS}
        />
      </div>
    </div>
  );
}
