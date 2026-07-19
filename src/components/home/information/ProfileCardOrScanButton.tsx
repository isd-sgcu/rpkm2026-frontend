import { useRef } from "react";
import { ScanLine, UserRound } from "lucide-react";

import houseSvg from "@assets/images/rpkm-id-card-house.svg";
import { EditPencil } from "@components/edit-profile/EditPencil";
import { useAvatarUpload } from "@components/edit-profile/useAvatarUpload";
import { QrCode, QrCodeDialog } from "@components/shared/QrCode";
import { buttonVariants } from "@components/ui/button";
import { useProfile } from "@lib/auth/useProfile";
import { useSession } from "@lib/auth/useSession";
import { useT } from "@lib/i18n/useT";
import { cn } from "@lib/utils";

const ProfileCardOrScanButton = () => {
  const t = useT();
  const profile = useProfile();
  const session = useSession();
  const me = profile.status === "ready" ? profile.me : undefined;

  const isStaff = profile.status === "ready" && profile.me.staffRole !== null;
  const staffRole = profile.status === "ready" ? profile.me.staffRole : null;
  const scanHref =
    staffRole === "walkrally"
      ? "/staff/walkrally/record"
      : staffRole === "freshmennight"
        ? "/staff/freshmennight"
        : "/staff/checkin";

  const name = me
    ? `${me.firstName} ${me.lastName}`.trim()
    : t("home.idCard.loading");
  const faculty = me?.faculty ?? "";
  const studentId = me?.studentId ?? "";
  const bannerId = studentId || "—";

  const image = session.status === "authenticated" ? session.user.image : null;
  const inputRef = useRef<HTMLInputElement>(null);
  const { preview, busy, onPick } = useAvatarUpload();
  const avatarUrl = preview ?? image;

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
      {/* aspect-394/350: the house frame (394x341) plus the id band, name
          card and QR box that overlay its bottom edge. The avatar/pencil/
          id-pill positions are measured empirically off the *rendered* house art
          (src/assets/images/rpkm-id-card-house.svg) — its window layout
          doesn't line up with the newer Figma house asset (node
          2815:24985), so the Figma coordinates don't transfer for those
          three elements. */}
      <div className="relative aspect-394/350 w-full mb-6">
        <img
          src={houseSvg.src}
          className="absolute top-0 left-0 w-full"
          aria-hidden
          alt="decoration"
        />

        {/* Welcome heading, sitting on the house's roof gutter. */}
        <span className="absolute top-[12.6%] left-1/2 -translate-x-1/2 whitespace-nowrap font-extrabold text-[5cqw] text-rpkm-green tracking-[0.03em]">
          {t("home.idCard.welcome")}
        </span>

        {/* Avatar — real uploaded photo, falls back to a generic silhouette.
            The pencil overlaps its bottom-right corner for a quick inline
            edit without leaving the home page. */}
        <div className="absolute top-[21%] left-[35%] w-[33%] aspect-square overflow-hidden rounded-[10px] border border-foreground bg-rpkm-grey">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt=""
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <UserRound className="size-[40%] text-foreground/40" />
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          aria-label={t("home.idCard.editAvatar")}
          className="absolute top-[51.8%] left-[63.5%] z-10 flex aspect-square w-[9%] items-center justify-center rounded-full border border-foreground bg-rpkm-yellow disabled:opacity-50"
        >
          <EditPencil className="size-[60%]" />
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={onPick}
        />

        {/* Student id — a pill draping the bottom edge of the avatar. */}
        <div className="absolute top-[56%] left-[33.5%] w-[36%] rounded-[10px] border border-foreground bg-rpkm-red py-0.5">
          <span className="block truncate text-center text-[3.2cqw] font-bold text-background">
            {bannerId}
          </span>
        </div>

        {/* Left card — name, faculty, edit link */}
        <div className="absolute top-[65.8%] left-[12%] flex h-[25.9%] w-[53%] flex-col justify-center gap-[1.5%] rounded-[10px] border border-foreground bg-background px-[5%]">
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
                className="absolute top-[65.8%] left-[67%] flex aspect-square w-[23%] items-center justify-center rounded-[10px] border border-foreground bg-background p-2"
              >
                <QrCode contents={studentId} className="size-full" />
              </button>
            }
          />
        ) : (
          <div className="absolute top-[65.8%] left-[67%] aspect-square w-[23%] rounded-[10px] border border-foreground bg-background" />
        )}
      </div>
    </div>
  );
};

export default ProfileCardOrScanButton;
