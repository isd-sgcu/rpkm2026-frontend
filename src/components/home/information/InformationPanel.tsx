import { useT } from "@lib/i18n/useT";
import { buttonVariants } from "@components/ui/button";
import { cn } from "@lib/utils";
import Calendar from "./Calendar";
import rpkmLogo from "@assets/images/artboard_1.svg";

const InformationPanel = () => {
  const t = useT();

  return (
    <div className="flex w-full flex-col gap-12">
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
