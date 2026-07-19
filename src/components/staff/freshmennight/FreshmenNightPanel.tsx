import { useT } from "@lib/i18n/useT";
import { checkinFreshmenNight } from "@lib/api/checkin";
import { APIError } from "@lib/client";
import { QueryProvider } from "@components/shared/QueryProvider";
import {
  ScanEntryForm,
  ScanEntryError,
  type ScanEntryResult,
} from "@components/staff/ScanEntryForm";

export function FreshmenNightPanel() {
  return (
    <QueryProvider>
      <FreshmenNightPanelContent />
    </QueryProvider>
  );
}

function FreshmenNightPanelContent() {
  const t = useT();

  async function checkIn(studentId: string): Promise<ScanEntryResult> {
    try {
      await checkinFreshmenNight(studentId);
      return {
        title: t("staff.freshmenNight.successTitle"),
        message: studentId,
      };
    } catch (error) {
      if (error instanceof APIError) {
        switch (error.code) {
          // Student is checked in either way — show the success popup.
          case "ALREADY_CHECKED_IN":
            return {
              title: t("staff.freshmenNight.alreadyCheckedInTitle"),
              message: studentId,
            };
          case "STUDENT_NOT_FOUND":
            throw new ScanEntryError(
              t("staff.freshmenNight.failTitle"),
              t("staff.freshmenNight.studentNotFound"),
            );
          case "FORBIDDEN_NOT_STAFF":
            throw new ScanEntryError(
              t("staff.freshmenNight.failTitle"),
              t("staff.freshmenNight.notStaff"),
            );
        }
      }
      throw error;
    }
  }

  return (
    <ScanEntryForm
      labels={{
        title: t("staff.freshmenNight.title"),
        subtitle: t("staff.freshmenNight.subtitle"),
        modeQr: t("staff.freshmenNight.modeQr"),
        modeStudentId: t("staff.freshmenNight.modeStudentId"),
        studentIdLabel: t("staff.freshmenNight.studentIdLabel"),
        studentIdPlaceholder: t("staff.freshmenNight.studentIdPlaceholder"),
        invalidStudentId: t("staff.freshmenNight.invalidStudentId"),
        save: t("staff.freshmenNight.save"),
        successTitle: t("staff.freshmenNight.successTitle"),
        successMessage: t("staff.freshmenNight.successMessage"),
        failTitle: t("staff.freshmenNight.failTitle"),
        failMessage: t("staff.freshmenNight.failMessage"),
        ok: t("staff.freshmenNight.ok"),
        retry: t("staff.freshmenNight.retry"),
      }}
      titleClassName="text-foreground"
      labelClassName="text-foreground"
      onSubmit={checkIn}
    />
  );
}
