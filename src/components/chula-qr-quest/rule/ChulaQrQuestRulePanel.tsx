import { ChevronRight } from "lucide-react";
import { buttonVariants } from "@components/ui/button";
import { useT } from "@lib/i18n/useT";
import { cn } from "@lib/utils";

const ChulaQrQuestRulePanel = () => {
  const t = useT();

  return (
    <div className="w-full flex flex-col gap-4">
      <h1 className="text-3xl font-bold pb-4 text-wrap whitespace-normal text-center">
        {t("chulaQrQuest.rule.title")}
      </h1>

      {/* Step1 */}
      <div className="relative flex flex-col items-center gap-3 rounded-[1.15rem] border border-foreground bg-rpkm-green p-2 sm:gap-4 sm:p-3 min-[360px]:flex-row">
        <div className="relative size-30 flex items-center justify-center rounded-4xl border border-foreground bg-rpkm-light-blue sm:size-28">
          <p className="font-bold text-4xl">1</p>
        </div>

        <div className="min-w-0 flex-1 border border-foreground bg-rpkm-beige rounded-4xl px-6 py-4 h-full">
          <h2 className="text-2xl font-bold">
            {t("chulaQrQuest.rule.step1.title")}
          </h2>
          <p className="mt-2 text-sm">{t("chulaQrQuest.rule.step1.text")}</p>
        </div>
      </div>

      {/* Step2 */}
      <div className="relative flex flex-col items-center gap-3 rounded-[1.15rem] border border-foreground bg-rpkm-green p-2 sm:gap-4 sm:p-3 min-[360px]:flex-row">
        <div className="relative size-30 flex items-center justify-center rounded-4xl border border-foreground bg-rpkm-light-blue sm:size-28">
          <p className="font-bold text-4xl">2</p>
        </div>

        <div className="min-w-0 flex-1 border border-foreground bg-rpkm-beige rounded-4xl px-6 py-4 h-full">
          <h2 className="text-2xl font-bold">
            {t("chulaQrQuest.rule.step2.title")}
          </h2>
          <p className="mt-2 text-sm">{t("chulaQrQuest.rule.step2.text")}</p>
          <a
            href="/chula-qr-quest"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "mt-3 w-fit gap-1",
            )}
          >
            {t("chulaQrQuest.rule.step2.button")}
            <ChevronRight className="size-4" />
          </a>
        </div>
      </div>

      {/* Step3 */}
      <div className="relative flex flex-col items-center gap-3 rounded-[1.15rem] border border-foreground bg-rpkm-green p-2 sm:gap-4 sm:p-3 min-[360px]:flex-row">
        <div className="relative size-30 flex items-center justify-center rounded-4xl border border-foreground bg-rpkm-light-blue sm:size-28">
          <p className="font-bold text-4xl">3</p>
        </div>

        <div className="min-w-0 flex-1 border border-foreground bg-rpkm-beige rounded-4xl px-6 py-4 h-full">
          <h2 className="text-2xl font-bold">
            {t("chulaQrQuest.rule.step3.title")}
          </h2>
          <p className="mt-2 text-sm">{t("chulaQrQuest.rule.step3.text")}</p>
        </div>
      </div>

      {/* Step4 */}
      <div className="relative flex flex-col items-center gap-3 rounded-[1.15rem] border border-foreground bg-rpkm-green p-2 sm:gap-4 sm:p-3 min-[360px]:flex-row">
        <div className="relative size-30 flex items-center justify-center rounded-4xl border border-foreground bg-rpkm-light-blue sm:size-28">
          <p className="font-bold text-4xl">4</p>
        </div>

        <div className="min-w-0 flex-1 border border-foreground bg-rpkm-beige rounded-4xl px-6 py-4 h-full">
          <h2 className="text-2xl font-bold">
            {t("chulaQrQuest.rule.step4.title")}
          </h2>
          <p className="mt-2 text-sm">{t("chulaQrQuest.rule.step4.text")}</p>
        </div>
      </div>

      {/* Step5 */}
      <div className="relative flex flex-col items-center gap-3 rounded-[1.15rem] border border-foreground bg-rpkm-green p-2 sm:gap-4 sm:p-3 min-[360px]:flex-row">
        <div className="relative size-30 flex items-center justify-center rounded-4xl border border-foreground bg-rpkm-light-blue sm:size-28">
          <p className="font-bold text-4xl">5</p>
        </div>

        <div className="min-w-0 flex-1 border border-foreground bg-rpkm-beige rounded-4xl px-6 py-4 h-full">
          <h2 className="text-2xl font-bold">
            {t("chulaQrQuest.rule.step5.title")}
          </h2>
          <p className="mt-2 text-sm">{t("chulaQrQuest.rule.step5.text")}</p>
          <a
            href="/chula-qr-quest/reward"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "mt-3 w-fit gap-1",
            )}
          >
            {t("chulaQrQuest.rule.step5.button")}
            <ChevronRight className="size-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ChulaQrQuestRulePanel;
