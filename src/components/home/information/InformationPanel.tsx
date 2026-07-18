import { ChevronRight, Lock } from "lucide-react";
import { getImageUrl } from "@lib/function";
import { useProfile } from "@lib/auth/useProfile";
import { isUnlocked } from "@lib/guard";
import { useT } from "@lib/i18n/useT";
import { Button, buttonVariants } from "@components/ui/button";
import { cn } from "@lib/utils";
import Calendar from "./Calendar";
import rpkmLogo from "@assets/images/artboard_1.svg";

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
  disabled?: boolean;
  disabledLabel?: string;
}

function ShapeButton({
  href,
  label,
  imageUrl,
  capRatio,
  fill,
  roundedBottom,
  disabled,
  disabledLabel,
}: ShapeButtonProps) {
  return (
    <a
      href={disabled ? undefined : href}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : undefined}
      className={cn(
        "flex w-full flex-col",
        disabled && "pointer-events-none grayscale opacity-50",
      )}
    >
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
        {disabled && disabledLabel && (
          <span className="text-center text-[0.65rem] text-foreground/70">
            {disabledLabel}
          </span>
        )}
        <Button
          aria-hidden="true"
          tabIndex={-1}
          variant="outline"
          size="icon-xs"
          className={cn(
            "pointer-events-none rounded-full",
            "border-foreground bg-background",
          )}
          iconStart={
            disabled ? (
              <Lock className="text-foreground" />
            ) : (
              <ChevronRight className="text-foreground" />
            )
          }
        />
      </div>
    </a>
  );
}

const InformationPanel = () => {
  const t = useT();
  const profile = useProfile();
  const isStaff = profile.status === "ready" && profile.me.role === "staff";
  const freshyStoryLocked = !isUnlocked("freshyStory");
  const chulaQrQuestLocked = !isUnlocked("chulaQrQuest");
  const jigsawLocked = !isUnlocked("jigsaw");

  return (
    <div className="flex w-full flex-col gap-12">
      {!isStaff && (
        <>
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
                  disabled={jigsawLocked}
                  disabledLabel={t("home.information.games.comingSoon")}
                />
              </div>
              <div className="min-w-0">
                <ShapeButton
                  href="/qrquest"
                  imageUrl={stampButtonUrl}
                  capRatio="4/3"
                  fill="#6ABF73"
                  label={t("home.information.games.stamp")}
                  disabled={chulaQrQuestLocked}
                  disabledLabel={t("home.information.games.comingSoon")}
                />
              </div>
              <div className="min-w-0">
                <ShapeButton
                  href="/freshy-story"
                  imageUrl={freshyButtonUrl}
                  capRatio="4/3"
                  fill="#6ABF73"
                  label={t("home.information.games.myFreshyStory")}
                  disabled={freshyStoryLocked}
                  disabledLabel={t("home.information.games.comingSoon")}
                />
              </div>
            </div>
          </div>
        </>
      )}

      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-foreground">
          {t("home.information.informationTitle")}
        </h2>
        <Calendar />
      </div>

      <a
        href="/emergency"
        className={cn(
          buttonVariants({ variant: "outline", size: "lg" }),
          "w-fit self-center px-6 py-4",
        )}
      >
        {t("emergency.title")}
      </a>

      <div className="mt-16 flex justify-center sm:mt-24">
        <img
          src={rpkmLogo.src}
          alt="รับเพื่อนก้าวใหม่"
          className="h-32 w-fit sm:h-40"
        />
      </div>
    </div>
  );
};

export default InformationPanel;
