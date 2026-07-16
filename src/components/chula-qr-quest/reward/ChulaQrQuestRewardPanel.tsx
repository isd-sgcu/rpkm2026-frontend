import { Check, Lock } from "lucide-react";
import { useT } from "@lib/i18n/useT";
import { cn } from "@lib/utils";
import trophyImage from "@assets/images/trophy.svg";
import instagramIcon from "@assets/images/instagram_icon.svg";

// TODO: fetch the user's collected stamp count from API
const collectedStamps = 7;
const TOTAL_STAMPS = 35;

const ChulaQrQuestRewardPanel = () => {
  const t = useT();

  return (
    <div className="w-full flex flex-col gap-4">
      <h1 className="text-3xl font-bold text-rpkm-red pb-4 text-wrap whitespace-normal text-center">
        {t("chulaQrQuest.reward.title")}
      </h1>

      <img src={trophyImage.src} alt="" className="w-full" />

      <div className="grid grid-cols-3 gap-2">
        {/* Silver */}
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-foreground bg-rpkm-silver p-3 text-center">
          <span className="text-sm font-bold">Silver Set</span>
          <span className="rounded-full border border-foreground bg-background px-2 py-1 text-xs font-bold text-wrap">
            {t("chulaQrQuest.reward.pointsRequirement", { points: "10" })}
          </span>
          <span
            className={cn(
              "flex items-center gap-1 text-xs font-bold",
              collectedStamps >= 10
                ? "text-rpkm-green"
                : "text-muted-foreground",
            )}
          >
            {collectedStamps >= 10 ? (
              <Check className="size-3.5 shrink-0" />
            ) : (
              <Lock className="size-3.5 shrink-0" />
            )}
            {collectedStamps >= 10
              ? t("chulaQrQuest.reward.unlocked")
              : t("chulaQrQuest.reward.locked")}
          </span>
        </div>

        {/* Gold */}
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-foreground bg-rpkm-gold p-3 text-center">
          <span className="rounded-full bg-rpkm-yellow px-2 py-0.5 text-sm font-bold">
            Gold Set
          </span>
          <span className="rounded-full border border-foreground bg-rpkm-yellow px-2 py-1 text-xs font-bold text-wrap">
            {t("chulaQrQuest.reward.pointsRequirement", { points: "15" })}
          </span>
          <span
            className={cn(
              "flex items-center gap-1 text-xs font-bold",
              collectedStamps >= 15
                ? "text-rpkm-green"
                : "text-muted-foreground",
            )}
          >
            {collectedStamps >= 15 ? (
              <Check className="size-3.5 shrink-0" />
            ) : (
              <Lock className="size-3.5 shrink-0" />
            )}
            {collectedStamps >= 15
              ? t("chulaQrQuest.reward.unlocked")
              : t("chulaQrQuest.reward.locked")}
          </span>
        </div>

        {/* Bronze */}
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-foreground bg-rpkm-bronze p-3 text-center">
          <span className="text-sm font-bold">Bronze Set</span>
          <span className="rounded-full border border-foreground bg-background px-2 py-1 text-xs font-bold text-wrap">
            {t("chulaQrQuest.reward.pointsRequirement", { points: "5" })}
          </span>
          <span
            className={cn(
              "flex items-center gap-1 text-xs font-bold",
              collectedStamps >= 5
                ? "text-rpkm-green"
                : "text-muted-foreground",
            )}
          >
            {collectedStamps >= 5 ? (
              <Check className="size-3.5 shrink-0" />
            ) : (
              <Lock className="size-3.5 shrink-0" />
            )}
            {collectedStamps >= 5
              ? t("chulaQrQuest.reward.unlocked")
              : t("chulaQrQuest.reward.locked")}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 rounded-3xl border border-foreground bg-rpkm-light-blue p-4 text-center">
        <div className="flex flex-col items-center gap-2 pt-2 text-center text-sm">
          <h2>{t("chulaQrQuest.reward.footerNote")}</h2>
          <a
            href="https://www.instagram.com/rubpuenkaomai2026/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-bold text-rpkm-red"
          >
            <img src={instagramIcon.src} alt="" className="size-5" />
            @rubpuenkaomai2026
          </a>
        </div>
        <div className="relative h-6 w-full overflow-hidden rounded-full border border-foreground bg-background">
          <div
            className="h-full bg-rpkm-yellow"
            style={{
              width: `${Math.min(100, (collectedStamps / TOTAL_STAMPS) * 100)}%`,
            }}
          />
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
            {t("chulaQrQuest.reward.collectedProgress", {
              collected: String(collectedStamps),
              total: String(TOTAL_STAMPS),
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChulaQrQuestRewardPanel;
