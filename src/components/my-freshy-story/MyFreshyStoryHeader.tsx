import { useT } from "@lib/i18n/useT";
import { CalendarDaysIcon } from "lucide-react";

export default function MyFreshyStory() {
  const t = useT();

  return (
    <header className="w-full px-6">
      <h1 className="text-4xl font-bold">My Freshy Story</h1>
      <p className="font-bold text-lg mt-4 mb-2">
        {t("myfreshystory.header.description")}
      </p>
      <section>
        <p className="font-bold flex items-center gap-1">
          <CalendarDaysIcon />
          {t("myfreshystory.header.date")}
        </p>
      </section>
    </header>
  );
}
