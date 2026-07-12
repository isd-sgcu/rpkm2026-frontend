import { useStore } from "@nanostores/react";
import { useT } from "@lib/i18n/useT";
import { $locale } from "@lib/i18n/locale";
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
  onSelect: (activity: Activity) => void;
}

export function ActivityList({ tab, onSelect }: ActivityListProps) {
  const t = useT();
  const locale = useStore($locale);

  const activities: Activity[] = walkrally[tab].map((entry) => ({
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
    <div className="flex flex-col gap-3 rounded-3xl bg-background p-4">
      <h1 className="text-center text-2xl font-bold pt-4">
        {t(`walkrally.tabs.${tab}`)}
      </h1>
      {activities.map((activity) => (
        <ActivityCard
          key={activity.name}
          activity={activity}
          accentColor={tabAccentColor[tab]}
          onClick={() => onSelect(activity)}
        />
      ))}
    </div>
  );
}
