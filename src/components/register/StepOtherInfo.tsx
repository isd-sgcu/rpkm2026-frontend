import {
  PR_CHANNEL_OPTIONS,
  SGCU_AWARENESS_OPTIONS,
} from "@lib/register-options";

import { RadioGroupField, SectionHeading } from "./fields";

// TODO: i18n — all copy in this step is hard-coded Thai.
export function StepOtherInfo() {
  return (
    <div className="flex flex-col pb-2">
      <SectionHeading>ข้อมูลอื่น ๆ</SectionHeading>

      <div className="mt-3 flex flex-col gap-6">
        <RadioGroupField
          name="sgcuAwareness"
          question="ท่านรู้จัก องค์การบริหารสโมสรนิสิตจุฬาฯ (อบจ.) หรือไม่"
          options={SGCU_AWARENESS_OPTIONS}
        />

        <RadioGroupField
          name="prChannel"
          question="ท่านเห็นการประชาสัมพันธ์โครงการจากช่องทางไหนมากที่สุด"
          options={PR_CHANNEL_OPTIONS}
        />
      </div>
    </div>
  );
}
