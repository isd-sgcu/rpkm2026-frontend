import { useFormContext, useWatch } from "react-hook-form";

import { DISTRICTS, PROVINCES } from "@lib/thai-geo";

import { ComboboxField, type Path, type SelectOption } from "./fields";
import type { RegisterFormValues } from "./types";

export type Option = SelectOption;

export const PROVINCE_OPTIONS: Option[] = PROVINCES.map((p) => ({
  value: String(p.id),
  label: p.name,
}));

export const districtsOf = (provinceId: string): Option[] =>
  DISTRICTS.filter((d) => String(d.provinceId) === provinceId).map((d) => ({
    value: String(d.id),
    label: d.name,
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
  const { setValue } = useFormContext<RegisterFormValues>();
  const provinceId = (useWatch({ name: provinceName }) as string) || "";

  return (
    <div className="flex flex-col gap-3">
      <ComboboxField
        name={provinceName}
        options={PROVINCE_OPTIONS}
        placeholder="เลือกจังหวัด"
        disabled={disabled}
        onAfterChange={() => setValue(districtName, "")}
      />
      <ComboboxField
        name={districtName}
        options={districtsOf(provinceId)}
        placeholder="เลือกเขต/อำเภอ"
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
      {/* TODO: i18n */}
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
      {/* TODO: i18n */}
      <span className="text-base text-foreground @min-[300px]:w-20 @min-[300px]:shrink-0 @min-[300px]:pt-2.5">
        {label}
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
