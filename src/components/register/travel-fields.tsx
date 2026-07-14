import { useFormContext, useWatch } from "react-hook-form";
import { useStore } from "@nanostores/react";

import { DISTRICTS, PROVINCES } from "@lib/thai-geo";
import { $locale, type LocaleType } from "@lib/i18n/locale";
import { useT } from "@lib/i18n/useT";

import { ComboboxField, type Path, type SelectOption } from "./fields";
import type { RegisterFormValues } from "./types";

export type Option = SelectOption;

export const provinceOptions = (locale: LocaleType): Option[] =>
  PROVINCES.map((p) => ({
    value: String(p.id),
    label: locale === "en" ? p.nameEn : p.name,
  }));

export const districtsOf = (provinceId: string, locale: LocaleType): Option[] =>
  DISTRICTS.filter((d) => String(d.provinceId) === provinceId).map((d) => ({
    value: String(d.id),
    label: locale === "en" ? d.nameEn : d.name,
  }));

export function GeoPair({
  provinceName,
  districtName,
  disabled,
}: {
  provinceName: Path;
  districtName: Path;
  disabled?: boolean;
}) {
  const t = useT();
  const locale = useStore($locale);
  const { setValue } = useFormContext<RegisterFormValues>();
  const provinceId = (useWatch({ name: provinceName }) as string) || "";

  return (
    <div className="flex flex-col gap-3">
      <ComboboxField
        name={provinceName}
        options={provinceOptions(locale)}
        placeholder={t("register.travel.provincePlaceholder")}
        disabled={disabled}
        onAfterChange={() => setValue(districtName, "")}
      />
      <ComboboxField
        name={districtName}
        options={districtsOf(provinceId, locale)}
        placeholder={t("register.travel.districtPlaceholder")}
        disabled={disabled || !provinceId}
      />
    </div>
  );
}

export function SubLabel({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-2 flex items-center gap-1.5 text-base text-foreground">
      <span className="text-[20px] text-foreground">{icon}</span>
      {children}
    </div>
  );
}

export function LabelRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5 @min-[300px]:flex-row @min-[300px]:items-start @min-[300px]:gap-3">
      <span className="text-base text-foreground @min-[300px]:w-20 @min-[300px]:shrink-0 @min-[300px]:pt-2.5">
        {label}
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
