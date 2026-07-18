import { ScanLine } from "lucide-react";
import houseSvg from "@assets/images/rpkm-id-card-house.svg";
import { EditPencil } from "@components/edit-profile/EditPencil";
import { QrCode, QrCodeDialog } from "@components/shared/QrCode";
import { buttonVariants } from "@components/ui/button";
import { useProfile } from "@lib/auth/useProfile";
import { useT } from "@lib/i18n/useT";
import { cn } from "@lib/utils";

const ProfileCardOrScanButton = () => {
  const t = useT();
  const profile = useProfile();
  const me = profile.status === "ready" ? profile.me : undefined;

  const isStaff = profile.status === "ready" && profile.me.staffRole !== null;
  const scanHref =
    profile.status === "ready" && profile.me.staffRole === "walkrally"
      ? "/staff/walkrally/record"
      : "/staff/checkin";

  const name = me
    ? `${me.firstName} ${me.lastName}`.trim()
    : t("home.idCard.loading");
  const faculty = me?.faculty ?? "";
  const studentId = me?.studentId ?? "";
  const bannerId = studentId || "—";

  if (isStaff) {
    return (
      <a
        href={scanHref}
        className={cn(
          buttonVariants({ variant: "default" }),
          "h-auto w-full flex-col gap-2 py-2 mb-12",
        )}
      >
        <ScanLine className="size-8" />
        <span className="text-base">{t("nav.scanRegister")}</span>
      </a>
    );
  }

  return (
    <div
      className="relative mx-auto w-full"
      style={{ containerType: "inline-size" }}
    >
      <div className="relative aspect-394/343 w-full mb-6">
        <img
          src={houseSvg.src}
          className="w-full"
          aria-hidden
          alt="decoration"
        />

        {/* Welcome heading */}
        <span className="absolute top-[10.5%] left-1/2 -translate-x-1/2 whitespace-nowrap font-extrabold text-[5cqw] text-rpkm-green tracking-[0.03em]">
          {t("home.idCard.welcome")}
        </span>

        {/* Student id — sits on the house's orange banner */}
        <div className="absolute top-[58.4%] left-[51.4%] flex h-[6.6%] w-[33%] -translate-x-1/2 items-center justify-center">
          <span className="truncate font-bold text-[3.6cqw] text-background">
            {bannerId}
          </span>
        </div>

        {/* Left card — name, faculty, edit link */}
        <div className="absolute top-[68.6%] left-[12%] flex h-[26.5%] w-[53%] flex-col justify-center gap-[1.5%] rounded-[10px] border border-foreground bg-background px-[5%]">
          <span className="truncate font-semibold text-[5cqw] text-foreground leading-tight">
            {name}
          </span>
          {faculty && (
            <span className="truncate text-[4cqw] text-rpkm-red leading-tight">
              {faculty}
            </span>
          )}
          <a
            href="/edit-profile"
            className="mt-[3%] inline-flex w-fit items-center gap-[1.5cqw] rounded-[8px] border border-foreground bg-rpkm-yellow px-[2.5cqw] py-[1cqw]"
          >
            <EditPencil className="size-[3.6cqw]" />
            <span className="font-bold text-[2.7cqw] text-foreground">
              {t("home.idCard.edit")}
            </span>
          </a>
        </div>

        {/* Right card — tap the QR to enlarge it */}
        {studentId ? (
          <QrCodeDialog
            contents={studentId}
            renderTrigger={
              <button
                type="button"
                aria-label={t("qrcode.myQrTitle")}
                className="absolute top-[68.6%] left-[67%] flex aspect-square h-[26.5%] items-center justify-center rounded-[10px] border border-foreground bg-background p-2"
              >
                <QrCode contents={studentId} className="size-full" />
              </button>
            }
          />
        ) : (
          <div className="absolute top-[68.6%] left-[67%] aspect-square h-[26.5%] rounded-[10px] border border-foreground bg-background" />
        )}
      </div>
    </div>
  );
};

export default ProfileCardOrScanButton;
