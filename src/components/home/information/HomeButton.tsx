import { Button, buttonVariants } from "@components/ui/button";
import { getImageUrl } from "@lib/function";
import { useT } from "@lib/i18n/useT";
import { useProfile } from "@lib/auth/useProfile";
import { cn } from "@lib/utils";
import { ChevronRight } from "lucide-react";
import scanIcon from "@assets/images/scan.svg";

const houseButtonUrl = getImageUrl("house_button.svg");
const jigsawButtonUrl = getImageUrl("jigsaw_button.svg");
const stampButtonUrl = getImageUrl("stamp_button.svg");
const freshyButtonUrl = getImageUrl("freshy_button.svg");

interface ShapeButtonProps {
  href: string;
  label: string;
  imageUrl?: string;
  capRatio: string; // aspect-ratio "width / height"
  fill: string;
  dark?: boolean;
  roundedBottom?: boolean;
}

function ShapeButton({
  href,
  label,
  imageUrl,
  capRatio,
  fill,
  roundedBottom,
}: ShapeButtonProps) {
  return (
    <a href={href} className="flex w-full flex-col">
      <div className="w-full overflow-hidden" style={{ aspectRatio: capRatio }}>
        <img src={imageUrl} alt="" className="block w-full" />
      </div>
      <div
        className={cn(
          "flex flex-col items-center gap-1 border border-t-0 border-foreground px-2 py-2",
          roundedBottom && "rounded-b-2xl",
        )}
        style={{ backgroundColor: fill }}
      >
        <span
          className={cn("text-center text-xs font-bold", "text-foreground")}
        >
          {label}
        </span>
        <Button
          aria-hidden="true"
          tabIndex={-1}
          variant="outline"
          size="icon-xs"
          className={cn(
            "pointer-events-none rounded-full",
            "border-foreground bg-background",
          )}
          iconStart={<ChevronRight className="text-foreground" />}
        />
      </div>
    </a>
  );
}

const HomeButton = () => {
  const t = useT();
  const profile = useProfile();
  const isStaff = profile.status === "ready" && profile.me.role === "staff";

  if (isStaff) {
    return (
      <a
        href="/staff/register"
        className={cn(
          buttonVariants({ variant: "default" }),
          "h-auto w-full flex-col gap-2 py-6",
        )}
      >
        <img src={scanIcon.src} alt="" className="size-8" />
        <span>{t("nav.scanRegister")}</span>
      </a>
    );
  }

  return (
    <>
      {/* TODO: Add Profile Card for Student */}

      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-foreground">
          {t("home.information.registerTitle")}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="min-w-0">
            <ShapeButton
              href="/house"
              imageUrl={houseButtonUrl}
              capRatio="100 / 33"
              fill="#FFF27C"
              roundedBottom
              label={t("home.information.register.friendHouse")}
            />
          </div>
          <div className="min-w-0">
            <ShapeButton
              href="/activity"
              imageUrl={houseButtonUrl}
              capRatio="100 / 33"
              fill="#FFF27C"
              roundedBottom
              label={t("home.information.register.activity")}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-foreground">
          {t("home.information.gameTitle")}
        </h2>
        <div className="grid grid-cols-3 items-start gap-3">
          <div className="min-w-0">
            <ShapeButton
              href="/jigsaw"
              imageUrl={jigsawButtonUrl}
              capRatio="4/3"
              fill="#6ABF73"
              label={t("home.information.games.jigsaw")}
            />
          </div>
          <div className="min-w-0">
            <ShapeButton
              href="/stamp"
              imageUrl={stampButtonUrl}
              capRatio="4/3"
              fill="#6ABF73"
              label={t("home.information.games.stamp")}
            />
          </div>
          <div className="min-w-0">
            <ShapeButton
              href="/freshy-story"
              imageUrl={freshyButtonUrl}
              capRatio="4/3"
              fill="#6ABF73"
              label={t("home.information.games.myFreshyStory")}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeButton;
