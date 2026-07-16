import { MonotoneNoiseContainer } from "@components/shared/MonotoneNoise";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { QueryProvider } from "@components/shared/QueryProvider";
import { Toaster } from "@components/ui/sonner";
import stamp from "@assets/images/house/house_ranking_stamp.svg";
import HouseSelector from "./HouseSelector";
import HouseSelectPopup from "./HouseSelectPopup";
import HouseDetailView from "./HouseDetailView";
import edit_icon from "@assets/icons/edit.svg";
import danger_icon from "@assets/icons/danger.svg";
import success_icon from "@assets/icons/success.svg";
import { getHouseByCode, HOUSES, type House } from "../../consts/house";
import { APIError } from "@lib/client";
import { useProfile } from "@lib/auth/useProfile";
import {
  getMyGroup,
  getHousePreferences,
  setHousePreferences,
} from "@lib/api/groups";
import { getHouses } from "@lib/api/houses";
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

const rankingKeys: (keyof RankingHouses)[] = [
  "house1",
  "house2",
  "house3",
  "house4",
  "house5",
];

const emptyRanking: RankingHouses = {
  house1: null,
  house2: null,
  house3: null,
  house4: null,
  house5: null,
};

function saveErrorMessage(err: unknown, t: ReturnType<typeof useT>) {
  if (err instanceof APIError && err.code === "HOUSE_PICK_CLOSED") {
    return t("house.ranking.housePickClosed");
  }
  return t("house.ranking.saveErrorDescription");
}

function RankingPanel() {
  const [activeRank, setActiveRank] = useState<keyof RankingHouses | null>(
    null,
  );
  const [selectedHouses, setSelectedHouses] =
    useState<RankingHouses>(emptyRanking);
  const [order, setOrder] = useState<(keyof RankingHouses)[]>(rankingKeys);
  const [haveSelectedHouse, setHaveSelectedHouse] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showSaveAlert, setShowSaveAlert] = useState(false);
  const [saveAlertType, setSaveAlertType] = useState<"error" | "success">(
    "error",
  );
  const [saveErrorDescription, setSaveErrorDescription] = useState<
    string | null
  >(null);
  const [detailHouse, setDetailHouse] = useState<House | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const t = useT();
  const queryClient = useQueryClient();
  const profile = useProfile();

  const { data: group } = useQuery({
    queryKey: ["rpkm-group"],
    queryFn: getMyGroup,
  });
  const { data: preferences } = useQuery({
    queryKey: ["rpkm-house-preferences"],
    queryFn: getHousePreferences,
  });
  const { data: houseRecords } = useQuery({
    queryKey: ["rpkm-houses"],
    queryFn: getHouses,
  });
  const [seededPreferences, setSeededPreferences] = useState(preferences);

  const currentUserId = profile.status === "ready" ? profile.me.id : null;
  const isEditable =
    !!group && currentUserId !== null && group.leaderId === currentUserId;

  // Maps a local house's Thai name (how selection state identifies a house)
  // to the real backend houseId, so submits can send real uuids.
  const realHouseIdByName = useMemo(() => {
    const map: Record<string, string> = {};
    for (const record of houseRecords ?? []) {
      const local = getHouseByCode(record.code);
      if (local) map[local.name.th] = record.id;
    }
    return map;
  }, [houseRecords]);

  // Reset local ranking state to match the real house-preferences whenever
  // they change (first load, or after a save elsewhere) — but never while
  // the user has an edit in progress, so we don't clobber unsaved changes.
  // This runs during render (React's blessed pattern for "adjust state when
  // a value changes") rather than in an effect, so it never needs a second
  // render pass to take effect.
  if (preferences !== seededPreferences && houseRecords && !isEditing) {
    setSeededPreferences(preferences);

    const recordById = new Map(houseRecords.map((r) => [r.id, r]));
    const names = (preferences ?? [])
      .slice()
      .sort((a, b) => a.rank - b.rank)
      .map((pref) => {
        const record = recordById.get(pref.houseId);
        const local = record ? getHouseByCode(record.code) : undefined;
        return local?.name.th ?? null;
      })
      .filter((name): name is string => name !== null);

    if (names.length > 0) {
      const nextSelected: RankingHouses = { ...emptyRanking };
      rankingKeys.forEach((key, index) => {
        nextSelected[key] = names[index] ?? null;
      });
      setSelectedHouses(nextSelected);
      setHaveSelectedHouse(true);
    }
  }

  const hasSelectedHouse = Object.values(selectedHouses).some(
    (house) => house !== null,
  );
  const canEdit = hasSelectedHouse && isEditing && isEditable;

  const saveMutation = useMutation({
    mutationFn: setHousePreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rpkm-house-preferences"] });
      setSaveAlertType("success");
      setSaveErrorDescription(null);
      setShowSaveAlert(true);
      setIsEditing(false);
    },
    onError: (err) => {
      setSaveAlertType("error");
      setSaveErrorDescription(saveErrorMessage(err, t));
      setShowSaveAlert(true);
    },
  });

  const handleDeleteHouse = (rank: keyof RankingHouses) => {
    setSelectedHouses((prev) => ({
      ...prev,
      [rank]: null,
    }));
  };

  const handleOpenSelector = (rank: keyof RankingHouses) => {
    if (!isEditable) return;
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
    const orderedNames = order
      .map((rank) => selectedHouses[rank])
      .filter((house): house is string => house !== null);

    if (orderedNames.length === 0) {
      setSaveAlertType("error");
      setSaveErrorDescription(null);
      setShowSaveAlert(true);
      return;
    }

    const houseIds = orderedNames
      .map((name) => realHouseIdByName[name])
      .filter((id): id is string => !!id);

    saveMutation.mutate(houseIds);
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
            isEditable &&
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
                          setSelectedHouses(emptyRanking);
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
              {isEditable && (
                <Button
                  type="button"
                  size="lg"
                  onClick={() => handleSubmit()}
                  disabled={saveMutation.isPending}
                >
                  {t("house.ranking.save")}
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 mt-6">
            <p className="text-white text-2xl font-bold text-center whitespace-pre-line">
              {t("house.ranking.noHouses")}
            </p>
            {isEditable && (
              <Button
                type="button"
                size="xl"
                className="w-[80%] py-7 text-xl"
                onClick={() => setHaveSelectedHouse(true)}
              >
                {t("house.ranking.selectHouse")}
              </Button>
            )}
          </div>
        )}
      </MonotoneNoiseContainer>

      {activeRank && isEditable && (
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
          showAddButton={isEditable}
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
                ? (saveErrorDescription ??
                  t("house.ranking.saveIncompleteDescription"))
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

      <Toaster />
    </div>
  );
}

export default function Ranking() {
  return (
    <QueryProvider>
      <RankingPanel />
    </QueryProvider>
  );
}
