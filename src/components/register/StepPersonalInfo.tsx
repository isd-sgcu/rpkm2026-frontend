import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useStore } from "@nanostores/react";

import sparkle from "@assets/images/artboard_41.svg";
import { cn } from "@lib/utils";
import { $locale } from "@lib/i18n/locale";
import { useT } from "@lib/i18n/useT";
import { Input } from "@components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import {
  FACULTIES,
  PREFIX_OPTIONS,
  RELATION_OPTIONS,
  facultyCodeOf,
  labelOf,
} from "@lib/register-options";

import {
  ComboboxField,
  controlClass,
  FieldBlock,
  popupClass,
  SectionHeading,
  SelectField,
  TextField,
} from "./fields";
import type { RegisterFormValues } from "./types";

const FACULTY_OPTIONS = FACULTIES.map((faculty) => ({
  value: faculty.code,
  th: faculty.name,
  en: faculty.nameEn,
}));

export function StepPersonalInfo({
  showHeading = true,
  showBanner = true,
}: { showHeading?: boolean; showBanner?: boolean } = {}) {
  const t = useT();
  const { watch, setValue } = useFormContext<RegisterFormValues>();

  // Faculty is derived from the CUNET ID rather than asked for — the id itself
  // comes from the authenticated email, so both stay read-only. An id whose
  // last two digits match no faculty leaves the field editable to pick by hand.
  const derivedFaculty = facultyCodeOf(watch("studentId"));
  useEffect(() => {
    if (derivedFaculty) setValue("faculty", derivedFaculty);
  }, [derivedFaculty, setValue]);

  return (
    <div className="flex flex-col pb-2">
      {showBanner && (
        <div className="relative mt-2 mb-8 rounded-3xl bg-primary px-6 py-4 text-center">
          <img
            src={sparkle.src}
            alt=""
            aria-hidden
            className="absolute -top-2 -right-3 h-10 w-auto"
          />
          <img
            src={sparkle.src}
            alt=""
            aria-hidden
            className="absolute -bottom-3 -left-3 h-10 w-auto"
          />
          <p className="text-sm leading-relaxed text-foreground">
            {t("register.banner.pre")}
            <span className="font-bold">
              &quot;{t("register.banner.action")}&quot;
            </span>
            {t("register.banner.post")}
          </p>
        </div>
      )}

      {showHeading && (
        <SectionHeading>{t("register.sections.personal")}</SectionHeading>
      )}

      <div className="mt-3 flex flex-col gap-4">
        <NameField />

        <TextField
          name="lastName"
          label={t("register.fields.lastName")}
          placeholder={t("register.fields.lastNamePlaceholder")}
        />

        <TextField
          name="nickname"
          label={t("register.fields.nickname")}
          placeholder={t("register.fields.nicknamePlaceholder")}
        />

        <ComboboxField
          name="faculty"
          label={t("register.fields.faculty")}
          placeholder={t("register.fields.facultyPlaceholder")}
          options={FACULTY_OPTIONS}
          disabled={!!derivedFaculty}
        />

        <TextField
          name="studentId"
          label={t("register.fields.studentId")}
          placeholder={t("register.fields.studentIdPlaceholder")}
          inputMode="numeric"
          disabled
        />

        <TextField
          name="phone"
          label={t("register.fields.phone")}
          placeholder={t("register.fields.phonePlaceholder")}
          inputMode="tel"
        />
      </div>

      <SectionHeading className="mt-6">
        {t("register.sections.guardian")}
      </SectionHeading>

      <div className="mt-3 flex flex-col gap-4">
        <TextField
          name="guardianPhone"
          label={t("register.fields.guardianPhone")}
          placeholder={t("register.fields.guardianPhonePlaceholder")}
          inputMode="tel"
        />

        <SelectField
          name="guardianRelation"
          label={t("register.fields.relation")}
          placeholder={t("register.fields.relationPlaceholder")}
          options={RELATION_OPTIONS}
        />
      </div>
    </div>
  );
}

function NameField() {
  const t = useT();
  const locale = useStore($locale);
  // Without `items`, Select.Value falls back to rendering the raw enum token
  // ("mr") instead of the option's label.
  const prefixItems = Object.fromEntries(
    PREFIX_OPTIONS.map((option) => [option.value, labelOf(locale, option)]),
  );
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<RegisterFormValues>();

  return (
    <FieldBlock
      label={t("register.fields.firstName")}
      error={errors.prefix?.message ?? errors.firstName?.message}
    >
      <div className="@container">
        <div className="flex flex-col gap-3 @min-[280px]:flex-row">
          <Controller
            control={control}
            name="prefix"
            render={({ field }) => (
              <Select
                items={prefixItems}
                value={field.value ?? null}
                onValueChange={(value) => field.onChange(value)}
              >
                <SelectTrigger
                  className={cn(
                    controlClass,
                    "@min-[280px]:w-32 @min-[280px]:shrink-0",
                  )}
                  aria-invalid={!!errors.prefix}
                >
                  <SelectValue
                    placeholder={t("register.fields.prefixPlaceholder")}
                  />
                </SelectTrigger>
                <SelectContent className={popupClass}>
                  {PREFIX_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {labelOf(locale, option)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <Input
            className={cn(
              controlClass,
              "@min-[280px]:min-w-37.5 @min-[280px]:flex-1",
            )}
            placeholder={t("register.fields.firstNamePlaceholder")}
            aria-invalid={!!errors.firstName}
            {...register("firstName")}
          />
        </div>
      </div>
    </FieldBlock>
  );
}
