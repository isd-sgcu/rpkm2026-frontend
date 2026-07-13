import { useMemo, useState } from "react";
import { useStore } from "@nanostores/react";
import { toast } from "sonner";
import { $locale } from "@lib/i18n/locale";
import { useT } from "@lib/i18n/useT";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { QueryProvider } from "@components/shared/QueryProvider";
import { ScanEntryForm } from "@components/staff/ScanEntryForm";
import { rounds } from "@components/walkrally/events/rounds";
import events from "@components/walkrally/events/events.json";

const activityOptions = Object.values(events)
  .flat()
  .map((entry) => ({
    id: entry.id,
    nameTh: entry.nameTh,
    nameEn: entry.nameEn,
  }));

interface RecordPayload {
  studentId: string;
  activityId: string;
  round: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function recordPoints(_payload: RecordPayload) {
  // TODO: call the record-points API (e.g. via a TanStack Query mutation).
  // Throw on a non-2xx response to surface the error popup.
}

export function RecordPointsPanel() {
  return (
    <QueryProvider>
      <RecordPointsPanelContent />
    </QueryProvider>
  );
}

function RecordPointsPanelContent() {
  const t = useT();
  const locale = useStore($locale);

  const [activityId, setActivityId] = useState("");
  const [roundIndex, setRoundIndex] = useState("");

  // base-ui renders the raw value in the trigger unless Select.Root is given an
  // `items` map — supply value -> label so the trigger shows the label text.
  const activityItems = useMemo(
    () =>
      activityOptions.map((activity) => ({
        value: activity.id,
        label: locale === "th" ? activity.nameTh : activity.nameEn,
      })),
    [locale],
  );

  const roundItems = useMemo(
    () =>
      rounds.map((round) => ({
        value: String(round.index),
        label: `${t("walkrally.record.roundOption", {
          index: String(round.index),
        })}  ${round.start}-${round.end}`,
      })),
    [locale],
  );

  function canSubmit() {
    if (activityId && roundIndex) return true;
    toast.error(t("walkrally.record.selectActivityFirst"));
    return false;
  }

  return (
    <ScanEntryForm
      labels={{
        title: t("walkrally.record.title"),
        subtitle: t("walkrally.record.subtitle"),
        modeQr: t("walkrally.record.modeQr"),
        modeStudentId: t("walkrally.record.modeStudentId"),
        studentIdLabel: t("walkrally.record.studentIdLabel"),
        studentIdPlaceholder: t("walkrally.record.studentIdPlaceholder"),
        invalidStudentId: t("walkrally.record.invalidStudentId"),
        save: t("walkrally.record.save"),
        successTitle: t("walkrally.record.successTitle"),
        successMessage: t("walkrally.record.successMessage"),
        failTitle: t("walkrally.record.failTitle"),
        failMessage: t("walkrally.record.failMessage"),
        ok: t("walkrally.record.ok"),
        retry: t("walkrally.record.retry"),
      }}
      canSubmit={canSubmit}
      onSubmit={(studentId) =>
        recordPoints({ studentId, activityId, round: Number(roundIndex) })
      }
    >
      <div className="flex flex-col gap-2">
        <span className="px-1 font-bold text-background">
          {t("walkrally.record.activityLabel")}
        </span>
        <Select
          items={activityItems}
          value={activityId}
          onValueChange={(value) => setActivityId(value ?? "")}
        >
          <SelectTrigger className="h-11! w-full rounded-2xl border-black bg-background px-2.5 text-base font-bold text-foreground">
            <SelectValue
              placeholder={t("walkrally.record.activityPlaceholder")}
            />
          </SelectTrigger>
          <SelectContent>
            {activityOptions.map((activity) => (
              <SelectItem
                className="py-2"
                key={activity.id}
                value={activity.id}
              >
                {locale === "th" ? activity.nameTh : activity.nameEn}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <span className="px-1 font-bold text-background">
          {t("walkrally.record.roundLabel")}
        </span>
        <Select
          items={roundItems}
          value={roundIndex}
          onValueChange={(value) => setRoundIndex(value ?? "")}
        >
          <SelectTrigger className="h-11! w-full rounded-2xl border-black bg-background px-2.5 text-base font-bold text-foreground">
            <SelectValue placeholder={t("walkrally.record.roundPlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            {rounds.map((round) => (
              <SelectItem
                className="py-2"
                key={round.index}
                value={String(round.index)}
              >
                <span className="font-bold">
                  {t("walkrally.record.roundOption", {
                    index: String(round.index),
                  })}
                </span>
                <span className="text-muted-foreground">
                  {round.start}-{round.end}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </ScanEntryForm>
  );
}
