import { useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStore } from "@nanostores/react";

import rpkmLogo from "@assets/images/rpkm_logo.png";
import { Button } from "@components/ui/button";
import { $locale } from "@lib/i18n/locale";
import { useT } from "@lib/i18n/useT";
import { RegisterStepper } from "./RegisterStepper";
import { StepPersonalInfo } from "./StepPersonalInfo";
import { StepHealthInfo } from "./StepHealthInfo";
import { StepOtherInfo } from "./StepOtherInfo";
import { StepTravelInfo } from "./StepTravelInfo";
import { StepPdpa } from "./StepPdpa";
import { makeRegisterSchema } from "./schema";
import { CHULA_DISTRICT_ID, CHULA_PROVINCE_ID } from "@lib/thai-geo";
import { STEP_FIELDS, TOTAL_STEPS, type RegisterFormValues } from "./types";

export function RegisterPanel() {
  const t = useT();
  const locale = useStore($locale);
  const [step, setStep] = useState(1);
  const [showPdpa, setShowPdpa] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const schema = useMemo(() => makeRegisterSchema(t), [locale]);

  const methods = useForm<RegisterFormValues>({
    mode: "onTouched",
    resolver: zodResolver(schema),
    defaultValues: {
      // Step 1
      prefix: "",
      firstName: "",
      lastName: "",
      faculty: "",
      studentId: "",
      phone: "",
      guardianPhone: "",
      guardianRelation: "",
      // Step 2
      foodAllergyHas: false,
      foodAllergyItems: [],
      foodAllergyOther: "",
      dietaryHas: false,
      dietaryItems: [],
      dietaryOther: "",
      drugAllergyHas: false,
      drugAllergyDetail: "",
      chronicDiseaseHas: false,
      chronicDiseaseDetail: "",
      // Step 3
      sgcuAwareness: "",
      prChannel: "",
      attendDays: "",
      waterBottle: "",
      // Step 4 — first leg ends at จุฬาฯ by default
      residenceProvince: "",
      residenceDistrict: "",
      travelLegs: [
        {
          vehicle: "",
          originProvince: "",
          originDistrict: "",
          destProvince: String(CHULA_PROVINCE_ID),
          destDistrict: String(CHULA_DISTRICT_ID),
        },
      ],
    },
  });

  const { trigger, handleSubmit } = methods;

  const goNext = async () => {
    const valid = await trigger(STEP_FIELDS[step]);
    if (!valid) return;

    if (step < TOTAL_STEPS) {
      setStep((prev) => prev + 1);
      return;
    }

    setShowPdpa(true);
  };

  const goBack = () => setStep((prev) => Math.max(1, prev - 1));

  const submitAll = () =>
    handleSubmit((data) => {
      // TODO: send to backend once the register endpoint is ready.
      console.log(JSON.stringify(data, null, 2));
    })();

  if (showPdpa) {
    return (
      <FormProvider {...methods}>
        <StepPdpa onConsent={submitAll} />
      </FormProvider>
    );
  }

  return (
    <FormProvider {...methods}>
      <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col">
        <div className="mt-6 shrink-0 px-6">
          <img
            src={rpkmLogo.src}
            alt={t("register.logoAlt")}
            className="mx-auto h-auto w-36"
          />
          <h1 className="mt-2 text-center text-2xl font-bold text-foreground">
            {t("register.title")}
          </h1>
          <div className="mt-6">
            <RegisterStepper current={step} total={TOTAL_STEPS} />
          </div>
        </div>

        <form
          onSubmit={(event) => event.preventDefault()}
          noValidate
          className="no-scrollbar mt-6 min-h-0 w-full min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-6"
        >
          {step === 1 && <StepPersonalInfo />}
          {step === 2 && <StepHealthInfo />}
          {step === 3 && <StepOtherInfo />}
          {step === 4 && <StepTravelInfo />}
        </form>

        <div className="flex shrink-0 gap-3 px-6 pt-4 pb-10">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-14 flex-2 rounded-full bg-background text-lg"
              onClick={goBack}
            >
              {t("register.back")}
            </Button>
          )}
          <Button
            type="button"
            size="lg"
            className="h-14 flex-2 rounded-full text-lg"
            onClick={goNext}
          >
            {step < TOTAL_STEPS ? t("register.next") : t("register.confirm")}
          </Button>
        </div>
      </div>
    </FormProvider>
  );
}
