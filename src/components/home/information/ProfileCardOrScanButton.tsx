import { ScanLine } from "lucide-react";

import { buttonVariants } from "@components/ui/button";
import { useProfile } from "@lib/auth/useProfile";
import { useT } from "@lib/i18n/useT";
import { cn } from "@lib/utils";

const ProfileCardOrScanButton = () => {
  const t = useT();
  const profile = useProfile();
  const isStaff = profile.status === "ready" && profile.me.role === "staff";

  if (isStaff) {
    return (
      <a
        href="/staff/checkin"
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

  // TODO: Profile card with QR code
  return <div id="qrcode">TODO: PROFILE CARD</div>;
};

export default ProfileCardOrScanButton;
