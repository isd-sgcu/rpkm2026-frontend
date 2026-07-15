import { useEffect } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { Trash2 } from "lucide-react";

import { Button } from "@components/ui/button";
import { CHULA_DISTRICT_ID, CHULA_PROVINCE_ID } from "@lib/thai-geo";
import { MAX_TRAVEL_LEGS, VEHICLE_OPTIONS } from "@lib/register-options";
import { useT } from "@lib/i18n/useT";

import { ComboboxField, SectionHeading, SelectField } from "./fields";
import { CarIcon, HomeIcon, PinIcon } from "./icons";
import {
  districtsOf,
  GeoPair,
  LabelRow,
  PROVINCE_OPTIONS,
  SubLabel,
} from "./travel-fields";
import type { RegisterFormValues } from "./types";

type Leg = RegisterFormValues["travelLegs"][number];

const CHULA = {
  province: String(CHULA_PROVINCE_ID),
  district: String(CHULA_DISTRICT_ID),
};

export function StepTravelInfo({
  showHeading = true,
}: { showHeading?: boolean } = {}) {
  const t = useT();
  const { control, setValue } = useFormContext<RegisterFormValues>();
  const residenceProvince =
    (useWatch({ name: "residenceProvince" }) as string) || "";

  const { fields, append, remove } = useFieldArray({
    control,
    name: "travelLegs",
  });
  const legs = useWatch({ control, name: "travelLegs" }) as Leg[] | undefined;

  // always ends at จุฬาฯ (e.g. after deleting the last route).
  useEffect(() => {
    const last = fields.length - 1;
    if (last < 0) return;
    setValue(`travelLegs.${last}.destProvince`, CHULA.province);
    setValue(`travelLegs.${last}.destDistrict`, CHULA.district);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields.length]);

  useEffect(() => {
    if (!legs || legs.length === 0) return;

    legs.forEach((leg, i) => {
      if (i === 0) return;
      const originProvince = legs[i - 1].destProvince;
      const originDistrict = legs[i - 1].destDistrict;
      if (leg.originProvince !== originProvince) {
        setValue(`travelLegs.${i}.originProvince`, originProvince);
      }
      if (leg.originDistrict !== originDistrict) {
        setValue(`travelLegs.${i}.originDistrict`, originDistrict);
      }
    });
  }, [legs, setValue]);

  const addLeg = () => {
    const prevLast = fields.length - 1;
    if (prevLast >= 0) {
      // the old last leg becomes an intermediate stop — free up its destination
      setValue(`travelLegs.${prevLast}.destProvince`, "");
      setValue(`travelLegs.${prevLast}.destDistrict`, "");
    }
    append({
      vehicle: "",
      originProvince: "",
      originDistrict: "",
      destProvince: CHULA.province,
      destDistrict: CHULA.district,
    });
  };

  const canAdd = fields.length < MAX_TRAVEL_LEGS;

  return (
    <div className="flex flex-col gap-6 pb-2">
      {showHeading && (
        <SectionHeading>{t("register.sections.travel")}</SectionHeading>
      )}

      {/* residence — labels sit left, but stack above the select on narrow screens */}
      <div className="@container flex flex-col gap-3">
        <p className="text-base text-foreground">
          {t("register.travel.residenceQuestion")}
        </p>
        <LabelRow label={t("register.travel.province")}>
          <ComboboxField
            name="residenceProvince"
            options={PROVINCE_OPTIONS}
            placeholder={t("register.travel.provincePlaceholder")}
            onAfterChange={() => setValue("residenceDistrict", "")}
          />
        </LabelRow>
        <LabelRow label={t("register.travel.district")}>
          <ComboboxField
            name="residenceDistrict"
            options={districtsOf(residenceProvince)}
            placeholder={t("register.travel.districtPlaceholder")}
            disabled={!residenceProvince}
          />
        </LabelRow>
      </div>

      {/* travel legs on a timeline */}
      <div className="flex flex-col gap-3">
        <p className="text-base text-foreground">
          {t("register.travel.pattern")}
        </p>

        <div className="flex flex-col gap-6">
          {fields.map((leg, index) => (
            <TravelLegCard
              key={leg.id}
              index={index}
              isLast={index === fields.length - 1}
              canAdd={canAdd}
              onRemove={() => remove(index)}
            />
          ))}

          {canAdd && (
            <div className="relative pl-6">
              <span className="absolute top-4.25 left-0 size-2.5 rounded-full bg-rpkm-red" />
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="h-11 w-full rounded-full border-rpkm-blue bg-background text-rpkm-red"
                onClick={addLeg}
              >
                {t("register.travel.addLeg")}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TravelLegCard({
  index,
  isLast,
  canAdd,
  onRemove,
}: {
  index: number;
  isLast: boolean;
  canAdd: boolean;
  onRemove: () => void;
}) {
  const t = useT();
  const lineToNext = isLast && !canAdd ? null : isLast ? 46 : 35;

  return (
    <div className="relative pl-6">
      {lineToNext != null && (
        <span
          className="absolute top-2.75 left-1 w-0.5 bg-rpkm-blue"
          style={{ bottom: -lineToNext }}
        />
      )}
      <span className="absolute top-1.5 left-0 size-2.5 rounded-full bg-rpkm-red" />

      <div className="flex items-center justify-between gap-2">
        <span className="font-bold text-rpkm-red">
          {t("register.travel.leg", { index: String(index + 1) })}
        </span>
        {index > 0 && (
          <button
            type="button"
            onClick={onRemove}
            className="flex shrink-0 items-center gap-1 rounded-full border border-rpkm-red px-2.5 py-1 text-sm text-rpkm-red"
          >
            <Trash2 className="size-3.5" />
            {t("register.travel.removeLeg")}
          </button>
        )}
      </div>

      <div className="mt-3">
        <SubLabel icon={<CarIcon />}>{t("register.travel.vehicle")}</SubLabel>
        <SelectField
          name={`travelLegs.${index}.vehicle`}
          options={VEHICLE_OPTIONS}
          placeholder={t("register.travel.vehiclePlaceholder")}
        />
      </div>

      <div className="mt-3">
        <SubLabel icon={<HomeIcon />}>{t("register.travel.origin")}</SubLabel>
        <GeoPair
          provinceName={`travelLegs.${index}.originProvince`}
          districtName={`travelLegs.${index}.originDistrict`}
          disabled={index > 0}
        />
      </div>

      <div className="mt-3">
        <SubLabel icon={<PinIcon />}>{t("register.travel.dest")}</SubLabel>
        <GeoPair
          provinceName={`travelLegs.${index}.destProvince`}
          districtName={`travelLegs.${index}.destDistrict`}
          disabled={isLast}
        />
      </div>
    </div>
  );
}
