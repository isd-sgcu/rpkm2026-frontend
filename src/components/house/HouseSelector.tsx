import houseicon from "@assets/icons/house_orange.svg";
import selectHouseIcon from "@assets/icons/house_select.svg";
import type { RankingHouses } from "./Ranking";
// import { useState } from "react";
import { HOUSES } from "../../consts/house";
import house_rank_1 from "@assets/images/house/house_rank_1.svg";
import house_rank_2 from "@assets/images/house/house_rank_2.svg";
import house_rank_3 from "@assets/images/house/house_rank_3.svg";
import house_rank_4 from "@assets/images/house/house_rank_4.svg";
import house_rank_5 from "@assets/images/house/house_rank_5.svg";
import house_delete from "@assets/icons/delete.svg";
import danger_icon from "@assets/icons/danger.svg";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@components/ui/alert-dialog";
import { useT } from "@lib/i18n/useT";

type HouseSelectorProps = {
  rank: keyof RankingHouses;
  index: number;
  selectedHouses: RankingHouses;
  isEditing?: boolean;
  onChangeHouse: (rank: keyof RankingHouses) => void;
  onDeleteHouse: (rank: keyof RankingHouses) => void;
};

export default function HouseSelector({
  rank,
  index,
  selectedHouses,
  isEditing = false,
  onChangeHouse,
  onDeleteHouse,
}: HouseSelectorProps) {
  const t = useT();
  //   const [selectedHouse, setSelectedHouse] = useState<string | null>(
  //     selectedHouses[rank],
  //   );

  const houseData = HOUSES.find(
    (house) => house.name.th === selectedHouses[rank],
  );
  const size = houseData?.size.toLowerCase();
  const logo = houseData?.logoUrl;

  const house_rank_images = [
    house_rank_1,
    house_rank_2,
    house_rank_3,
    house_rank_4,
    house_rank_5,
  ];
  const house_rank_image = house_rank_images[index];

  return (
    <div
      key={rank}
      className="relative flex w-[90%] items-center justify-center bg-white border border-black rounded-full p-3"
      onClick={() => {
        if (!selectedHouses[rank]) {
          onChangeHouse(rank);
        }
      }}
    >
      <div
        className={`absolute top-0 -left-2.5 h-20 w-20 ${
          !selectedHouses[rank] ? "grayscale" : ""
        }`}
      >
        <img
          src={house_rank_image.src}
          alt={`House Rank ${index + 1}`}
          className="absolute -top-2.5 -left-2.5 z-20"
        />

        <div className="w-full h-full bg-rpkm-blue border rounded-xl flex items-center justify-center origin-top-left -rotate-10">
          {logo ? (
            <img
              src={logo}
              alt={`${selectedHouses[rank]} logo`}
              className="w-[90%] h-[90%] bg-white object-contain rounded-lg border z-10"
            />
          ) : (
            <div className="w-[90%] h-[90%] bg-gray-300 rounded-lg border" />
          )}
        </div>
      </div>
      {selectedHouses[rank] ? (
        <div className="flex flex-col items-center">
          <h2
            className={`text-black text-lg ${
              index === 0 ? "font-bold" : "font-normal"
            }`}
          >
            {selectedHouses[rank]}
          </h2>
          <span className="flex flex-row gap-2 text-rpkm-red text-sm">
            <img src={houseicon.src} alt="house" className="w-4 h-4" /> หมู่บ้าน{" "}
            {size}
          </span>
        </div>
      ) : (
        <img
          src={selectHouseIcon.src}
          alt="select house"
          className="w-12 h-12"
        />
      )}
      {isEditing && selectedHouses[rank] && (
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <button
                type="button"
                className="absolute top-1/2 right-8 -translate-y-1/2 z-30"
                onClick={(e) => e.stopPropagation()}
              />
            }
          >
            <img
              src={house_delete.src}
              alt="Delete house"
              className="w-6 h-6"
            />
          </AlertDialogTrigger>

          <AlertDialogContent className="pt-10">
            <AlertDialogHeader>
              <AlertDialogMedia className="absolute top-0 translate-y-[-50%] bg-red-500 w-full border py-2 h-fit rounded-2xl">
                <img src={danger_icon.src} alt="danger" />
              </AlertDialogMedia>

              <AlertDialogTitle>
                {t("house.ranking.houseRemove")}
              </AlertDialogTitle>

              <AlertDialogDescription className={"whitespace-break-spaces"}>
                {t("house.ranking.houseRemoveDesc", {
                  House: selectedHouses[rank],
                })}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="flex gap-4 justify-center">
              <AlertDialogAction
                className="bg-red-500 text-white"
                onClick={() => onDeleteHouse(rank)}
              >
                Confirm
              </AlertDialogAction>

              <AlertDialogCancel>Cancel</AlertDialogCancel>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
