import { useT } from "@lib/i18n/useT";
import { APIError } from "@lib/client";
import { QueryProvider } from "@components/shared/QueryProvider";
import {
  ScanEntryForm,
  ScanEntryError,
  type ScanEntryResult,
} from "@components/staff/ScanEntryForm";

// Dict namespaces that provide the full set of scan-panel labels.
type Namespace = "staff.checkin" | "staff.freshmenNight";

interface CheckinScanPanelProps {
  // i18n namespace holding the panel's labels (title, dialogs, errors).
  namespace: Namespace;
  // API call that checks the student in; its errors are mapped to dialogs here.
  checkin: (studentId: string) => Promise<unknown>;
}

export function CheckinScanPanel(props: CheckinScanPanelProps) {
  return (
    <QueryProvider>
      <CheckinScanPanelContent {...props} />
    </QueryProvider>
  );
}

function CheckinScanPanelContent({
  namespace,
  checkin,
}: CheckinScanPanelProps) {
  const t = useT();

  async function checkIn(studentId: string): Promise<ScanEntryResult> {
    try {
      await checkin(studentId);
      return { title: t(`${namespace}.successTitle`), message: studentId };
    } catch (error) {
      if (error instanceof APIError) {
        switch (error.code) {
          // Student is checked in either way — show the success popup.
          case "ALREADY_CHECKED_IN":
            return {
              title: t(`${namespace}.alreadyCheckedInTitle`),
              message: studentId,
            };
          case "STUDENT_NOT_FOUND":
            throw new ScanEntryError(
              t(`${namespace}.failTitle`),
              t(`${namespace}.studentNotFound`),
            );
          case "FORBIDDEN_NOT_STAFF":
            throw new ScanEntryError(
              t(`${namespace}.failTitle`),
              t(`${namespace}.notStaff`),
            );
        }
      }
      throw error;
    }
  }

  return (
    <ScanEntryForm
      labels={{
        title: t(`${namespace}.title`),
        subtitle: t(`${namespace}.subtitle`),
        modeQr: t(`${namespace}.modeQr`),
        modeStudentId: t(`${namespace}.modeStudentId`),
        studentIdLabel: t(`${namespace}.studentIdLabel`),
        studentIdPlaceholder: t(`${namespace}.studentIdPlaceholder`),
        invalidStudentId: t(`${namespace}.invalidStudentId`),
        save: t(`${namespace}.save`),
        successTitle: t(`${namespace}.successTitle`),
        successMessage: t(`${namespace}.successMessage`),
        failTitle: t(`${namespace}.failTitle`),
        failMessage: t(`${namespace}.failMessage`),
        ok: t(`${namespace}.ok`),
        retry: t(`${namespace}.retry`),
      }}
      titleClassName="text-foreground"
      labelClassName="text-foreground"
      onSubmit={checkIn}
    />
  );
}
