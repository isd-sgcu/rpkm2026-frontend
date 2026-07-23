import type { House } from "../../consts/house";
import { useT } from "@lib/i18n/useT";
import { FaInstagram } from "react-icons/fa6";
import roof from "@assets/images/house/house_announce_roof.svg";
import card from "@assets/images/house/house_announce_card.svg";
import decor from "@assets/images/house/house_announce_decor.png";

type HouseAnnounceProps = {
  house: House | null;
};

/** Turns a full profile URL into its bare handle, e.g. "https://instagram.com/baan.x/" -> "baan.x". */
function socialHandle(url: string) {
  try {
    return new URL(url).pathname.replace(/^\/+|\/+$/g, "");
  } catch {
    return url;
  }
}

export default function HouseAnnounce({ house }: HouseAnnounceProps) {
  const t = useT();

  return (
    <div className="relative mx-auto aspect-371/451 w-full max-w-96">
      <img
        src={roof.src}
        alt=""
        aria-hidden="true"
        className="absolute left-[1.33%] top-0 h-full w-[98.65%] object-fill"
      />
      <img
        src={card.src}
        alt=""
        aria-hidden="true"
        className="absolute left-[7.26%] top-[12.20%] h-[87.8%] w-[86.79%] object-fill"
      />

      {house && (
        <img
          src={house.logoUrl}
          alt={house.name.th}
          aria-hidden="true"
          className="absolute left-[35%] top-[48%] aspect-square w-[32%] object-contain z-10"
        />
      )}

      <img
        src={decor.src}
        alt=""
        aria-hidden="true"
        className="absolute left-0 top-[25.06%] w-[98.71%] object-contain"
      />

      <div className="absolute left-[9.68%] top-[25.06%] flex w-[83.29%] flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-bold text-black">
          {t("house.announce.title")}
        </h1>
        <p className="text-lg font-bold text-black">
          {t("house.announce.subtitle")}
        </p>
      </div>

      {house && (
        <div className="absolute left-1/2 top-[84.7%] flex w-[83.29%] -translate-x-1/2 flex-col items-center gap-2 text-center">
          <h2 className="text-xl font-bold text-black">{house.name.th}</h2>
          {house.link.instagram && (
            <a
              href={house.link.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-rpkm-red"
            >
              <FaInstagram className="size-4" />
              <span>{socialHandle(house.link.instagram)}</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
}
