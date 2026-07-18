import houseicon from "@assets/icons/house_orange.svg";
import selectHouseIcon from "@assets/icons/house_select.svg";
import type { RankingHouses } from "./Ranking";
import { HOUSES } from "../../consts/house";
import house_rank_1 from "@assets/images/house/house_rank_1.svg";
import house_rank_2 from "@assets/images/house/house_rank_2.svg";
import house_rank_3 from "@assets/images/house/house_rank_3.svg";
import house_rank_4 from "@assets/images/house/house_rank_4.svg";
import house_rank_5 from "@assets/images/house/house_rank_5.svg";
import danger_icon from "@assets/icons/danger.svg";
import { ChevronRight, GripVertical, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
  onViewDetail: (house: string) => void;
};

export default function HouseSelector({
  rank,
  index,
  selectedHouses,
  isEditing = false,
  onChangeHouse,
  onDeleteHouse,
  onViewDetail,
}: HouseSelectorProps) {
  const t = useT();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: rank, disabled: !isEditing });

  const dragStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

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
      ref={setNodeRef}
      style={dragStyle}
      className={`relative flex h-17.5 w-[90%] items-center justify-center rounded-full border border-black bg-white ${
        isDragging ? "z-40 opacity-90 shadow-lg" : ""
      }`}
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

        <div className="flex h-full w-full origin-top-left -rotate-10 items-center justify-center rounded-xl border bg-rpkm-blue">
          {logo ? (
            <img
              src={logo}
              alt={`${selectedHouses[rank]} logo`}
              className="z-10 h-[90%] w-[90%] rounded-lg border bg-white object-contain"
            />
          ) : (
            <div className="h-[90%] w-[90%] rounded-lg border bg-gray-300" />
          )}
        </div>
      </div>

      {selectedHouses[rank] ? (
        <>
          <div className="flex flex-col items-center">
            <h2
              className={`text-lg text-black ${
                index === 0 ? "font-bold" : "font-normal"
              }`}
            >
              {selectedHouses[rank]}
            </h2>
            <span className="flex items-center gap-1 text-sm text-rpkm-red">
              <img src={houseicon.src} alt="" className="size-3.5" />
              {t("house.ranking.village")} {size}
            </span>
          </div>

          {isEditing ? (
            <div className="absolute top-1/2 right-3 z-30 flex -translate-y-1/2 items-center gap-1">
              <AlertDialog>
                <AlertDialogTrigger
                  render={
                    <button
                      type="button"
                      className="flex size-7 items-center justify-center rounded-md border bg-red-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                  }
                >
                  <Trash2 className="size-4 text-white" />
                </AlertDialogTrigger>

                <AlertDialogContent className="pt-10">
                  <AlertDialogHeader>
                    <AlertDialogMedia className="absolute top-0 h-fit w-full translate-y-[-50%] rounded-2xl border bg-red-500 py-2">
                      <img src={danger_icon.src} alt="danger" />
                    </AlertDialogMedia>

                    <AlertDialogTitle>
                      {t("house.ranking.houseRemove")}
                    </AlertDialogTitle>

                    <AlertDialogDescription
                      className={"whitespace-break-spaces"}
                    >
                      {t("house.ranking.houseRemoveDesc", {
                        House: selectedHouses[rank],
                      })}
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <div className="flex justify-center gap-4">
                    <AlertDialogAction
                      className="bg-red-500 text-white"
                      onClick={() => onDeleteHouse(rank)}
                    >
                      {t("walkrally.events.confirm")}
                    </AlertDialogAction>

                    <AlertDialogCancel>
                      {t("walkrally.events.cancel")}
                    </AlertDialogCancel>
                  </div>
                </AlertDialogContent>
              </AlertDialog>

              <button
                type="button"
                className="touch-none cursor-grab active:cursor-grabbing"
                onClick={(e) => e.stopPropagation()}
                {...attributes}
                {...listeners}
              >
                <GripVertical className="size-5 text-gray-400" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="absolute top-1/2 right-5 -translate-y-1/2"
              onClick={(e) => {
                e.stopPropagation();
                if (selectedHouses[rank]) {
                  onViewDetail(selectedHouses[rank]);
                }
              }}
            >
              <ChevronRight className="size-5 text-black" />
            </button>
          )}
        </>
      ) : (
        <img src={selectHouseIcon.src} alt="select house" className="size-11" />
      )}
    </div>
  );
}
