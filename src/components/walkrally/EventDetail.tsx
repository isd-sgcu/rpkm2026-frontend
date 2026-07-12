import { useT } from "@lib/i18n/useT";

interface EventDetailProps {
  eventName: string;
  onBack: () => void;
}

export function EventDetail({ eventName, onBack }: EventDetailProps) {
  const t = useT();

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        className="self-start text-sm underline"
        onClick={onBack}
      >
        {t("walkrally.back")}
      </button>
      <div className="rounded-2xl bg-background p-4">
        {t("walkrally.eventDetailPrefix")}: {eventName}
      </div>
    </div>
  );
}
