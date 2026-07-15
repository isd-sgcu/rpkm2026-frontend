import { useT } from "@lib/i18n/useT";
import { checkinRegistration } from "@lib/api/checkin";
import { APIError } from "@lib/client";
import { QueryProvider } from "@components/shared/QueryProvider";
import {
  ScanEntryForm,
  ScanEntryError,
  type ScanEntryResult,
} from "@components/staff/ScanEntryForm";

export function CheckInPanel() {
  return (
    <QueryProvider>
      <CheckInPanelContent />
    </QueryProvider>
  );
}

function CheckInPanelContent() {
  const t = useT();

  async function checkIn(studentId: string): Promise<ScanEntryResult> {
    try {
      await checkinRegistration(studentId);
      return { title: t("staff.checkin.successTitle"), message: studentId };
    } catch (error) {
      if (error instanceof APIError) {
        switch (error.code) {
          // Student is registered either way — show the success popup.
          case "ALREADY_CHECKED_IN":
            return {
              title: t("staff.checkin.alreadyCheckedInTitle"),
              message: studentId,
            };
          case "STUDENT_NOT_FOUND":
            throw new ScanEntryError(
              t("staff.checkin.failTitle"),
              t("staff.checkin.studentNotFound"),
            );
          case "FORBIDDEN_NOT_STAFF":
            throw new ScanEntryError(
              t("staff.checkin.failTitle"),
              t("staff.checkin.notStaff"),
            );
        }
      }
      throw error;
    }
  }

  return (
    <ScanEntryForm
      labels={{
        title: t("staff.checkin.title"),
        subtitle: t("staff.checkin.subtitle"),
        modeQr: t("staff.checkin.modeQr"),
        modeStudentId: t("staff.checkin.modeStudentId"),
        studentIdLabel: t("staff.checkin.studentIdLabel"),
        studentIdPlaceholder: t("staff.checkin.studentIdPlaceholder"),
        invalidStudentId: t("staff.checkin.invalidStudentId"),
        save: t("staff.checkin.save"),
        successTitle: t("staff.checkin.successTitle"),
        successMessage: t("staff.checkin.successMessage"),
        failTitle: t("staff.checkin.failTitle"),
        failMessage: t("staff.checkin.failMessage"),
        ok: t("staff.checkin.ok"),
        retry: t("staff.checkin.retry"),
      }}
      titleClassName="text-foreground"
      labelClassName="text-foreground"
      onSubmit={checkIn}
    />
  );
}
