import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { getImageUrl } from "@lib/function";
import { useT } from "@lib/i18n/useT";
import { ConfirmActionDialog } from "@components/walkrally/ConfirmActionDialog";
import { unregisterFromActivity } from "@lib/api/walkrally";

export interface RegisteredActivity {
  id: string;
  name: string;
  description?: string;
  round: number;
  start: string;
  end: string;
  place: number;
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
  const queryClient = useQueryClient();
  const imageUrl = getImageUrl(activity.imageName ?? "");
  const frameStyle = { backgroundColor: activity.accentColor };
  const [open, setOpen] = useState(false);

  async function handleConfirmCancel() {
    await unregisterFromActivity(activity.id);
    await queryClient.invalidateQueries({ queryKey: ["walkrally-me"] });
  }

  return (
    <>
      <a
        href={`/walkrally/events/${activity.id}`}
        style={frameStyle}
        className="relative isolate block overflow-hidden rounded-3xl border border-foreground p-1"
      >
        <div className="relative flex flex-col items-center gap-3 rounded-[1.15rem] border border-foreground bg-rpkm-beige p-3 pr-4 min-[360px]:flex-row min-[360px]:items-start">
          <div
            style={frameStyle}
            className="relative isolate size-24 shrink-0 overflow-hidden rounded-2xl border border-foreground p-1"
          >
            {activity.imageName ? (
              <img
                src={imageUrl}
                alt=""
                className="size-full rounded-xl border border-foreground object-cover"
              />
            ) : (
              <div className="size-full rounded-xl border border-foreground bg-muted" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="pr-6 text-lg font-bold text-foreground">
              {activity.name}
            </div>
            {activity.description && (
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {activity.description}
              </p>
            )}

            <div className="mt-2 flex flex-col gap-1">
              <div>
                <div className="text-base font-bold text-foreground">
                  {t("walkrally.events.roundLabel", {
                    index: String(activity.round),
                  })}
                </div>
                <div className="text-xs text-foreground">
                  {activity.start} - {activity.end}
                </div>
              </div>
              <span className="text-xs font-bold text-foreground">
                #{activity.place}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen(true);
            }}
            className="absolute top-2 right-2 flex size-6 items-center justify-center"
          >
            <Trash2 className="size-6 fill-destructive text-destructive" />
          </button>
        </div>
      </a>

      <ConfirmActionDialog
        open={open}
        onOpenChange={setOpen}
        onConfirm={handleConfirmCancel}
        confirmTitle={t("walkrally.home.cancelTitle")}
        confirmMessage={t("walkrally.home.cancelMessage", {
          name: activity.name,
          index: String(activity.round),
        })}
        confirmLabel={t("walkrally.home.cancelConfirm")}
        cancelLabel={t("walkrally.home.cancelDismiss")}
        successTitle={t("walkrally.home.cancelSuccessTitle")}
        successMessage={t("walkrally.home.cancelSuccessMessage", {
          name: activity.name,
          index: String(activity.round),
        })}
        okLabel={t("walkrally.events.ok")}
        failTitle={t("walkrally.home.cancelFailTitle")}
        failMessage={t("walkrally.home.cancelFailMessage")}
        retryLabel={t("walkrally.events.retry")}
      />
    </>
  );
}
