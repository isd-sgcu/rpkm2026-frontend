import { useFormContext, useWatch } from "react-hook-form";

import { DISTRICTS, PROVINCES } from "@lib/thai-geo";
import { useT } from "@lib/i18n/useT";
import type { LabeledOption } from "@lib/register-options";

import { ComboboxField, type Path } from "./fields";
import type { RegisterFormValues } from "./types";

export type Option = LabeledOption;

export const PROVINCE_OPTIONS: Option[] = PROVINCES.map((p) => ({
  value: String(p.id),
  th: p.name,
  en: p.nameEn,
}));

export const districtsOf = (provinceId: string): Option[] =>
  DISTRICTS.filter((d) => String(d.provinceId) === provinceId).map((d) => ({
    value: String(d.id),
    th: d.name,
    en: d.nameEn,
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
  const { setValue } = useFormContext<RegisterFormValues>();
  const provinceId = (useWatch({ name: provinceName }) as string) || "";

  return (
    <div className="flex flex-col gap-3">
      <ComboboxField
        name={provinceName}
        options={PROVINCE_OPTIONS}
        placeholder={t("register.travel.provincePlaceholder")}
        disabled={disabled}
        onAfterChange={() => setValue(districtName, "")}
      />
      <ComboboxField
        name={districtName}
        options={districtsOf(provinceId)}
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
