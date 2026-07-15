import { useT } from "@lib/i18n/useT";
import { QueryProvider } from "@components/shared/QueryProvider";
import { ScanEntryForm } from "@components/staff/ScanEntryForm";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function checkIn(_studentId: string) {
  // TODO: call the check-in API (e.g. via a TanStack Query mutation).
  // Throw on a non-2xx response to surface the error popup.
}

export function CheckInPanel() {
  return (
    <QueryProvider>
      <CheckInPanelContent />
    </QueryProvider>
  );
}

function CheckInPanelContent() {
  const t = useT();

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
