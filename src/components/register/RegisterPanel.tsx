import { useEffect, useMemo, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStore } from "@nanostores/react";

import rpkmLogo from "@assets/images/rpkm_logo.png";
import { Button } from "@components/ui/button";
import { $locale } from "@lib/i18n/locale";
import { useT } from "@lib/i18n/useT";
import { getProfile, registerRpkm } from "@lib/api/rpkm";
import { useSession } from "@lib/auth/useSession";
import { useProfile } from "@lib/auth/useProfile";
import { APIError } from "@lib/client";
import { RegisterStepper } from "./RegisterStepper";
import { StepPersonalInfo } from "./StepPersonalInfo";
import { StepHealthInfo } from "./StepHealthInfo";
import { StepOtherInfo } from "./StepOtherInfo";
import { StepTravelInfo } from "./StepTravelInfo";
import { StepPdpa } from "./StepPdpa";
import { makeRegisterSchema } from "./schema";
import { prefillFromMeUser } from "./prefill";
import { toRegistrationBody } from "./toRegistrationBody";
import { CHULA_DISTRICT_ID, CHULA_PROVINCE_ID } from "@lib/thai-geo";
import { STEP_FIELDS, TOTAL_STEPS, type RegisterFormValues } from "./types";

// Mirrors the backend's deriveStudentId (src/utils/student.ts) so the field
// shown here always matches the studentId the server actually derives itself.
const deriveStudentId = (email: string) =>
  (email.split("@")[0] || email).toLowerCase();

function submitErrorKey(status: number) {
  switch (status) {
    case 400:
      return "register.error.badRequest" as const;
    case 403:
      return "register.error.forbidden" as const;
    case 409:
      return "register.error.alreadyRegistered" as const;
    default:
      return "register.error.generic" as const;
  }
}

export function RegisterPanel() {
  const t = useT();
  const locale = useStore($locale);
  const [step, setStep] = useState(1);
  const [showPdpa, setShowPdpa] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
      nickname: "",
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

  const { trigger, handleSubmit, setValue } = methods;

  const session = useSession();
  useEffect(() => {
    if (session.status === "authenticated") {
      setValue("studentId", deriveStudentId(session.user.email));
    }
  }, [session.status, setValue]);

  const profile = useProfile();
  const prefilled = useRef(false);
  useEffect(() => {
    if (prefilled.current) return;
    if (profile.status !== "ready" || profile.me.registered) return;
    prefilled.current = true;

    getProfile()
      .then(({ user }) => {
        const values = prefillFromMeUser(user);
        for (const [key, value] of Object.entries(values)) {
          setValue(key as keyof RegisterFormValues, value as never, {
            shouldDirty: false,
          });
        }
      })
      .catch(() => {
        // Prefill is a convenience — leave the form blank on failure.
      });
  }, [profile.status, setValue]);

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
    handleSubmit(async (data) => {
      setIsSubmitting(true);
      setSubmitError(null);
      try {
        await registerRpkm(toRegistrationBody(data));
        window.location.href = "/";
      } catch (err) {
        const key =
          err instanceof APIError
            ? submitErrorKey(err.status)
            : "register.error.generic";
        setSubmitError(t(key));
        setIsSubmitting(false);
      }
    })();

  if (showPdpa) {
    return (
      <FormProvider {...methods}>
        <StepPdpa
          onConsent={submitAll}
          isSubmitting={isSubmitting}
          errorMessage={submitError}
        />
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
