import { Button } from "@components/ui/button";
import {
  HOUSE_CAPACITY,
  getHouseMemberCount,
  type House,
} from "../../consts/house";
import { ChevronLeft, Plus, User } from "lucide-react";
import { MonotoneNoiseContainer } from "@components/shared/MonotoneNoise";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa6";
import { useT } from "@lib/i18n/useT";
import danger_icon from "@assets/icons/danger.svg";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@components/ui/alert-dialog";

const socialMap = {
  facebook: {
    label: "Facebook",
    icon: FaFacebook,
  },
  instagram: {
    label: "Instagram",
    icon: FaInstagram,
  },
  tiktok: {
    label: "TikTok",
    icon: FaTiktok,
  },
} as const;

type HouseDetailViewProps = {
  house: House | null;
  onConfirm: () => void;
  onBack: () => void;
};

export default function HouseDetailView({
  house,
  onConfirm,
  onBack,
}: HouseDetailViewProps) {
  const t = useT();

  if (!house) return null;

  const memberCount = getHouseMemberCount(house);

  return (
    <MonotoneNoiseContainer className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-rpkm-light-blue">
      {/* Header */}
      <div className="flex items-center p-4">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onBack}
          className="rounded-full bg-white text-black"
        >
          <ChevronLeft className="size-6" />
        </Button>
      </div>

      <h1 className="text-center text-xl font-bold text-black">
        {house.name.th}
      </h1>

      {/* House-shaped card, matching Figma Rectangle 6502: an SVG roof
          (stretches horizontally only, keeping the rounded apex and eave
          corners) over a CSS body that grows with the content. */}
      <div className="mx-auto mt-8 w-[calc(100%-1.5rem)] max-w-96">
        <svg
          viewBox="0 0 379 130"
          preserveAspectRatio="none"
          className="block h-32.5 w-full"
          aria-hidden="true"
        >
          <path
            d="M180.949 2.731C186.262 -0.244 192.738 -0.244 198.051 2.731L369.551 98.773C375.077 101.868 378.5 107.708 378.5 114.042V130H0.5V114.042C0.5 107.708 3.923 101.868 9.449 98.773L180.949 2.731Z"
            fill="#80CBE8"
          />
          <path
            d="M0.5 130V114.042C0.5 107.708 3.923 101.868 9.449 98.773L180.949 2.731C186.262 -0.244 192.738 -0.244 198.051 2.731L369.551 98.773C375.077 101.868 378.5 107.708 378.5 114.042V130"
            stroke="#352F31"
            fill="none"
          />
          <path
            d="M180.949 15.5C186.262 12.5 192.738 12.5 198.051 15.5L357 105.5C362.5 108.6 366.5 112 366.5 118V130H12.5V118C12.5 112 16.5 108.6 22 105.5L180.949 15.5Z"
            fill="#ffffff"
          />
          <path
            d="M12.5 130V118C12.5 112 16.5 108.6 22 105.5L180.949 15.5C186.262 12.5 192.738 12.5 198.051 15.5L357 105.5C362.5 108.6 366.5 112 366.5 118V130"
            stroke="#352F31"
            fill="none"
          />
        </svg>

        <div className="-mt-px rounded-b-[18px] border-x border-b border-[#352F31] bg-[#80CBE8] px-3 pb-3">
          <div>
            <div className="flex flex-col items-center gap-3 rounded-b-[10px] border-x border-b border-[#352F31] bg-white px-4 pb-12 text-center">
              <div className="-mt-14 flex size-10 items-center justify-center rounded-full border bg-rpkm-red text-lg text-white">
                {house.size.toLowerCase()}
              </div>

              <div className="flex items-center gap-1 text-sm">
                <span>
                  <span className="text-rpkm-red">{memberCount}</span>
                  <span className="text-black">/{HOUSE_CAPACITY}</span>
                </span>
                <User className="size-4 text-black" />
              </div>

              <img
                src={house.logoUrl}
                alt={house.name.th}
                className="w-24 rounded-md border bg-white object-contain"
              />

              <h2 className="text-xl font-bold text-black">{house.name.th}</h2>
              <p className="whitespace-break-spaces text-gray-600">
                {house.description.th}
              </p>

              <h2 className="text-xl font-bold text-black">
                {house.name.en.toUpperCase()}
              </h2>
              <p className="whitespace-break-spaces text-gray-600">
                {house.description.en}
              </p>

              <div className="flex flex-col gap-1">
                {Object.entries(house.link).map(([platform, url]) => {
                  if (!url) return null;

                  const { label, icon: Icon } =
                    socialMap[platform as keyof typeof socialMap];

                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 text-rpkm-red"
                    >
                      <Icon className="size-5" />
                      <span>{label}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add this house */}
      <div className="flex justify-center py-8">
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <button
                type="button"
                className="flex items-center gap-2 rounded-full border bg-rpkm-beige py-2 pl-4 pr-6"
              />
            }
          >
            <span className="rounded-full border bg-rpkm-red p-1">
              <span className="flex items-center justify-center rounded-full border bg-rpkm-beige p-1.5">
                <Plus className="size-5 text-black" />
              </span>
            </span>
            <span className="text-xl font-bold text-black">
              {t("house.detail.addHouse")}
            </span>
          </AlertDialogTrigger>

          <AlertDialogContent className="pt-10">
            <AlertDialogClose />
            <AlertDialogHeader>
              <AlertDialogMedia className="absolute top-0 h-fit w-full translate-y-[-50%] rounded-2xl border bg-red-500 py-2">
                <img src={danger_icon.src} alt="danger" />
              </AlertDialogMedia>

              <AlertDialogTitle className="text-xl font-bold text-black">
                {t("house.ranking.selectHouseConfirmTitle")}
              </AlertDialogTitle>

              <AlertDialogDescription className="whitespace-break-spaces text-lg text-black">
                {t("house.ranking.selectHouseConfirmDescription", {
                  House: house.name.th,
                })}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="flex justify-center gap-4">
              <AlertDialogAction
                className="bg-red-500 text-white"
                onClick={onConfirm}
              >
                {t("walkrally.events.confirm")}
              </AlertDialogAction>

              <AlertDialogCancel>
                {t("walkrally.events.cancel")}
              </AlertDialogCancel>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MonotoneNoiseContainer>
  );
}
