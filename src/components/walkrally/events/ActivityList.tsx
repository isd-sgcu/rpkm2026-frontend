import { useStore } from "@nanostores/react";
import { $locale } from "@lib/i18n/locale";
import { MonotoneNoiseContainer } from "@components/shared/MonotoneNoise";
import {
  ActivityCard,
  type Activity,
} from "@components/walkrally/events/ActivityCard";
import { MinigamePanel } from "@components/walkrally/events/MinigamePanel";
import type { Tab } from "@components/walkrally/events/ActivityTabs";
import walkrally from "@components/walkrally/events/events.json";
import { getImageUrl } from "@lib/function";

const tabAccentColor: Record<Tab, string> = {
  workshop: "#e65325",
  walkingTour: "#5fa667",
  minigame: "#8b688d",
};

interface ActivityListProps {
  tab: Tab;
}

export function ActivityList({ tab }: ActivityListProps) {
  const locale = useStore($locale);
  const header = getImageUrl(`walkrally_${tab}.svg`);

  const activities: Activity[] = walkrally[tab].map((entry) => ({
    id: entry.id,
    name:
      locale === "th"
        ? "nameTh" in entry
          ? entry.nameTh
          : ""
        : "nameEn" in entry
          ? entry.nameEn
          : "",
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
    <MonotoneNoiseContainer className="flex flex-col gap-4 rounded-3xl bg-rpkm-light-green p-4 border border-black">
      <div className="w-full flex justify-center py-2">
        <img src={header} alt={`walkrally_${tab}`} className="size-24" />
      </div>
      {tab === "minigame" ? (
        <MinigamePanel />
      ) : (
        activities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            accentColor={tabAccentColor[tab]}
          />
        ))
      )}
    </MonotoneNoiseContainer>
  );
}
