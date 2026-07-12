import { XIcon } from "lucide-react";
import { getImageUrl } from "@lib/function";
import { useT } from "@lib/i18n/useT";

export interface RegisteredActivity {
  id: string;
  name: string;
  description?: string;
  round: number;
  start: string;
  end: string;
  ticketNumber: string;
  imageName?: string;
  accentColor: string;
}

interface RegisteredActivityCardProps {
  activity: RegisteredActivity;
}

export function RegisteredActivityCard({
  activity,
}: RegisteredActivityCardProps) {
  const t = useT();
  const imageUrl = getImageUrl(activity.imageName ?? "");
  const frameStyle = { backgroundColor: activity.accentColor };

  return (
    <div
      style={frameStyle}
      className="relative isolate overflow-hidden rounded-3xl border border-black p-1"
    >
      <div className="relative flex gap-3 rounded-[1.15rem] border border-black bg-rpkm-beige p-3 pr-4">
        <div
          style={frameStyle}
          className="relative isolate size-24 shrink-0 overflow-hidden rounded-2xl border border-black p-1"
        >
          {activity.imageName ? (
            <img
              src={imageUrl}
              alt=""
              className="size-full rounded-xl border border-black object-cover"
            />
          ) : (
            <div className="size-full rounded-xl border border-black bg-muted" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-lg font-bold text-foreground">
            {activity.name}
          </div>
          {activity.description && (
            <p className="line-clamp-2 text-xs text-muted-foreground">
              {activity.description}
            </p>
          )}

          <div className="mt-2 flex items-end justify-between gap-2">
            <div>
              <div className="text-base font-bold text-foreground">
                {t("walkrally.events.roundLabel", {
                  index: String(activity.round),
                })}
              </div>
              <div className="text-xs text-muted-foreground">
                {activity.start} - {activity.end}
              </div>
            </div>
            <span className="shrink-0 text-xs font-bold text-muted-foreground">
              #{activity.ticketNumber}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="absolute top-2 right-2 flex size-6 items-center justify-center"
        >
          <XIcon className="size-4 fill-destructive text-destructive" />
        </button>
      </div>
    </div>
  );
}
