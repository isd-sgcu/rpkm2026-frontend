import { useQuery } from "@tanstack/react-query";
import { useStore } from "@nanostores/react";
import { Plus } from "lucide-react";
import { useT } from "@lib/i18n/useT";
import { $locale } from "@lib/i18n/locale";
import { MonotoneNoise } from "@components/shared/MonotoneNoise";
import { QueryProvider } from "@components/shared/QueryProvider";
import { RegisteredActivityCard } from "@components/walkrally/RegisteredActivityCard";
import { getMe } from "@lib/api/rpkm";
import { getWalkRallyMe } from "@lib/api/walkrally";
import { MINIGAME_ACTIVITY_CODE } from "@components/walkrally/events/minigameActivity";

import events from "@components/walkrally/events/events.json";

const ACCENT_ORANGE = "#e65325";

const tabAccentColor: Record<string, string> = {
  workshop: "#e65325",
  walkingTour: "#5fa667",
  minigame: "#8b688d",
};

export function WalkRallyHomePanel() {
  return (
    <QueryProvider>
      <WalkRallyHomePanelContent />
    </QueryProvider>
  );
}

function WalkRallyHomePanelContent() {
  const t = useT();
  const locale = useStore($locale);

  const { data: profile } = useQuery({ queryKey: ["rpkm-me"], queryFn: getMe });
  const { data: walkRally } = useQuery({
    queryKey: ["walkrally-me"],
    queryFn: getWalkRallyMe,
  });

  const registeredActivities = (walkRally?.registrations ?? []).flatMap(
    (reg) => {
      if (reg.code === MINIGAME_ACTIVITY_CODE) {
        return [
          {
            id: reg.code,
            name: t("walkrally.events.tabs.minigame"),
            description: undefined as string | undefined,
            imageName: undefined as string | undefined,
            round: reg.round,
            start: reg.start,
            end: reg.end,
            place: reg.place,
            accentColor: tabAccentColor.minigame,
          },
        ];
      }
      const groups: [
        string,
        typeof events.workshop | typeof events.walkingTour,
      ][] = [
        ["workshop", events.workshop],
        ["walkingTour", events.walkingTour],
      ];
      for (const [group, list] of groups) {
        const entry = list.find((e) => e.id === reg.code);
        if (!entry) continue;
        return [
          {
            id: entry.id,
            name: locale === "th" ? entry.nameTh : entry.nameEn,
            description: (locale === "th"
              ? "descriptionTh" in entry
                ? entry.descriptionTh
                : undefined
              : "descriptionEn" in entry
                ? entry.descriptionEn
                : undefined) as string | undefined,
            imageName: ("imageName" in entry ? entry.imageName : undefined) as
              string | undefined,
            round: reg.round,
            start: reg.start,
            end: reg.end,
            place: reg.place,
            accentColor: tabAccentColor[group],
          },
        ];
      }
      return [];
    },
  );

  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-[4.5cqw] flex h-10 items-center justify-center text-xl font-bold text-foreground sm:top-4.5">
        {t("walkrally.home.title")}
      </div>

      <div className="flex flex-col gap-8 px-4">
        <div className="relative isolate flex min-h-28 flex-col items-center gap-3 overflow-hidden rounded-3xl border border-black bg-background p-3 min-[360px]:flex-row">
          <MonotoneNoise className="absolute inset-0 -z-1 pointer-events-none" />

          <div className="flex w-full min-w-0 items-center gap-3 min-[360px]:w-auto min-[360px]:flex-1">
            <div
              className="relative isolate size-16 shrink-0 overflow-hidden rounded-full border border-black p-1"
              style={{ backgroundColor: ACCENT_ORANGE }}
            >
              <MonotoneNoise className="absolute inset-0 -z-1 pointer-events-none" />
              <div className="size-full overflow-hidden rounded-full border border-black bg-muted" />
            </div>

            <div className="min-w-0 flex-1">
              <span className="inline-block text-sm rounded-full border border-black bg-rpkm-light-pink px-2 py-0.5 text-[0.65rem] font-bold text-foreground">
                {profile?.studentId ?? ""}
              </span>
              <div className="mt-3 truncate text-xl font-bold text-foreground">
                {profile
                  ? `${profile.firstName} ${profile.lastName}`.trim()
                  : ""}
              </div>
              <div className="truncate text-base text-muted-foreground">
                {profile?.faculty ?? ""}
              </div>
            </div>
          </div>

          <div
            className="relative isolate shrink-0 overflow-hidden rounded-2xl border border-black p-1"
            style={{ backgroundColor: ACCENT_ORANGE }}
          >
            <MonotoneNoise className="absolute inset-0 -z-1 pointer-events-none" />
            <div className="flex flex-col items-center justify-center gap-0.5 rounded-xl border border-black bg-rpkm-green px-3 py-2 text-background">
              <span className="text-[0.6rem] font-bold">
                {t("walkrally.home.pointsLabel")}
              </span>
              <span className="text-2xl leading-none font-bold">
                {walkRally?.points ?? 0}
              </span>
              <span className="text-[0.6rem] font-bold">
                {t("walkrally.home.pointsUnit")}
              </span>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-foreground">
          {t("walkrally.home.registeredTitle")}
        </h2>

        {registeredActivities.length > 0 ? (
          <div className="flex flex-col gap-3">
            {registeredActivities.map((activity) => (
              <RegisteredActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center min-h-50 justify-center gap-4 rounded-3xl border border-black bg-rpkm-beige p-6 text-center">
            <p className="text-xl text-foreground">
              {t("walkrally.home.emptyState")}
            </p>
          </div>
        )}

        <a
          href="/walkrally/events"
          className="relative isolate flex items-center gap-2 self-center overflow-hidden rounded-full border-2 border-black bg-[#e65325] py-1.5 pr-5 pl-1.5 font-bold text-background"
        >
          <MonotoneNoise className="absolute inset-0 -z-1 pointer-events-none" />
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-black bg-white p-0.5">
            <div className="flex size-full items-center justify-center rounded-full border border-black bg-rpkm-beige">
              <Plus className="size-4 text-foreground" strokeWidth={3} />
            </div>
          </div>
          {t("walkrally.home.addActivity")}
        </a>
      </div>
    </>
  );
}
