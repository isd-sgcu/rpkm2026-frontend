import { Button } from "@components/ui/button";
import { logout } from "@lib/auth/session";
import { useT } from "@lib/i18n/useT";

import rpkmLogo from "@assets/images/rpkm_logo.png";

export function NotEligibleContent() {
  const t = useT();

  return (
    <div className="flex h-full flex-col items-center justify-between gap-6 rounded-3xl bg-primary px-8 py-10 text-center">
      <img src={rpkmLogo.src} alt="rpkm logo" className="w-full max-w-40" />

      <p className="text-2xl text-foreground">{t("notEligible.title")}</p>

      <Button
        type="button"
        size="lg"
        className="w-full rounded-full"
        onClick={() =>
          logout().then(() => {
            window.location.href = "/landing";
          })
        }
      >
        {t("notEligible.button")}
      </Button>
    </div>
  );
}
