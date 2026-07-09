import { useStore } from "@nanostores/react";

import { Button } from "@components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@components/ui/drawer";
import { $locale, setLocale } from "@lib/i18n/locale";
import { useT } from "@lib/i18n/useT";
import { HomeIcon, Menu } from "lucide-react";
import rpkmLogo from "@assets/images/rpkm_logo.png";

// not shadcn sidebar. actually a drawer
export function NavigationMenu() {
  const locale = useStore($locale);
  const t = useT();

  return (
    <Drawer swipeDirection="up">
      <DrawerTrigger
        render={
          <DrawerClose className="p-2 rounded active:bg-accent">
            <Menu className="size-6.5 text-foreground" />
          </DrawerClose>
        }
      />

      <DrawerContent className="select-none">
        <div className="sm:w-md sm:mx-auto ">
          <DrawerHeader className="flex flex-row items-start justify-between pt-8 px-8 pr-5">
            <img src={rpkmLogo.src} alt="rpkm logo" className="size-20" />
            <div className="flex items-center gap-0.5">
              <Button
                type="button"
                variant="ghost"
                className="text-lg active:bg-accent p-2 size-10.5 rounded"
                onClick={() => setLocale(locale === "th" ? "en" : "th")}
              >
                {locale === "th" ? "TH" : "EN"}
              </Button>

              <DrawerClose className="p-2 rounded active:bg-accent">
                <Menu className="size-6.5 text-foreground" />
              </DrawerClose>
            </div>
          </DrawerHeader>

          <section className="mt-6 text-base font-bold px-4">
            <a
              href="/"
              className="flex w-full items-center py-3.5 rounded px-4 gap-2 active:bg-accent"
            >
              <HomeIcon size={24} />
              <span className="pt-1">{t("nav.home")}</span>
            </a>

            {/* TODO: link? */}
          </section>

          <div className="flex items-center justify-center w-full pt-6 pb-8">
            <Button
              size="lg"
              variant={"destructive"}
              className="text-lg px-6 py-3"
            >
              {t("nav.logout")}
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
