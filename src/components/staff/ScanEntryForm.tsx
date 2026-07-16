import { CameraTroubleshoot } from "@components/shared/CameraTroubleshootDialog";
import { MonotoneNoise } from "@components/shared/MonotoneNoise";
import { QrScanner } from "@components/shared/QrCodeScanner";
import { ResultDialog } from "@components/staff/ResultDialog";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { cn } from "@lib/utils";
import { LoaderCircleIcon } from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";

type Mode = "qr" | "studentId";
type Status = "idle" | "submitting" | "success" | "error";

const MODES: Mode[] = ["qr", "studentId"];

// Only surface the spinner once the request is slow enough to notice, so fast
// responses don't flash it.
const LOADING_DELAY_MS = 300;

export interface ScanEntryLabels {
  title: string;
  subtitle?: string;
  modeQr: string;
  modeStudentId: string;
  studentIdLabel: string;
  studentIdPlaceholder: string;
  invalidStudentId: string;
  save: string;
  successTitle: string;
  successMessage: string;
  failTitle: string;
  failMessage: string;
  ok: string;
  retry: string;
}

// Dialog content for one submission. onSubmit may return it to override the
// default success labels (e.g. show the scanned student id, or the
// already-checked-in title).
export interface ScanEntryResult {
  title?: string;
  message?: string;
}

// Throw from onSubmit to surface the error popup with specific content
// (e.g. "student not found"). Any other thrown value falls back to the
// default fail labels.
export class ScanEntryError extends Error {
  constructor(
    public readonly title: string,
    public readonly displayMessage: string,
  ) {
    super(displayMessage);
    this.name = "ScanEntryError";
  }
}

interface ScanEntryFormProps {
  labels: ScanEntryLabels;
  // Submit a scanned / entered student id. Throw to surface the error popup.
  onSubmit: (studentId: string) => Promise<ScanEntryResult | void>;
  // Gate a submission — return false (after showing your own toast) to block it,
  // e.g. when required fields aren't filled yet.
  canSubmit?: () => boolean;
  // Title color — defaults to the light-on-dark-background title.
  titleClassName?: string;
  // Field-label color — defaults to light-on-dark-background.
  labelClassName?: string;
  // Extra controls rendered under the scanner / id input in both modes.
  children?: ReactNode;
}

export function ScanEntryForm({
  labels,
  onSubmit,
  canSubmit,
  titleClassName = "text-background",
  labelClassName = "text-background",
  children,
}: ScanEntryFormProps) {
  const [mode, setMode] = useState<Mode>("qr");
  const [studentId, setStudentId] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [showLoading, setShowLoading] = useState(false);
  // Content for the currently open result dialog, set alongside status.
  const [dialog, setDialog] = useState<{ title: string; message: string }>({
    title: "",
    message: "",
  });

  const dialogOpen = status === "success" || status === "error";

  async function submit(id: string) {
    setStatus("submitting");
    const loadingTimer = window.setTimeout(
      () => setShowLoading(true),
      LOADING_DELAY_MS,
    );
    try {
      const result = await onSubmit(id);
      setDialog({
        title: result?.title ?? labels.successTitle,
        message: result?.message ?? labels.successMessage,
      });
      setStatus("success");
    } catch (err) {
      if (err instanceof ScanEntryError) {
        setDialog({ title: err.title, message: err.displayMessage });
      } else {
        setDialog({ title: labels.failTitle, message: labels.failMessage });
      }
      setStatus("error");
    } finally {
      window.clearTimeout(loadingTimer);
      setShowLoading(false);
    }
  }

  function handleScan(code: string) {
    if (status !== "idle") return;
    if (canSubmit && !canSubmit()) return;
    submit(code);
  }

  function handleSave() {
    if (status === "submitting") return;
    if (!/^\d{10}$/.test(studentId)) {
      toast.error(labels.invalidStudentId);
      return;
    }
    if (canSubmit && !canSubmit()) return;
    submit(studentId);
  }

  function dismissDialog() {
    if (mode === "studentId") setStudentId("");
    setStatus("idle");
  }

  return (
    <>
      <div className="flex flex-col gap-5 px-6">
        <div
          className={cn(
            "-mt-8 flex flex-col items-center text-center text-xl leading-tight font-bold",
            titleClassName,
          )}
        >
          <span>{labels.title}</span>
          {labels.subtitle && <span>{labels.subtitle}</span>}
        </div>

        <div className="relative isolate mx-auto flex w-full max-w-76 items-center gap-1 overflow-hidden rounded-full border border-black bg-background p-1">
          <MonotoneNoise className="pointer-events-none absolute inset-0 -z-1" />
          {MODES.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setMode(option)}
              className={cn(
                "relative isolate flex-1 overflow-hidden rounded-full px-4 py-2 text-center text-base transition-colors",
                mode === option
                  ? "border border-black bg-rpkm-red text-background"
                  : "text-foreground",
              )}
            >
              {mode === option && (
                <MonotoneNoise
                  noiseSize={3}
                  noiseDensity={10}
                  noiseColor="rgba(0 0 0 / 0.18)"
                  className="pointer-events-none absolute inset-0 -z-1"
                />
              )}
              {option === "qr" ? labels.modeQr : labels.modeStudentId}
            </button>
          ))}
        </div>

        {mode === "qr" ? (
          <>
            <div className="relative isolate overflow-hidden rounded-[1.8rem] border border-black bg-rpkm-light-green p-4">
              <MonotoneNoise
                noiseSize={4}
                noiseDensity={12}
                className="pointer-events-none absolute inset-0 -z-1"
              />
              <QrScanner
                className="rounded-2xl"
                paused={status !== "idle"}
                loading={showLoading}
                onScan={handleScan}
              />
            </div>
            <CameraTroubleshoot className={cn("-mt-1", labelClassName)} />
          </>
        ) : (
          <div className="flex flex-col gap-2">
            <span className={cn("px-1 font-bold", labelClassName)}>
              {labels.studentIdLabel}
            </span>
            <Input
              inputMode="numeric"
              maxLength={10}
              value={studentId}
              onChange={(event) =>
                setStudentId(event.target.value.replace(/\D/g, ""))
              }
              placeholder={labels.studentIdPlaceholder}
              className="h-11 rounded-2xl border-black bg-background font-bold text-foreground"
            />
          </div>
        )}

        {children}

        {mode === "studentId" && (
          <Button
            size="lg"
            className="mx-auto mt-2 w-24 rounded-xl"
            disabled={status === "submitting"}
            onClick={handleSave}
            iconStart={
              showLoading ? (
                <LoaderCircleIcon className="animate-spin" />
              ) : undefined
            }
          >
            {labels.save}
          </Button>
        )}
      </div>

      <ResultDialog
        open={dialogOpen}
        onOpenChange={(open) => !open && dismissDialog()}
        status={status === "error" ? "error" : "success"}
        successTitle={dialog.title}
        successMessage={dialog.message}
        okLabel={labels.ok}
        failTitle={dialog.title}
        failMessage={dialog.message}
        retryLabel={labels.retry}
      />
    </>
  );
}
