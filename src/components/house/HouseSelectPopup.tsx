import { Button } from "@components/ui/button";
import {
  HOUSES,
  HOUSE_CAPACITY,
  getHouseMemberCount,
  type House,
} from "../../consts/house";
import { useState } from "react";
import { ChevronRight, Search, User } from "lucide-react";
import { useT } from "@lib/i18n/useT";
import HouseDetailView from "./HouseDetailView";
import house_white from "@assets/icons/house_white.svg";

const SIZES = ["S", "M", "L", "XL", "XXL"] as const;

type HouseSelectPopupProps = {
  onClose: () => void;
  onSelect: (house: string) => void;
  disabledHouses: readonly string[];
};

export default function HouseSelectPopup({
  onClose,
  onSelect,
  disabledHouses,
}: HouseSelectPopupProps) {
  const t = useT();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSize, setSelectedSize] = useState<(typeof SIZES)[number]>("S");
  const [selectedHouseDetail, setSelectedHouseDetail] = useState<House | null>(
    null,
  );
  const disabledHouseNames = new Set(disabledHouses);

  const filteredHouses = HOUSES.filter((house) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      house.name.th.toLowerCase().includes(query) ||
      house.name.en.toLowerCase().includes(query);

    return matchesSearch && house.size === selectedSize;
  });

  if (selectedHouseDetail) {
    return (
      <HouseDetailView
        house={selectedHouseDetail}
        onConfirm={() => {
          onSelect(selectedHouseDetail.name.th);
          onClose();
        }}
        onBack={() => setSelectedHouseDetail(null)}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-white/70 p-4 backdrop-blur-sm">
      <div className="flex max-h-[80dvh] w-full max-w-md flex-col rounded-[29px] border bg-rpkm-beige pt-5">
        {/* search */}
        <div className="relative mx-auto w-[65%]">
          <input
            type="text"
            placeholder={t("house.popup.searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-full border bg-white py-2 pl-5 pr-10 text-black placeholder:text-black/50"
          />
          <Search className="pointer-events-none absolute right-4 top-1/2 size-4.5 -translate-y-1/2 text-black" />
        </div>

        {/* size tabs */}
        <div className="mt-4 flex items-end justify-center gap-2 px-4">
          {SIZES.map((size) =>
            selectedSize === size ? (
              <button
                key={size}
                type="button"
                className="relative z-10 -mb-px flex h-15.5 w-16 flex-col items-center justify-center gap-0.5 rounded-t-xl border border-b-0 border-black bg-rpkm-green"
              >
                <span className="text-xs font-bold text-rpkm-yellow">
                  {t("house.ranking.village")}
                </span>
                <span className="flex size-6 items-center justify-center rounded-full border bg-rpkm-light-pink text-sm font-bold text-rpkm-red">
                  {size.toLowerCase()}
                </span>
              </button>
            ) : (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className="flex h-10.5 w-13 items-center justify-center rounded-xl border border-black bg-white text-xl font-bold text-rpkm-red"
              >
                {size.toLowerCase()}
              </button>
            ),
          )}
        </div>

        {/* house list */}
        <div className="flex min-h-80 flex-1 flex-col rounded-[29px] border bg-rpkm-red p-5 pt-3">
          <div className="flex items-center justify-end gap-1 pb-2">
            <img src={house_white.src} alt="" className="size-4" />
            <span className="text-sm text-rpkm-beige">
              {filteredHouses.length}
            </span>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="grid grid-cols-2 gap-3 pb-2">
              {filteredHouses.map((house) => {
                const memberCount = getHouseMemberCount(house);
                const isFull = memberCount >= HOUSE_CAPACITY;
                const isRanked = disabledHouseNames.has(house.name.th);

                return (
                  <button
                    key={house.id}
                    type="button"
                    disabled={isRanked}
                    onClick={() => setSelectedHouseDetail(house)}
                    className="flex flex-col gap-2 rounded-[10px] border bg-rpkm-beige p-2 text-left disabled:cursor-not-allowed disabled:grayscale disabled:opacity-50"
                  >
                    <div className="relative w-full">
                      <img
                        src={house.logoUrl}
                        alt={house.name.th}
                        className="aspect-square w-full rounded-[10px] border bg-white object-cover"
                      />

                      <div
                        className={`absolute inset-x-0 bottom-0 flex h-5 items-center gap-1 rounded-[10px] border px-2 ${
                          isFull ? "bg-rpkm-red" : "bg-rpkm-green"
                        }`}
                      >
                        <User className="size-3 text-white" />
                        <span className="text-[10px] leading-none">
                          <span className="text-rpkm-beige">{memberCount}</span>
                          <span className="text-white">/{HOUSE_CAPACITY}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex w-full items-center">
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-sm font-bold text-black">
                          {house.name.th}
                        </span>
                        <span className="truncate text-[10px] text-gray-500">
                          {house.name.en}
                        </span>
                      </div>
                      <ChevronRight className="size-4.5 shrink-0 text-black" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <Button
        size="xl"
        onClick={onClose}
        className="w-24 rounded-2xl bg-rpkm-red text-lg text-white"
      >
        {t("house.popup.close")}
      </Button>
    </div>
  );
}
