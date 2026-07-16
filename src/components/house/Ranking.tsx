import { MonotoneNoiseContainer } from "@components/shared/MonotoneNoise";
import { useState } from "react";
import { useT } from "@lib/i18n/useT";
import { Button } from "@components/ui/button";
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
import stamp from "@assets/images/house/house_ranking_stamp.svg";
import HouseSelector from "./HouseSelector";
import HouseSelectPopup from "./HouseSelectPopup";
import HouseDetailView from "./HouseDetailView";
import edit_icon from "@assets/icons/edit.svg";
import danger_icon from "@assets/icons/danger.svg";
import success_icon from "@assets/icons/success.svg";
import { HOUSES, type House } from "../../consts/house";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export type RankingHouses = {
  house1: string | null;
  house2: string | null;
  house3: string | null;
  house4: string | null;
  house5: string | null;
};

export type RankingProps = {
  houses: RankingHouses;
};

export default function Ranking() {
  const rankingKeys: (keyof RankingHouses)[] = [
    "house1",
    "house2",
    "house3",
    "house4",
    "house5",
  ];
  const [activeRank, setActiveRank] = useState<keyof RankingHouses | null>(
    null,
  );
  const [haveSelectedHouse, setHaveSelectedHouse] = useState<boolean>(false);
  const [selectedHouses, setSelectedHouses] = useState<RankingHouses>({
    house1: null,
    house2: null,
    house3: null,
    house4: null,
    house5: null,
  });
  const [order, setOrder] = useState<(keyof RankingHouses)[]>(rankingKeys);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const [showSaveAlert, setShowSaveAlert] = useState(false);
  const [saveAlertType, setSaveAlertType] = useState<"error" | "success">(
    "error",
  );
  const [detailHouse, setDetailHouse] = useState<House | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const t = useT();
  const hasSelectedHouse = Object.values(selectedHouses).some(
    (house) => house !== null,
  );
  const canEdit = hasSelectedHouse && isEditing;

  const handleDeleteHouse = (rank: keyof RankingHouses) => {
    setSelectedHouses((prev) => ({
      ...prev,
      [rank]: null,
    }));
  };

  const handleOpenSelector = (rank: keyof RankingHouses) => {
    setActiveRank(rank);
  };

  const handleSelectHouse = (house: string) => {
    if (!activeRank) return;

    setSelectedHouses((prev) => {
      // Keep the ranking unique even if selection is triggered outside the UI.
      if (Object.values(prev).includes(house)) return prev;

      // Assign the house to the selected rank
      return { ...prev, [activeRank]: house };
    });

    setActiveRank(null);
  };

  const handleViewDetail = (house: string) => {
    setDetailHouse(HOUSES.find((h) => h.name.th === house) ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setOrder((prev) => {
      const oldIndex = prev.indexOf(active.id as keyof RankingHouses);
      const newIndex = prev.indexOf(over.id as keyof RankingHouses);

      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const handleSubmit = () => {
    const orderedHouses = order
      .map((rank) => selectedHouses[rank])
      .filter((house): house is string => house !== null);

    if (orderedHouses.length === 0) {
      setSaveAlertType("error");
      setShowSaveAlert(true);
      return;
    }

    const payload: RankingHouses = {
      house1: orderedHouses[0] ?? null,
      house2: orderedHouses[1] ?? null,
      house3: orderedHouses[2] ?? null,
      house4: orderedHouses[3] ?? null,
      house5: orderedHouses[4] ?? null,
    };

    // Mock API
    console.log("Mock API payload:", payload);

    setTimeout(() => {
      setSaveAlertType("success");
      setShowSaveAlert(true);
      setIsEditing(false);
    }, 500);
  };

  return (
    <div className="relative flex flex-col items-center gap-4 mt-6">
      <img
        src={stamp.src}
        alt="Stamp"
        className="absolute top-0 left-0 transform translate-y-[-60%] z-10 mx-auto mt-4"
      />
      <MonotoneNoiseContainer className="w-full bg-rpkm-red rounded-4xl border p-4 py-6">
        <div className="relative">
          <h1 className="text-white font-bold text-2xl text-center">
            {t("house.ranking.title")}
          </h1>

          {hasSelectedHouse &&
            (canEdit ? (
              <div className="absolute top-1 right-0 flex flex-col items-end gap-0.5">
                <button
                  type="button"
                  className="text-sm text-white underline underline-offset-2"
                  onClick={() => setIsEditing(false)}
                >
                  {t("house.ranking.houseDone")}
                </button>

                <AlertDialog
                  open={showClearConfirm}
                  onOpenChange={setShowClearConfirm}
                >
                  <AlertDialogTrigger
                    render={
                      <button
                        type="button"
                        className="text-sm text-white underline underline-offset-2"
                      />
                    }
                  >
                    {t("house.ranking.houseClear")}
                  </AlertDialogTrigger>
                  <AlertDialogContent className={"pt-10"}>
                    <AlertDialogHeader>
                      <AlertDialogMedia className="absolute top-0 translate-y-[-50%] bg-red-500 w-full border py-2 h-fit rounded-2xl">
                        <img src={danger_icon.src} alt="danger" />
                      </AlertDialogMedia>
                      <AlertDialogTitle className="text-xl text-black font-bold">
                        {t("house.ranking.houseClearTitle")}
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-lg text-black">
                        {t("house.ranking.houseClearDescription")}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex gap-4 justify-center">
                      <AlertDialogAction
                        className="bg-red-500 text-white"
                        onClick={() => {
                          setSelectedHouses({
                            house1: null,
                            house2: null,
                            house3: null,
                            house4: null,
                            house5: null,
                          });
                          setOrder(rankingKeys);
                          setIsEditing(false);
                          setShowClearConfirm(false);
                        }}
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
            ) : (
              <Button
                type="button"
                size="lg"
                className="absolute top-0 right-0 bg-white p-2 rounded-full w-fit aspect-square"
                onClick={() => setIsEditing(true)}
              >
                <img src={edit_icon.src} alt="edit" className="w-full h-full" />
              </Button>
            ))}
        </div>

        {haveSelectedHouse ? (
          <div className="flex flex-col items-center gap-5 mt-6">
            {/* // map through the houses and display them */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={order}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col justify-center items-center gap-3 w-full">
                  {order.map((rank, index) => (
                    <HouseSelector
                      key={rank}
                      rank={rank}
                      index={index}
                      selectedHouses={selectedHouses}
                      isEditing={canEdit}
                      onChangeHouse={handleOpenSelector}
                      onDeleteHouse={handleDeleteHouse}
                      onViewDetail={handleViewDetail}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            <div className="w-full flex flex-row items-end justify-between gap-4">
              <p className="text-rpkm-yellow text-sm font-normal whitespace-pre-line">
                {t("house.ranking.houseAnnouncement")}
              </p>
              <Button type="button" size="lg" onClick={() => handleSubmit()}>
                {t("house.ranking.save")}
              </Button>
            </div>
          </div>
        ) : (
          // if the user has not selected a house, show a message and a button to select a house
          <div className="flex flex-col items-center gap-4 mt-6">
            <p className="text-white text-2xl font-bold text-center whitespace-pre-line">
              {t("house.ranking.noHouses")}
            </p>
            <Button
              type="button"
              size="xl"
              className="w-[80%] py-7 text-xl"
              onClick={() => setHaveSelectedHouse(true)}
            >
              {t("house.ranking.selectHouse")}
            </Button>
          </div>
        )}
      </MonotoneNoiseContainer>

      {activeRank && (
        <HouseSelectPopup
          onClose={() => setActiveRank(null)}
          onSelect={handleSelectHouse}
          disabledHouses={Object.values(selectedHouses).filter(
            (house): house is string => house !== null,
          )}
        />
      )}

      {detailHouse && (
        <HouseDetailView
          house={detailHouse}
          onBack={() => setDetailHouse(null)}
          onConfirm={() => setDetailHouse(null)}
        />
      )}

      <AlertDialog open={showSaveAlert} onOpenChange={setShowSaveAlert}>
        <AlertDialogContent className="pt-10">
          <AlertDialogHeader>
            <AlertDialogMedia
              className={`absolute top-0 translate-y-[-50%] w-full border py-2 h-fit rounded-2xl ${
                saveAlertType === "success" ? "bg-green-500" : "bg-rpkm-red"
              }`}
            >
              <img
                src={
                  saveAlertType === "success"
                    ? success_icon.src
                    : danger_icon.src
                }
                alt={saveAlertType}
              />
            </AlertDialogMedia>

            <AlertDialogTitle className="text-xl text-black font-bold">
              {saveAlertType === "error"
                ? t("house.ranking.saveIncompleteTitle")
                : t("house.ranking.saveSuccessTitle")}
            </AlertDialogTitle>

            <AlertDialogDescription className="text-lg text-black">
              {saveAlertType === "error"
                ? t("house.ranking.saveIncompleteDescription")
                : t("house.ranking.saveSuccessDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex justify-center">
            <AlertDialogAction
              className={`text-white ${
                saveAlertType === "success" ? "bg-green-500" : "bg-rpkm-red"
              }`}
              onClick={() => setShowSaveAlert(false)}
            >
              {t("house.ranking.ok")}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
