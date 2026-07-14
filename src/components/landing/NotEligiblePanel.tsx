import topLanding from "@assets/images/top_landing.svg";
import centerLanding from "@assets/images/house_blank.svg";
import { Button } from "@components/ui/button";
import { MonotoneNoise } from "@components/shared/MonotoneNoise";
import { logout } from "@lib/auth/session";
import { useT } from "@lib/i18n/useT";

export function NotEligiblePanel() {
  const t = useT();

  return (
    <div className="relative flex w-full flex-col self-start overflow-x-clip bg-background pb-20.5">
      {/* noise ? */}
      <MonotoneNoise
        noiseColor="rgba(0 0 0 / 0.25)"
        className="pointer-events-none absolute inset-0 -z-1"
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-1 flex justify-between">
        <img src={topLanding.src} alt="" className="w-32" />
        <img src={topLanding.src} alt="" className="w-32 -scale-x-100" />
      </div>

      <div className={`relative z-2 px-4 mt-28`}>
        <div className="@container relative mx-auto w-full max-w-92.5">
          <img src={centerLanding.src} alt="" className="w-full" />

          <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center px-[10%] text-center">
            <p className="text-foreground text-2xl font-bold">
              {t("notEligible.title")}
            </p>
          </div>

          <div className="absolute inset-x-0 bottom-[6.28%] flex justify-center">
            <Button
              type="button"
              variant="default"
              size="xl"
              className="h-[13.24cqw] w-[54.9cqw] px-0 text-[5.55cqw]"
              onClick={() =>
                logout().then(() => {
                  window.location.href = "/landing";
                })
              }
            >
              {t("notEligible.button")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
