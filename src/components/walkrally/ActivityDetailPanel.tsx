import { Users } from "lucide-react";
import { useStore } from "@nanostores/react";
import { cn } from "@lib/utils";
import { getImageUrl } from "@lib/function";
import { useT } from "@lib/i18n/useT";
import { $locale } from "@lib/i18n/locale";
import { rounds } from "@components/walkrally/rounds";

export interface WalkRallyEntry {
  id: string;
  nameTh: string;
  nameEn: string;
  descriptionTh?: string;
  descriptionEn?: string;
  imageName?: string;
}

interface ActivityDetailPanelProps {
  entry: WalkRallyEntry;
}

export function ActivityDetailPanel({ entry }: ActivityDetailPanelProps) {
  const t = useT();
  const locale = useStore($locale);

  const name = locale === "th" ? entry.nameTh : entry.nameEn;
  const description =
    locale === "th" ? entry.descriptionTh : entry.descriptionEn;
  const imageUrl = getImageUrl(entry.imageName ?? "");

  return (
    <div className="flex flex-col gap-4">
      <div className="pointer-events-none absolute inset-x-0 top-[4.5cqw] flex h-10 items-center justify-center px-14 text-center text-xl font-bold sm:top-4.5 ">
        {name}
      </div>

      <div className="flex flex-col items-center gap-3 px-6 pt-10">
        {entry.imageName && (
          <img
            src={imageUrl}
            alt=""
            className="-mt-12 size-40 rounded-2xl border-2 border-black object-cover"
          />
        )}
        {description && (
          <p className="text-center text-sm text-foreground">{description}</p>
        )}
      </div>

      <div className="rounded-3xl bg-rpkm-red p-4 text-background">
        <h2 className="text-center text-lg font-bold">
          {t("walkrally.rounds")}
        </h2>
        <p className="mb-3 text-center text-xs">{t("walkrally.roundsNote")}</p>
        <div className="flex flex-col gap-2">
          {rounds.map((round) => (
            <button
              key={round.index}
              type="button"
              disabled={round.status !== "available"}
              className={cn(
                "flex flex-col rounded-xl p-2 text-left text-foreground disabled:cursor-not-allowed",
                round.status === "available" ? "bg-background" : "bg-[#f4c3ab]",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-baseline gap-2">
                  <span className="font-bold">
                    {t("walkrally.roundLabel", {
                      index: String(round.index),
                    })}
                  </span>
                  <span className="text-sm">
                    {round.start}-{round.end}
                  </span>
                </span>
                {round.status === "full" ? (
                  <span className="text-sm font-bold text-rpkm-red">
                    {t("walkrally.full")}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs">
                    <Users className="size-3.5" />
                    {round.booked}/{round.capacity}
                  </span>
                )}
              </div>
              {round.status === "conflict" && (
                <p className="text-xs text-rpkm-red">
                  {t("walkrally.conflictMessage")}
                </p>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
