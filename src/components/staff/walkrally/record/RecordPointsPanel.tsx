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
import { recordWalkRallyAttendance } from "@lib/api/checkin";
import { APIError } from "@lib/client";
import { QueryProvider } from "@components/shared/QueryProvider";
import {
  ScanEntryForm,
  ScanEntryError,
  type ScanEntryResult,
} from "@components/staff/ScanEntryForm";
import { getRoundSchedule } from "@components/walkrally/events/rounds";
import { MINIGAME_ACTIVITY_CODE } from "@components/walkrally/events/minigameActivity";
import events from "@components/walkrally/events/events.json";
import th from "@lib/i18n/dict/th.json";
import en from "@lib/i18n/dict/en.json";

const activityOptions = [
  ...[...events.workshop, ...events.walkingTour].map((entry) => ({
    id: entry.id,
    nameTh: entry.nameTh,
    nameEn: entry.nameEn,
  })),
  {
    id: MINIGAME_ACTIVITY_CODE,
    nameTh: th.walkrally.events.tabs.minigame,
    nameEn: en.walkrally.events.tabs.minigame,
  },
];

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

  const rounds = useMemo(() => getRoundSchedule(activityId), [activityId]);

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
        label: `${t("staff.walkrally.record.roundOption", {
          index: String(round.index),
        })}  ${round.start}-${round.end}`,
      })),
    [locale, rounds],
  );

  function canSubmit() {
    if (activityId && roundIndex) return true;
    // Fixed id — repeated scans re-use the same toast instead of stacking
    toast.error(t("staff.walkrally.record.selectActivityFirst"), {
      id: "select-activity-first",
    });
    return false;
  }

  async function recordPoints(studentId: string): Promise<ScanEntryResult> {
    const activity = activityOptions.find((it) => it.id === activityId);
    const activityName =
      (locale === "th" ? activity?.nameTh : activity?.nameEn) ?? activityId;
    const round = rounds.find((it) => String(it.index) === roundIndex);
    const roundLabel = round
      ? t("staff.walkrally.record.roundTime", {
          start: round.start,
          end: round.end,
        })
      : "";
    // The API derives the round from the student's registration; the selected
    // round is only shown in the confirmation popup.
    const description = `${studentId}\n${activityName} ${roundLabel}`;

    try {
      await recordWalkRallyAttendance({ studentId, code: activityId });
      return {
        title: t("staff.walkrally.record.successTitle"),
        message: description,
      };
    } catch (error) {
      if (error instanceof APIError) {
        switch (error.code) {
          // Points were already recorded — show the success popup.
          case "ALREADY_CHECKED_IN":
            return {
              title: t("staff.walkrally.record.alreadyCheckedInTitle"),
              message: description,
            };
          case "STUDENT_NOT_FOUND":
            throw new ScanEntryError(
              t("staff.walkrally.record.failTitle"),
              t("staff.walkrally.record.studentNotFound"),
            );
          case "FORBIDDEN_NOT_STAFF":
            throw new ScanEntryError(
              t("staff.walkrally.record.failTitle"),
              t("staff.walkrally.record.notStaff"),
            );
          case "INVALID_ACTIVITY":
            throw new ScanEntryError(
              t("staff.walkrally.record.failTitle"),
              t("staff.walkrally.record.invalidActivity"),
            );
          case "POINTS_CAP_REACHED":
            throw new ScanEntryError(
              t("staff.walkrally.record.failTitle"),
              t("staff.walkrally.record.pointsCapReached"),
            );
        }
      }
      throw error;
    }
  }

  return (
    <ScanEntryForm
      labels={{
        title: t("staff.walkrally.record.title"),
        subtitle: t("staff.walkrally.record.subtitle"),
        modeQr: t("staff.walkrally.record.modeQr"),
        modeStudentId: t("staff.walkrally.record.modeStudentId"),
        studentIdLabel: t("staff.walkrally.record.studentIdLabel"),
        studentIdPlaceholder: t("staff.walkrally.record.studentIdPlaceholder"),
        invalidStudentId: t("staff.walkrally.record.invalidStudentId"),
        save: t("staff.walkrally.record.save"),
        successTitle: t("staff.walkrally.record.successTitle"),
        successMessage: t("staff.walkrally.record.successMessage"),
        failTitle: t("staff.walkrally.record.failTitle"),
        failMessage: t("staff.walkrally.record.failMessage"),
        ok: t("staff.walkrally.record.ok"),
        retry: t("staff.walkrally.record.retry"),
      }}
      canSubmit={canSubmit}
      onSubmit={recordPoints}
    >
      <div className="flex flex-col gap-2">
        <span className="px-1 font-bold text-background">
          {t("staff.walkrally.record.activityLabel")}
        </span>
        <Select
          items={activityItems}
          value={activityId}
          onValueChange={(value) => setActivityId(value ?? "")}
        >
          <SelectTrigger className="h-11! w-full rounded-2xl border-black bg-background px-2.5 text-base font-bold text-foreground">
            <SelectValue
              placeholder={t("staff.walkrally.record.activityPlaceholder")}
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
          {t("staff.walkrally.record.roundLabel")}
        </span>
        <Select
          items={roundItems}
          value={roundIndex}
          onValueChange={(value) => setRoundIndex(value ?? "")}
        >
          <SelectTrigger className="h-11! w-full rounded-2xl border-black bg-background px-2.5 text-base font-bold text-foreground">
            <SelectValue
              placeholder={t("staff.walkrally.record.roundPlaceholder")}
            />
          </SelectTrigger>
          <SelectContent>
            {rounds.map((round) => (
              <SelectItem
                className="py-2"
                key={round.index}
                value={String(round.index)}
              >
                <span className="font-bold">
                  {t("staff.walkrally.record.roundOption", {
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
