import { useStore } from "@nanostores/react";
import { $locale } from "@lib/i18n/locale";
import { useT } from "@lib/i18n/useT";
import { getImageUrl } from "@lib/function";
import events from "@components/walkrally/events/events.json";
import registrations from "@components/walkrally/registrations.json";
import { setStoredMinigameId } from "@components/walkrally/events/minigameSelection";

const ACCENT_MINIGAME = "#8b688d";

export function MinigameListPanel() {
  const t = useT();
  const locale = useStore($locale);
  const games = events.minigame;
  const minigameIds = games.map((game) => game.id);
  const isRegistered = registrations.some((r) =>
    minigameIds.includes(r.activityId),
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="pointer-events-none absolute inset-x-0 top-[4.5cqw] flex h-10 items-center justify-center px-14 text-center text-xl font-bold text-foreground sm:top-4.5">
        {t("walkrally.events.tabs.minigame")} ({games.length})
      </div>

      <div className="flex flex-col gap-4 px-4">
        {games.map((game) => {
          const name = locale === "th" ? game.nameTh : game.nameEn;
          const description =
            locale === "th" ? game.descriptionTh : game.descriptionEn;
          const imageName =
            "imageName" in game ? (game.imageName as string) : undefined;
          const imageUrl = imageName ? getImageUrl(imageName) : undefined;
          const CardTag = isRegistered ? "div" : "a";
          return (
            <CardTag
              key={game.id}
              href={isRegistered ? undefined : "/walkrally/events?tab=minigame"}
              onClick={
                isRegistered ? undefined : () => setStoredMinigameId(game.id)
              }
              style={{ backgroundColor: ACCENT_MINIGAME }}
              className="relative isolate overflow-hidden rounded-3xl border border-foreground p-1"
            >
              <div className="flex flex-col items-center gap-3 rounded-[1.15rem] border border-foreground bg-background p-2 sm:gap-4 sm:p-3 min-[360px]:flex-row">
                <div
                  style={{ backgroundColor: ACCENT_MINIGAME }}
                  className="relative isolate shrink-0 overflow-hidden rounded-2xl border border-foreground p-1"
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt=""
                      className="size-24 rounded-xl border border-foreground object-cover sm:size-28"
                    />
                  ) : (
                    <div className="size-24 rounded-xl border border-foreground bg-muted sm:size-28" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-lg font-bold sm:text-xl">{name}</div>
                  {description && (
                    <p className="line-clamp-3 text-xs text-muted-foreground sm:text-sm">
                      {description}
                    </p>
                  )}
                </div>
              </div>
            </CardTag>
          );
        })}
      </div>
    </div>
  );
}
