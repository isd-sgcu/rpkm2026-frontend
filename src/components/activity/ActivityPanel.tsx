import { FieldTripCard, type FieldTripActivity } from "./ActivityCard";
import { useT } from "@lib/i18n/useT";

const ActivityPanel = () => {
  const t = useT();

  // Add more cards later by appending activities to this list.
  const activities: FieldTripActivity[] = [
    {
      id: "field-trip-1",
      title: t("activity.cards.fieldTrip.title"),
      description: t("activity.cards.fieldTrip.description"),
      registrationText: t("activity.cards.fieldTrip.registrationText"),
      activityText: t("activity.cards.fieldTrip.activityText"),
      detailsUrl: "./activity/fieldtrip",
    },
    {
      id: "field-trip-2",
      title: t("activity.cards.walkRally.title"),
      description: t("activity.cards.walkRally.description"),
      registrationText: t("activity.cards.walkRally.registrationText"),
      activityText: t("activity.cards.walkRally.activityText"),
      detailsUrl: "../walkrally",
      // 22 Jul 2026 00:00 (+07) === 21 Jul 2026 17:00 UTC
      detailsUnlockUtc: Date.UTC(2026, 6, 21, 17, 0, 0),
    },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-75">
        <header className="relative z-10 text-center">
          <h1 className="text-3xl font-bold">{t("activity.title")}</h1>
        </header>
        <section className="relative z-10 mt-8 gap-6 flex flex-col items-center">
          {activities.map((activity) => (
            <FieldTripCard key={activity.id} activity={activity} />
          ))}
        </section>
      </div>
    </div>
  );
};

export default ActivityPanel;
