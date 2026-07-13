import { Controller, useFormContext } from "react-hook-form";

import { cn } from "@lib/utils";
import { Checkbox } from "@components/ui/checkbox";
import { Input } from "@components/ui/input";
import { OTHER_OPTION } from "@lib/register-options";

import { controlClass, FieldError, YesNoToggle } from "./fields";
import type { RegisterFormValues } from "./types";

type BoolName = {
  [K in keyof RegisterFormValues]: RegisterFormValues[K] extends boolean
    ? K
    : never;
}[keyof RegisterFormValues];
type ArrayName = {
  [K in keyof RegisterFormValues]: RegisterFormValues[K] extends string[]
    ? K
    : never;
}[keyof RegisterFormValues];
type StringName = {
  [K in keyof RegisterFormValues]: RegisterFormValues[K] extends string
    ? K
    : never;
}[keyof RegisterFormValues];

function HealthCard({
  title,
  subtitle,
  has,
  onToggle,
  children,
}: {
  title: string;
  subtitle: string;
  has: boolean;
  onToggle: (value: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-rpkm-pink/40 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {/* TODO: i18n */}
          <h3 className="text-lg font-bold text-foreground">{title}</h3>
          <p className="mt-0.5 text-sm text-[#886B71]">{subtitle}</p>
        </div>
        <YesNoToggle value={has} onChange={onToggle} />
      </div>
      {has && children}
    </div>
  );
}

export function ChecklistCard({
  title,
  noneSubtitle,
  options,
  hasName,
  itemsName,
  otherName,
  otherPlaceholder,
}: {
  title: string;
  noneSubtitle: string;
  options: readonly string[];
  hasName: BoolName;
  itemsName: ArrayName;
  otherName: StringName;
  otherPlaceholder: string;
}) {
  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<RegisterFormValues>();

  const has = watch(hasName);
  const items = watch(itemsName) ?? [];
  const showOther = items.includes(OTHER_OPTION);
  const subtitle = has ? `เลือกแล้ว ${items.length} รายการ` : noneSubtitle;
  const otherError = errors[otherName]?.message;

  return (
    <HealthCard
      title={title}
      subtitle={subtitle}
      has={has}
      onToggle={(v) => setValue(hasName, v)}
    >
      <div className="my-3 h-px bg-border" />

      <Controller
        control={control}
        name={itemsName}
        render={({ field }) => {
          const value = field.value ?? [];
          const toggle = (option: string, checked: boolean) =>
            field.onChange(
              checked
                ? [...value, option]
                : value.filter((item) => item !== option),
            );

          return (
            <div className="flex flex-wrap gap-x-4 gap-y-3">
              {options.map((option) => (
                // TODO: i18n
                <label
                  key={option}
                  className="flex cursor-pointer items-center gap-2 text-base select-none"
                >
                  <Checkbox
                    checked={value.includes(option)}
                    onCheckedChange={(checked) =>
                      toggle(option, checked === true)
                    }
                  />
                  {option}
                </label>
              ))}
            </div>
          );
        }}
      />

      <FieldError message={errors[itemsName]?.message} className="mt-2" />

      {showOther && (
        <div className="mt-3">
          <Input
            className={controlClass}
            placeholder={otherPlaceholder}
            aria-invalid={!!otherError}
            {...register(otherName)}
          />
          <FieldError message={otherError} className="mt-1" />
        </div>
      )}
    </HealthCard>
  );
}

export function DetailCard({
  title,
  noneSubtitle,
  yesSubtitle,
  hasName,
  detailName,
  placeholder,
}: {
  title: string;
  noneSubtitle: string;
  yesSubtitle: string;
  hasName: BoolName;
  detailName: StringName;
  placeholder: string;
}) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<RegisterFormValues>();

  const has = watch(hasName);
  const subtitle = has ? yesSubtitle : noneSubtitle;
  const error = errors[detailName]?.message;

  return (
    <HealthCard
      title={title}
      subtitle={subtitle}
      has={has}
      onToggle={(v) => setValue(hasName, v)}
    >
      <Input
        className={cn(controlClass, "mt-3")}
        placeholder={placeholder}
        aria-invalid={!!error}
        {...register(detailName)}
      />
      <FieldError message={error} className="mt-1" />
    </HealthCard>
  );
}
