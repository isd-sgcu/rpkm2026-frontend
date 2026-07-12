import { useStore } from "@nanostores/react";
import { useT } from "@lib/i18n/useT";
import { $locale } from "@lib/i18n/locale";
import { MonotoneNoiseContainer } from "@components/shared/MonotoneNoise";
import {
  ActivityCard,
  type Activity,
} from "@components/walkrally/ActivityCard";
import type { Tab } from "@components/walkrally/ActivityTabs";
import walkrally from "@components/walkrally/walkrally.json";

const tabAccentColor: Record<Tab, string> = {
  workshop: "#e65325",
  walkingTour: "#5fa667",
  minigame: "#8b688d",
};

interface ActivityListProps {
  tab: Tab;
}

export function ActivityList({ tab }: ActivityListProps) {
  const t = useT();
  const locale = useStore($locale);

  const activities: Activity[] = walkrally[tab].map((entry) => ({
    id: entry.id,
    name: locale === "th" ? entry.nameTh : entry.nameEn,
    description:
      locale === "th"
        ? "descriptionTh" in entry
          ? entry.descriptionTh
          : undefined
        : "descriptionEn" in entry
          ? entry.descriptionEn
          : undefined,
    imageName: "imageName" in entry ? entry.imageName : undefined,
  }));

  return (
    <MonotoneNoiseContainer className="flex flex-col gap-3 rounded-3xl bg-[#e3ffe7] p-4 border border-black">
      <h1 className="text-center text-2xl font-bold pt-4">
        {t(`walkrally.tabs.${tab}`)}
      </h1>
      {activities.map((activity) => (
        <ActivityCard
          key={activity.id}
          activity={activity}
          accentColor={tabAccentColor[tab]}
        />
      ))}
    </MonotoneNoiseContainer>
  );
}
