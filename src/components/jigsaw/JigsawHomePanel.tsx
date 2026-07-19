import { ScanLine, CalendarDays, CircleAlert } from "lucide-react";

import { JigsawPanel } from "./JigsawPanel";
import { useT } from "@lib/i18n/useT";

/**
 * Home panel for the jigsaw activity: the bilingual header, the interactive
 * collection panel, and the link to the scan page.
 */
export const JigsawHomePanel = () => {
  const t = useT();

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-6">
      <header className="flex flex-col items-center text-center">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold">{t("jigsaw.title1")}</h1>
          <h1 className="text-3xl font-bold">{t("jigsaw.title2")}</h1>
        </div>
        <div className="flex flex-col items-center mt-2">
          <h2 className="text-base font-bold whitespace-pre-line">
            {t("jigsaw.subtitle")}
          </h2>
        </div>
        <div className="flex flex-col items-center mt-2">
          <p className="flex items-start gap-1 text-base font-normal">
            <CalendarDays className="mt-0.5 size-4.5 shrink-0 text-black" />
            {t("jigsaw.dateRange")}
          </p>
          <p className="flex items-start gap-1 text-base font-normal mt-2">
            <CircleAlert className="mt-0.5 size-4.5 shrink-0 text-black" />
            {t("jigsaw.note")}
          </p>
        </div>
      </header>

      <a
        href="/jigsaw/placeinfo"
        className="flex w-fit h-8.25 items-center -mt-3 justify-center gap-2 rounded-lg border border-foreground p-4 text-center font-bold text-base bg-rpkm-yellow"
      >
        {t("jigsaw.detailButton")}
      </a>

      <JigsawPanel />

      <a
        href="/jigsaw/scan"
        className="flex w-67 h-8.25 items-center justify-center gap-2 rounded-lg border border-foreground p-4 text-center font-bold text-base bg-rpkm-yellow"
      >
        <ScanLine className="size-24px" />
        {t("jigsaw.scanButton")}
      </a>
    </div>
  );
};
