import { Button } from "@components/ui/button";
import type { House } from "../../consts/house";
import { ChevronLeft } from "lucide-react";
import bg from "@assets/images/house/house_detail_background.svg";
import { MonotoneNoiseContainer } from "@components/shared/MonotoneNoise";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa6";

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
  if (!house) return null;

  return (
    <MonotoneNoiseContainer className="fixed inset-0 z-50 bg-rpkm-light-blue flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 text-white">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onBack}
          className="rounded-full text-black hover:bg-rpkm-red/80"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
      </div>
      <div>
        <h1 className="text-2xl font-bold flex-1 text-center h-fit">
          {house.name.th}
        </h1>
      </div>

      <div className="relative w-full px-2">
        <img src={bg.src} alt="" className="w-full h-auto" />

        <div className="absolute inset-0 flex flex-col items-center justify-start mt-[20%]">
          <div className="flex size-10 items-center justify-center rounded-full border bg-rpkm-red text-lg font-normal text-white">
            {house.size.toLowerCase()}
          </div>
          <div>
            <span>{12 / 500}</span>
          </div>
          <img
            src={house.logoUrl}
            alt={house.name.th}
            className="w-[30%] object-contain rounded-xl border"
          />
          <h1 className="text-3xl font-bold ">{house.name.th}</h1>
          <p className="text-center whitespace-break-spaces">
            {house.description.th}
          </p>
          <h1 className="text-3xl font-bold">{house.name.en}</h1>
          <p className="text-center whitespace-break-spaces">
            {house.description.en}
          </p>

          <div className="flex w-fit flex-col">
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
                  className="flex items-center justify-center gap-2 rounded-xl text-rpkm-red"
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer with Confirm Button */}
      <div className="border-t bg-white p-4 sticky bottom-0">
        <Button
          className="w-full bg-rpkm-red text-white rounded-xl py-6 text-lg font-semibold hover:bg-rpkm-red/90 transition"
          onClick={onConfirm}
        >
          Select This House
        </Button>
      </div>
    </MonotoneNoiseContainer>
  );
}
