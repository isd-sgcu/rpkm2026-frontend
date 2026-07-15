import { useStore } from "@nanostores/react";

import { $locale } from "@lib/i18n/locale";
import { useT } from "@lib/i18n/useT";
import type { ProfileResult } from "@lib/api/rpkm";
import { StepPersonalInfo } from "@components/register/StepPersonalInfo";
import { StepHealthInfo } from "@components/register/StepHealthInfo";
import { StepTravelInfo } from "@components/register/StepTravelInfo";

import { EditSectionDialog } from "./EditSectionDialog";
import {
  dietaryLabels,
  facultyLabel,
  foodAllergyLabels,
  placeLabel,
  prefixLabel,
  relationLabel,
  vehicleLabel,
} from "./display";
import { parseAllergies } from "./fromProfile";

const DASH = "-";

function SectionShell({
  title,
  editButton,
  children,
}: {
  title: string;
  editButton: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6 min-w-0">
      <div className="flex items-center justify-between gap-2">
        <h2 className="min-w-0 text-xl font-bold text-secondary">{title}</h2>
        {editButton}
      </div>
      <div className="mt-2 overflow-hidden rounded-2xl border border-rpkm-grey p-4">
        {children}
      </div>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-sm text-muted-foreground wrap-anywhere">{label}</p>
      <p className="mt-0.5 text-foreground wrap-anywhere">{value || DASH}</p>
    </div>
  );
}

function Chips({ items }: { items: string[] }) {
  if (items.length === 0)
    return <span className="text-foreground">{DASH}</span>;
  return (
    <div className="mt-0.5 flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full border border-rpkm-grey px-3 py-1 text-sm text-foreground"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export function PersonalCard({ profile }: { profile: ProfileResult }) {
  const t = useT();
  const locale = useStore($locale);
  const { user } = profile;
  const fullName =
    `${prefixLabel(locale, user.prefix)}${user.firstName} ${user.lastName}`.trim();

  return (
    <SectionShell
      title={t("editProfile.personal.title")}
      editButton={
        <EditSectionDialog
          section="personal"
          title={t("editProfile.personal.title")}
          profile={profile}
          body={<StepPersonalInfo showHeading={false} showBanner={false} />}
        />
      }
    >
      <div className="grid grid-cols-2 gap-x-4 gap-y-4">
        <Field label={t("editProfile.personal.realName")} value={fullName} />
        <Field
          label={t("editProfile.personal.studentId")}
          value={user.studentId}
        />
        <Field
          label={t("editProfile.personal.faculty")}
          value={facultyLabel(locale, user.faculty)}
        />
        <Field
          label={t("editProfile.personal.phone")}
          value={user.phone ?? ""}
        />
        <Field
          label={t("editProfile.personal.guardianPhone")}
          value={user.emergencyContactPhone ?? ""}
        />
        <Field
          label={t("editProfile.personal.relation")}
          value={relationLabel(locale, user.emergencyContactName)}
        />
      </div>
    </SectionShell>
  );
}

export function HealthCard({ profile }: { profile: ProfileResult }) {
  const t = useT();
  const locale = useStore($locale);
  const { user } = profile;
  const { food, drug } = parseAllergies(user.allergies);
  const foodItems = foodAllergyLabels(locale, food);
  const dietaryItems = dietaryLabels(locale, user.dietary);

  return (
    <SectionShell
      title={t("editProfile.health.title")}
      editButton={
        <EditSectionDialog
          section="health"
          title={t("editProfile.health.title")}
          profile={profile}
          body={<StepHealthInfo showHeading={false} />}
        />
      }
    >
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {t("editProfile.health.foodAllergy")}
          </p>
          <Chips items={foodItems} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">
            {t("editProfile.health.dietary")}
          </p>
          <Chips items={dietaryItems} />
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-4">
          <Field label={t("editProfile.health.drugAllergy")} value={drug} />
          <Field
            label={t("editProfile.health.chronicDisease")}
            value={user.medicalNotes ?? ""}
          />
        </div>
      </div>
    </SectionShell>
  );
}

export function TravelCard({ profile }: { profile: ProfileResult }) {
  const t = useT();
  const locale = useStore($locale);
  const { user, travelLegs } = profile;
  const legs = [...travelLegs].sort((a, b) => a.seq - b.seq);
  const residence = placeLabel(locale, user.csoProvince, user.csoDistrict);

  return (
    <SectionShell
      title={t("editProfile.travel.title")}
      editButton={
        <EditSectionDialog
          section="travel"
          title={t("editProfile.travel.title")}
          profile={profile}
          body={<StepTravelInfo showHeading={false} />}
        />
      }
    >
      <div className="flex flex-col gap-4">
        <Field label={t("editProfile.travel.residence")} value={residence} />
        <div>
          <p className="text-sm text-muted-foreground">
            {t("editProfile.travel.legsIntro")}
          </p>
          <div className="mt-2 flex flex-col gap-4">
            {legs.map((leg) => (
              <div key={leg.seq}>
                <p className="font-bold text-rpkm-red">
                  {t("editProfile.travel.legLabel", {
                    index: String(leg.seq),
                  })}
                </p>
                <div className="mt-1 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
                  <span className="text-muted-foreground">
                    {t("editProfile.travel.vehicle")}
                  </span>
                  <span className="min-w-0 text-foreground wrap-anywhere">
                    {vehicleLabel(locale, leg.vehicle)}
                  </span>
                  <span className="text-muted-foreground">
                    {t("editProfile.travel.origin")}
                  </span>
                  <span className="min-w-0 text-foreground wrap-anywhere">
                    {placeLabel(locale, leg.originProvince, leg.originDistrict)}
                  </span>
                  <span className="text-muted-foreground">
                    {t("editProfile.travel.destination")}
                  </span>
                  <span className="min-w-0 text-foreground wrap-anywhere">
                    {placeLabel(
                      locale,
                      leg.destinationProvince,
                      leg.destinationDistrict,
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
