import { buttonVariants } from "@components/ui/button";
import { useT } from "@lib/i18n/useT";
import { cn } from "@lib/utils";

import rpkmLogo from "@assets/images/rpkm_logo.png";

export function NotEligibleContent() {
  const t = useT();

  return (
    <div className="flex h-full flex-col items-center justify-between gap-6 rounded-3xl bg-primary px-8 py-10 text-center">
      <img src={rpkmLogo.src} alt="rpkm logo" className="w-full max-w-40" />

      <p className="text-2xl text-foreground">{t("notEligible.title")}</p>

      <a
        href="/landing"
        className={cn(
          buttonVariants({ variant: "default", size: "lg" }),
          "w-full rounded-full",
        )}
      >
        {t("notEligible.button")}
      </a>
    </div>
  );
}
