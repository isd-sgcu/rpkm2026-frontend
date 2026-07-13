import { useT } from "@lib/i18n/useT";
import { cn } from "@lib/utils";
import { Scanner, type IScannerError } from "@yudiel/react-qr-scanner";
import { LoaderCircleIcon } from "lucide-react";
import { toast } from "sonner";

interface QrScannerProps {
  className?: string;
  onScan: (contents: string) => void;

  // Should pause when you get a scan result while you are showing dialog
  paused: boolean;
}

export function QrScanner({ className, paused, onScan }: QrScannerProps) {
  // only surface the spinner once the request is slow enough to notice,
  // so fast responses don't flash it
  const showLoading = false;
  const t = useT();

  // TODO: permission flow
  return (
    <div className={cn("aspect-square w-full", className)}>
      <Scanner
        onScan={(codes) => {
          const code = codes[0]?.rawValue;
          if (code) {
            onScan(code);
          }
        }}
        onError={(error) => displayQrScannerError(error, t)}
        paused={paused}
        constraints={{
          facingMode: {
            ideal: "environment",
          },
        }}
      />
      {showLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <LoaderCircleIcon className="size-10 animate-spin text-white" />
        </div>
      )}
    </div>
  );
}

const qrScannerErrorKeys = {
  "permission-denied": "qrcode.scannerError.permissionDenied",
  "no-camera": "qrcode.scannerError.noCamera",
  "in-use": "qrcode.scannerError.inUse",
  overconstrained: "qrcode.scannerError.overconstrained",
  "insecure-context": "qrcode.scannerError.insecureContext",
  unsupported: "qrcode.scannerError.unsupported",
  aborted: "qrcode.scannerError.aborted",
  security: "qrcode.scannerError.security",
  "type-error": "qrcode.scannerError.typeError",
  unknown: "qrcode.scannerError.unknown",
} as const satisfies Record<IScannerError["kind"], string>;

const refreshableErrors: Set<IScannerError["kind"]> = new Set([
  "aborted",
  "in-use",
  "overconstrained",
  "permission-denied",
  "security",
  "unknown",
  "type-error",
]);

function displayQrScannerError(
  error: IScannerError,
  t: ReturnType<typeof useT>,
) {
  toast.error(t(qrScannerErrorKeys[error.kind]), {
    duration: 60 * 1000,
    action: refreshableErrors.has(error.kind)
      ? {
          label: t("qrcode.refresh"),
          onClick: () => {
            location.reload();
          },
        }
      : undefined,
  });
}
