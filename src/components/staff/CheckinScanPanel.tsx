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
  // When true, an already-registered student shows the alert (error) dialog
  // instead of a green "success" popup. Defaults to false.
  alreadyRegisteredIsError?: boolean;
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
  alreadyRegisteredIsError = false,
}: CheckinScanPanelProps) {
  const t = useT();

  async function checkIn(studentId: string): Promise<ScanEntryResult> {
    try {
      await checkin(studentId);
      // Optional greeting line above the id (e.g. Freshmen Night "ยินดีต้อนรับ").
      // Empty for panels that don't want it, leaving just the id.
      const welcome = t(`${namespace}.welcome`);
      return {
        title: t(`${namespace}.successTitle`),
        message: welcome ? `${welcome}\n${studentId}` : studentId,
      };
    } catch (error) {
      if (error instanceof APIError) {
        switch (error.code) {
          // Already registered. Freshmen Night shows the alert (error) dialog;
          // other panels keep the friendly green "already saved" popup. Either
          // way, tell staff when the original check-in happened.
          case "ALREADY_CHECKED_IN": {
            const scannedAt = error.context?.scannedAt;
            const date =
              typeof scannedAt === "string"
                ? new Intl.DateTimeFormat("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(scannedAt))
                : "";
            const message = date
              ? t(`${namespace}.alreadyCheckedInMessage`, { studentId, date })
              : studentId;
            if (alreadyRegisteredIsError) {
              throw new ScanEntryError(
                t(`${namespace}.alreadyCheckedInTitle`),
                message,
              );
            }
            return {
              title: t(`${namespace}.alreadyCheckedInTitle`),
              message,
            };
          }
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
