import { ChevronRight } from "lucide-react";
import { useStore } from "@nanostores/react";
import { useProfile } from "@lib/auth/useProfile";
import { isUnlocked, getUnlockAt, type GatedEventKey } from "@lib/guard";
import { useT } from "@lib/i18n/useT";
import { $locale } from "@lib/i18n/locale";
import { buttonVariants } from "@components/ui/button";
import { cn } from "@lib/utils";
import Calendar from "./Calendar";
import rpkmLogo from "@assets/images/artboard_1.svg";
import registerHouseIcon from "@assets/images/home/register-house.png";
import registerActivityIcon from "@assets/images/home/register-activity.png";
import jigsawTrophy from "@assets/images/home/game-jigsaw-trophy.png";
import qrQuestTrophy from "@assets/images/home/game-qrquest-trophy.png";
import freshyTrophy from "@assets/images/home/game-freshy-trophy.png";

function unlockDateLabel(key: GatedEventKey, locale: "th" | "en") {
  const formatter = new Intl.DateTimeFormat(
    locale === "th" ? "th-TH" : "en-US",
    {
      day: "numeric",
      month: "short",
    },
  );
  return formatter.format(new Date(getUnlockAt(key)));
}

interface RegisterButtonProps {
  href: string;
  iconUrl: string;
  title: string;
  description: string;
}

function RegisterButton({
  href,
  iconUrl,
  title,
  description,
}: RegisterButtonProps) {
  return (
    <a
      href={href}
      className="flex w-full items-center gap-4 rounded-[15px] border border-foreground bg-rpkm-red p-3"
    >
      <img src={iconUrl} alt="" className="size-13.5 shrink-0" />
      <div className="flex min-w-0 flex-1 items-start gap-2">
        <div className="flex min-w-0 flex-1 flex-col gap-1 text-background">
          <p className="text-[16px] leading-tight font-bold">{title}</p>
          <p className="text-[11px] leading-snug whitespace-pre-line opacity-90">
            {description}
          </p>
        </div>
        <ChevronRight className="mt-0.5 size-4 shrink-0 text-background" />
      </div>
    </a>
  );
}

interface GameCardProps {
  href: string;
  trophyUrl: string;
  title: string;
  description: string;
  disabled?: boolean;
  disabledLabel?: string;
}

function GameCard({
  href,
  trophyUrl,
  title,
  description,
  disabled,
  disabledLabel,
}: GameCardProps) {
  return (
    <a
      href={disabled ? undefined : href}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : undefined}
      className={cn(
        "flex min-w-0 flex-1 flex-col items-center gap-2 text-center",
        disabled && "pointer-events-none grayscale opacity-60",
      )}
    >
      <img src={trophyUrl} alt="" className="h-15.75 w-auto" />
      <div className="flex items-center justify-center gap-1.5">
        <p className="text-[16px] leading-tight font-bold text-foreground">
          {title}
        </p>
        <ChevronRight className="size-2.5 shrink-0 text-foreground" />
      </div>
      <p className="text-[11px] leading-tight text-foreground">
        {disabled ? disabledLabel : description}
      </p>
    </a>
  );
}

const InformationPanel = () => {
  const t = useT();
  const locale = useStore($locale);
  const profile = useProfile();
  const isStaff = profile.status === "ready" && profile.me.staffRole !== null;
  const freshyStoryLocked = !isUnlocked("freshyStory");
  const chulaQrQuestLocked = !isUnlocked("chulaQrQuest");
  const jigsawLocked = !isUnlocked("jigsaw");

  const unlockLabel = (key: GatedEventKey) =>
    t("home.information.games.opensOn", { date: unlockDateLabel(key, locale) });

  return (
    <div className="flex w-full flex-col gap-12">
      {!isStaff && (
        <>
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-rpkm-red">
              {t("home.information.registerTitle")}
            </h2>
            <div className="flex flex-col gap-4">
              <RegisterButton
                href="/house"
                iconUrl={registerHouseIcon.src}
                title={t("home.information.register.friendHouse")}
                description={t("home.information.register.friendHouseDesc")}
              />
              <RegisterButton
                href="/activity"
                iconUrl={registerActivityIcon.src}
                title={t("home.information.register.activity")}
                description={t("home.information.register.activityDesc")}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-rpkm-red">
              {t("home.information.gameTitle")}
            </h2>
            <div className="flex flex-col gap-8">
              <div className="flex items-start gap-4">
                <GameCard
                  href="/jigsaw"
                  trophyUrl={jigsawTrophy.src}
                  title={t("home.information.games.jigsaw")}
                  description={t("home.information.games.jigsawDesc")}
                  disabled={jigsawLocked}
                  disabledLabel={unlockLabel("jigsaw")}
                />
                <GameCard
                  href="/qrquest"
                  trophyUrl={qrQuestTrophy.src}
                  title={t("home.information.games.stamp")}
                  description={t("home.information.games.stampDesc")}
                  disabled={chulaQrQuestLocked}
                  disabledLabel={unlockLabel("chulaQrQuest")}
                />
              </div>
              <div className="flex justify-center">
                <div className="w-1/2 min-w-0">
                  <GameCard
                    href="/freshy-story"
                    trophyUrl={freshyTrophy.src}
                    title={t("home.information.games.myFreshyStory")}
                    description={t("home.information.games.myFreshyStoryDesc")}
                    disabled={freshyStoryLocked}
                    disabledLabel={unlockLabel("freshyStory")}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-rpkm-red">
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
