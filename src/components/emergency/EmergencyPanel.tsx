import { useStore } from "@nanostores/react";
import { buttonVariants } from "@components/ui/button";
import { $locale } from "@lib/i18n/locale";
import { useT } from "@lib/i18n/useT";
import { cn } from "@lib/utils";
import { PhoneCall } from "lucide-react";
import emergencies from "./emergency.json";

export type EmergencyType = {
  nameTh: string;
  nameEn: string;
  tel1: string;
  tel2: string;
};

const EmergencyPanel = () => {
  const t = useT();
  const locale = useStore($locale);

  return (
    <>
      {/*  Header  */}
      <div className="w-full flex flex-col items-center gap-2 text-rpkm-red">
        <PhoneCall />
        <p className="text-2xl font-bold text-center">{t("emergency.title")}</p>
      </div>

      <div className="w-full flex flex-col gap-4 text-wrap">
        {emergencies.map((e) => {
          const phone1: string = e.tel1 ?? "";
          const phone2: string = e.tel2 ?? "";
          return (
            <div
              key={e.nameTh}
              className={cn(
                buttonVariants({ variant: "default" }),
                "h-fit rounded-full bg-rpkm-red text-white hover:bg-rpkm-red/85 px-6 py-3 flex flex-col gap-1 items-center whitespace-normal",
              )}
            >
              <div className="flex flex-wrap justify-center gap-x-5 gap-y-1">
                {phone1 && (
                  <a
                    href={`tel:${phone1.replace(/-/g, "")}`}
                    className="flex items-center gap-2"
                  >
                    <PhoneCall className="size-4" fill="white" />
                    <span>{phone1}</span>
                  </a>
                )}
                {phone2 && (
                  <a
                    href={`tel:${phone2.replace(/-/g, "")}`}
                    className="flex items-center gap-2"
                  >
                    <PhoneCall className="size-4" fill="white" />
                    <span>{phone2}</span>
                  </a>
                )}
              </div>

              <p>{locale === "th" ? e.nameTh : e.nameEn}</p>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default EmergencyPanel;
