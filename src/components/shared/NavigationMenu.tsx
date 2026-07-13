import { useStore } from "@nanostores/react";

import { Button } from "@components/ui/button";
import { cn } from "@lib/utils";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@components/ui/drawer";
import { $locale, setLocale } from "@lib/i18n/locale";
import { useT } from "@lib/i18n/useT";
import { Menu } from "lucide-react";
import rpkmLogo from "@assets/images/rpkm_logo.png";
import homeIcon from "@assets/images/home.svg";
import scanIcon from "@assets/images/scan.svg";
import qrCodeIcon from "@assets/images/qr-code.svg";
import houseIcon from "@assets/images/family-home.svg";
import peopleIcon from "@assets/images/people.svg";
import editIcon from "@assets/images/edit.svg";
import calendarIcon from "@assets/images/calendar-month.svg";
import emergencyIcon from "@assets/images/call.svg";

const navItemClassName =
  "flex w-full items-center py-3.5 rounded px-4 gap-2 active:bg-accent";

interface NavigationMenuProps {
  showBorder?: boolean;
}

// not shadcn sidebar. actually a drawer
export function NavigationMenu({ showBorder }: NavigationMenuProps) {
  const isStaff = false;
  const locale = useStore($locale);
  const t = useT();

  return (
    <Drawer swipeDirection="up">
      <DrawerTrigger
        render={
          <DrawerClose
            className={cn(
              "p-2 rounded active:bg-accent",
              showBorder && "border border-black bg-white rounded-full",
            )}
          >
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
                variant="outline"
                className="border-none text-lg active:bg-accent p-2 size-10.5 rounded"
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
            <DrawerClose
              nativeButton={false}
              render={
                <a href="/" className={navItemClassName}>
                  <img src={homeIcon.src} alt="" className="size-6" />
                  <span className="pt-1">{t("nav.home")}</span>
                </a>
              }
            />

            {/* TODO: link? */}
            {isStaff ? (
              <DrawerClose
                nativeButton={false}
                render={
                  <a href="/staff/register" className={navItemClassName}>
                    <img src={scanIcon.src} alt="" className="size-6" />
                    <span className="pt-1">{t("nav.scanRegister")}</span>
                  </a>
                }
              />
            ) : (
              <>
                {/* TODO: open QR code dialog instead of a plain link */}
                <DrawerClose
                  nativeButton={false}
                  render={
                    <a href="/" className={navItemClassName}>
                      <img src={qrCodeIcon.src} alt="" className="size-6" />
                      <span className="pt-1">{t("nav.qrCode")}</span>
                    </a>
                  }
                />

                {/* TODO: link? */}
                <DrawerClose
                  nativeButton={false}
                  render={
                    <a href="/house" className={navItemClassName}>
                      <img src={houseIcon.src} alt="" className="size-6" />
                      <span className="pt-1">{t("nav.chooseHouse")}</span>
                    </a>
                  }
                />

                {/* TODO: link? */}
                <DrawerClose
                  nativeButton={false}
                  render={
                    <a href="/house" className={navItemClassName}>
                      <img src={peopleIcon.src} alt="" className="size-6" />
                      <span className="pt-1">{t("nav.groupPairing")}</span>
                    </a>
                  }
                />

                <DrawerClose
                  nativeButton={false}
                  render={
                    <a href="/house" className={navItemClassName}>
                      <img src={editIcon.src} alt="" className="size-6" />
                      <span className="pt-1">{t("nav.editInfo")}</span>
                    </a>
                  }
                />
              </>
            )}

            <DrawerClose
              nativeButton={false}
              render={
                <a href="/#rpkm-calendar" className={navItemClassName}>
                  <img src={calendarIcon.src} alt="" className="size-6" />
                  <span className="pt-1">{t("nav.calendar")}</span>
                </a>
              }
            />

            <DrawerClose
              nativeButton={false}
              render={
                <a href="/emergency" className={navItemClassName}>
                  <img src={emergencyIcon.src} alt="" className="size-6" />
                  <span className="pt-1">{t("emergency.title")}</span>
                </a>
              }
            />
          </section>

          <div className="flex items-center justify-center w-full pt-6 pb-8">
            <Button size="lg" className="text-lg px-6 py-3">
              {t("nav.logout")}
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
