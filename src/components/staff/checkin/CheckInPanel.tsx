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
        title: t("walkrally.checkin.title"),
        subtitle: t("walkrally.checkin.subtitle"),
        modeQr: t("walkrally.checkin.modeQr"),
        modeStudentId: t("walkrally.checkin.modeStudentId"),
        studentIdLabel: t("walkrally.checkin.studentIdLabel"),
        studentIdPlaceholder: t("walkrally.checkin.studentIdPlaceholder"),
        invalidStudentId: t("walkrally.checkin.invalidStudentId"),
        save: t("walkrally.checkin.save"),
        successTitle: t("walkrally.checkin.successTitle"),
        successMessage: t("walkrally.checkin.successMessage"),
        failTitle: t("walkrally.checkin.failTitle"),
        failMessage: t("walkrally.checkin.failMessage"),
        ok: t("walkrally.checkin.ok"),
        retry: t("walkrally.checkin.retry"),
      }}
      titleClassName="text-foreground"
      labelClassName="text-foreground"
      onSubmit={checkIn}
    />
  );
}
