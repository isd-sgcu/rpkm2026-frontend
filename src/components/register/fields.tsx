import {
  Controller,
  useFormContext,
  type FieldErrors,
  type FieldPath,
} from "react-hook-form";
import { Combobox } from "@base-ui/react/combobox";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@lib/utils";
import { useT } from "@lib/i18n/useT";
import { Input } from "@components/ui/input";
import { RadioGroup, RadioGroupItem } from "@components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";

import type { RegisterFormValues } from "./types";

type FieldName = {
  [K in keyof RegisterFormValues]: RegisterFormValues[K] extends string
    ? K
    : never;
}[keyof RegisterFormValues];
export type Path = FieldPath<RegisterFormValues>;
export type SelectOption = { value: string; label: string };

export const controlClass =
  "h-11 w-full rounded-xl border border-rpkm-grey bg-transparent px-5 text-base text-black data-[size=default]:h-11 " +
  "disabled:cursor-not-allowed disabled:border-border/60 disabled:bg-border/20 data-disabled:cursor-not-allowed data-disabled:border-border/60 data-disabled:bg-border/20";

export const popupClass = "min-w-0";

export function errorAt(errors: FieldErrors<RegisterFormValues>, name: string) {
  const node = name
    .split(".")
    .reduce<unknown>(
      (acc, key) => (acc as Record<string, unknown>)?.[key],
      errors,
    );
  return (node as { message?: string })?.message;
}

export function FieldError({
  message,
  className,
}: {
  message?: string;
  className?: string;
}) {
  if (!message) return null;
  return (
    <span className={cn("block text-sm text-destructive", className)}>
      {message}
    </span>
  );
}

export function FieldBlock({
  label,
  error,
  children,
}: {
  label?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-base font-normal text-foreground">{label}</label>
      )}
      {children}
      <FieldError message={error} />
    </div>
  );
}

export function SectionHeading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2 className={cn("text-2xl font-bold text-secondary", className)}>
      {children}
    </h2>
  );
}

export function TextField<TName extends FieldName>({
  name,
  label,
  placeholder,
  inputMode,
}: {
  name: TName;
  label: string;
  placeholder: string;
  inputMode?: React.ComponentProps<"input">["inputMode"];
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext<RegisterFormValues>();

  return (
    <FieldBlock label={label} error={errors[name]?.message}>
      <Input
        className={controlClass}
        placeholder={placeholder}
        inputMode={inputMode}
        aria-invalid={!!errors[name]}
        {...register(name)}
      />
    </FieldBlock>
  );
}

export function SelectField({
  name,
  label,
  placeholder,
  options,
  disabled,
  onAfterChange,
}: {
  name: Path;
  label?: string;
  placeholder: string;
  options: readonly SelectOption[] | readonly string[];
  disabled?: boolean;
  onAfterChange?: () => void;
}) {
  const {
    control,
    formState: { errors },
  } = useFormContext<RegisterFormValues>();
  const error = errorAt(errors, name);
  const normalized = options.map((option) =>
    typeof option === "string" ? { value: option, label: option } : option,
  );
  const items = Object.fromEntries(normalized.map((o) => [o.value, o.label]));

  return (
    <FieldBlock label={label} error={error}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            items={items}
            value={(field.value as string) || null}
            onValueChange={(value) => {
              field.onChange(value ?? "");
              onAfterChange?.();
            }}
            disabled={disabled}
          >
            <SelectTrigger
              className={cn(controlClass, "w-full")}
              aria-invalid={!!error}
              disabled={disabled}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className={popupClass}>
              {normalized.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </FieldBlock>
  );
}

/** A searchable single-select (base-ui Combobox) bound to a form field by path.
 *  Good when there are many options — the user types to filter by label. */
export function ComboboxField({
  name,
  label,
  placeholder,
  options,
  disabled,
  onAfterChange,
}: {
  name: Path;
  label?: string;
  placeholder: string;
  options: readonly SelectOption[];
  disabled?: boolean;
  onAfterChange?: () => void;
}) {
  const t = useT();
  const {
    control,
    formState: { errors },
  } = useFormContext<RegisterFormValues>();
  const error = errorAt(errors, name);
  const values = options.map((option) => option.value);
  const labelFor = (value: string) =>
    options.find((option) => option.value === value)?.label ?? "";

  return (
    <FieldBlock label={label} error={error}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Combobox.Root
            items={values}
            itemToStringLabel={labelFor}
            value={(field.value as string) || null}
            onValueChange={(value) => {
              field.onChange(value ?? "");
              onAfterChange?.();
            }}
            openOnInputClick
            disabled={disabled}
          >
            <div className="relative">
              <Combobox.Input
                placeholder={placeholder}
                aria-invalid={!!error}
                onBlur={field.onBlur}
                disabled={disabled}
                className={cn(controlClass, "pr-9")}
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted-foreground">
                <ChevronDownIcon className="size-4" />
              </span>
            </div>
            <Combobox.Portal>
              <Combobox.Positioner sideOffset={4} className="isolate z-50">
                <Combobox.Popup className="max-h-(--available-height) w-(--anchor-width) overflow-y-auto rounded-lg border bg-popover p-1 text-popover-foreground shadow-xl ring-1 ring-foreground/10">
                  <Combobox.Empty className="px-2 py-2 text-sm text-muted-foreground">
                    {t("register.combobox.empty")}
                  </Combobox.Empty>
                  <Combobox.List>
                    {(item: string) => (
                      <Combobox.Item
                        key={item}
                        value={item}
                        className="flex cursor-default items-center rounded-md px-2 py-1.5 text-base outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-selected:font-bold"
                      >
                        {labelFor(item)}
                      </Combobox.Item>
                    )}
                  </Combobox.List>
                </Combobox.Popup>
              </Combobox.Positioner>
            </Combobox.Portal>
          </Combobox.Root>
        )}
      />
    </FieldBlock>
  );
}

export function YesNoToggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  const t = useT();
  const segment = (active: boolean) =>
    cn(
      "rounded-full px-4 py-2 text-sm leading-none transition-colors",
      active ? "bg-rpkm-red font-bold text-background" : "text-rpkm-red",
    );

  return (
    <div className="inline-flex shrink-0 items-center rounded-full border border-rpkm-red">
      <button
        type="button"
        onClick={() => onChange(false)}
        className={segment(!value)}
      >
        {t("register.health.no")}
      </button>
      <button
        type="button"
        onClick={() => onChange(true)}
        className={segment(value)}
      >
        {t("register.health.yes")}
      </button>
    </div>
  );
}

/** A single-choice radio question wired to the shared form. */
export function RadioGroupField<TName extends FieldName>({
  name,
  question,
  options,
  getLabel = (value) => value,
}: {
  name: TName;
  question: string;
  options: readonly string[];
  getLabel?: (value: string) => string;
}) {
  const {
    control,
    trigger,
    formState: { errors },
  } = useFormContext<RegisterFormValues>();
  const error = errors[name]?.message;

  return (
    <div className="flex flex-col gap-3">
      {/* TODO: i18n */}
      <p className="text-base text-foreground">{question}</p>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <RadioGroup
            value={field.value || null}
            onValueChange={(value) => {
              field.onChange(value ?? "");
              if (error) void trigger(name);
            }}
            aria-invalid={!!error}
            className="gap-3"
          >
            {options.map((option) => (
              // TODO: i18n
              <label
                key={option}
                className="flex cursor-pointer items-center gap-3 select-none"
              >
                <RadioGroupItem value={option} aria-invalid={!!error} />
                <span className="text-sm">{getLabel(option)}</span>
              </label>
            ))}
          </RadioGroup>
        )}
      />
      {error && <span className="text-sm text-destructive">{error}</span>}
    </div>
  );
}
