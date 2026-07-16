import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ChevronLeft,
  Copy,
  Link2,
  RefreshCw,
  Star,
  UserRound,
  X,
} from "lucide-react";

import { MonotoneNoiseContainer } from "@components/shared/MonotoneNoise";
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
} from "@components/ui/alert-dialog";
import danger_icon from "@assets/icons/danger.svg";
import sparkle_pink from "@assets/icons/sparkle_pink.svg";
import sparkle_cream from "@assets/icons/sparkle_cream.svg";
import { APIError } from "@lib/client";
import { useT, type Translator } from "@lib/i18n/useT";
import {
  GROUP_MAX_MEMBERS,
  getMyGroup,
  kickMember,
  leaveGroup,
  regenerateJoinCode,
  type GroupMember,
} from "@lib/api/groups";

type DialogState =
  | { type: "none" }
  | { type: "delete" }
  | { type: "leave" }
  | { type: "kick"; member: GroupMember }
  | { type: "blocked" };

function memberName(member: GroupMember) {
  return member.nickname || member.firstName;
}

function actionErrorMessage(
  t: Translator,
  fallbackKey: Parameters<Translator>[0],
) {
  return (err: unknown) => {
    if (err instanceof APIError && err.code === "ALREADY_CONFIRMED") {
      return t("house.group.joinErrorAlreadyConfirmed");
    }
    return t(fallbackKey);
  };
}

function GroupHouseFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-96">
      <svg
        viewBox="0 0 368 96"
        preserveAspectRatio="none"
        className="block h-24 w-full"
        aria-hidden="true"
      >
        <rect
          x="51.5"
          y="0.5"
          width="71"
          height="9"
          fill="#7fcbe8"
          stroke="#372f32"
        />
        <rect
          x="57"
          y="4"
          width="60"
          height="31"
          rx="3"
          fill="#fae200"
          stroke="#372f32"
        />
        <path
          d="M33.4444 37.4865C34.3396 35.9471 35.9859 35 37.7667 35H338.487C340.473 35 342.271 36.1762 343.068 37.9964L364.937 87.9963C366.382 91.2997 363.961 95 360.356 95H8.69144C4.83552 95 2.43078 90.8199 4.36911 87.4865L33.4444 37.4865Z"
          fill="#e75124"
          stroke="#372f32"
        />
      </svg>

      <MonotoneNoiseContainer
        noise={{
          noiseSize: 0.7,
          noiseDensity: 20,
          noiseColor: "rgba(0 0 0 / 0.59)",
          noiseSeed: 2676,
        }}
        className="-mt-px rounded-b-[1px] border-x border-b border-[#372f32] bg-[#fefdf5] px-4 pb-6 pt-5"
      >
        {children}
      </MonotoneNoiseContainer>
    </div>
  );
}

/**
 * Ground + ladder decoration matching the Figma background (mountain-green
 * ground swoosh, a hand-drawn ladder, and a couple of sparkle accents —
 * exported as real Figma SVGs where a clean asset exists, hand-assembled
 * elsewhere since the source ladder is a fragmented sketchy-line pattern
 * with no single exportable asset).
 */
function GroundDecoration() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-44 select-none overflow-hidden"
    >
      <svg
        viewBox="0 0 393 220"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <ellipse cx="196" cy="220" rx="320" ry="170" fill="#6abf73" />
      </svg>

      <svg viewBox="0 0 70 150" className="absolute right-6 bottom-0 h-36 w-16">
        <g stroke="#372f32" strokeWidth="3" strokeLinecap="round">
          <rect x="6" y="2" width="9" height="146" rx="3" fill="#fae200" />
          <rect x="55" y="2" width="9" height="146" rx="3" fill="#fae200" />
          <rect x="6" y="24" width="58" height="9" rx="2" fill="#fae200" />
          <rect x="6" y="60" width="58" height="9" rx="2" fill="#fae200" />
          <rect x="6" y="96" width="58" height="9" rx="2" fill="#fae200" />
          <rect x="6" y="130" width="58" height="9" rx="2" fill="#fae200" />
        </g>
      </svg>

      <img
        src={sparkle_pink.src}
        alt=""
        className="absolute bottom-8 left-8 w-6"
      />
      <img
        src={sparkle_cream.src}
        alt=""
        className="absolute bottom-20 left-20 w-5"
      />
    </div>
  );
}

export default function GroupDetailModal({
  currentUserId,
  onClose,
}: {
  currentUserId: string | null;
  onClose: () => void;
}) {
  const t = useT();
  const queryClient = useQueryClient();
  const [dialog, setDialog] = useState<DialogState>({ type: "none" });

  const {
    data: group,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["rpkm-group"],
    queryFn: getMyGroup,
  });

  const viewerIsLeader =
    !!group && currentUserId !== null && group.leaderId === currentUserId;
  const hasOtherMembers = !!group && group.members.length > 1;
  const inviteLink =
    group && typeof window !== "undefined"
      ? `${window.location.origin}/house?code=${group.joinCode}`
      : group
        ? `/house?code=${group.joinCode}`
        : "";

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["rpkm-group"] });

  const leaveMutation = useMutation({
    mutationFn: leaveGroup,
    onSuccess: () => {
      setDialog({ type: "none" });
      invalidate();
      onClose();
    },
    onError: (err) => {
      setDialog({ type: "none" });
      toast.error(actionErrorMessage(t, "house.group.leaveErrorGeneric")(err));
    },
  });

  const kickMutation = useMutation({
    mutationFn: kickMember,
    onSuccess: () => {
      setDialog({ type: "none" });
      invalidate();
    },
    onError: (err) => {
      setDialog({ type: "none" });
      toast.error(actionErrorMessage(t, "house.group.kickErrorGeneric")(err));
    },
  });

  const regenerateMutation = useMutation({
    mutationFn: regenerateJoinCode,
    onSuccess: () => {
      toast.success(t("house.group.regenerateSuccess"));
      invalidate();
    },
    onError: () => toast.error(t("house.group.joinErrorGeneric")),
  });

  const handleCopy = async (value: string, message: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(message);
    } catch {
      toast.error(t("house.group.joinErrorGeneric"));
    }
  };

  const handlePrimaryActionClick = () => {
    if (viewerIsLeader && hasOtherMembers) {
      setDialog({ type: "blocked" });
      return;
    }
    setDialog({ type: viewerIsLeader ? "delete" : "leave" });
  };

  return (
    <MonotoneNoiseContainer className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-[#6abf73]">
      <div className="flex items-center p-4">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onClose}
          className="rounded-full bg-white text-black"
        >
          <ChevronLeft className="size-6" />
        </Button>
      </div>

      {isLoading ? (
        <p className="py-6 text-center text-foreground">
          {t("house.group.loading")}
        </p>
      ) : isError || !group ? (
        <p className="py-6 text-center text-destructive">
          {t("house.group.loadError")}
        </p>
      ) : (
        <div className="relative flex-1 px-3 pb-8">
          <GroundDecoration />

          <h1 className="relative text-center text-3xl font-bold text-[#372f32]">
            {t("house.group.title")}
          </h1>
          <p className="relative mb-4 text-center text-xl text-[#595959]">
            {t("house.group.memberCount", {
              count: String(group.members.length),
              max: String(GROUP_MAX_MEMBERS),
            })}
          </p>

          <GroupHouseFrame>
            <div className="relative flex flex-col items-center gap-5">
              <Button
                type="button"
                size="sm"
                variant="destructive"
                className="absolute -top-1 right-0 rounded-full"
                onClick={handlePrimaryActionClick}
                disabled={leaveMutation.isPending}
              >
                {viewerIsLeader
                  ? t("house.group.deleteRoom")
                  : t("house.group.leaveRoom")}
              </Button>

              <div className="mt-8 grid w-full grid-cols-2 gap-3">
                {Array.from(
                  { length: GROUP_MAX_MEMBERS },
                  (_, index) => group.members[index] ?? null,
                ).map((member, index) =>
                  member ? (
                    <div
                      key={member.userId}
                      className="relative flex flex-col items-center gap-1 rounded-2xl border border-[#372f32] bg-white p-3"
                    >
                      <Star
                        className={
                          member.isLeader
                            ? "absolute -top-2 -left-2 size-6 fill-yellow-400 text-[#372f32]"
                            : "absolute -top-2 -left-2 size-6 fill-[#7fcbe8] text-[#372f32]"
                        }
                      />
                      {viewerIsLeader && member.userId !== currentUserId && (
                        <button
                          type="button"
                          aria-label={t("house.group.removeMember", {
                            name: memberName(member),
                          })}
                          className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full border border-[#372f32] bg-destructive text-background"
                          onClick={() => setDialog({ type: "kick", member })}
                        >
                          <X className="size-3.5" />
                        </button>
                      )}
                      <UserRound className="size-10 text-muted-foreground" />
                      <span className="max-w-full truncate rounded-full bg-secondary px-2 text-sm font-medium">
                        {memberName(member)}
                      </span>
                    </div>
                  ) : (
                    <div
                      key={`empty-${index}`}
                      className="relative flex flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-muted-foreground/50 p-3 text-muted-foreground"
                    >
                      <Star className="absolute -top-2 -left-2 size-6 fill-transparent text-muted-foreground/50" />
                      <UserRound className="size-10" />
                      <span className="text-sm">
                        {t("house.group.emptySlot")}
                      </span>
                    </div>
                  ),
                )}
              </div>

              <Button
                type="button"
                size="sm"
                className="rounded-full bg-rpkm-yellow text-black"
                onClick={onClose}
              >
                {t("house.ranking.title")}
              </Button>

              {viewerIsLeader && (
                <div className="flex w-full flex-col gap-2">
                  <div className="flex items-center justify-between gap-2 rounded-full border border-[#372f32] bg-white px-4 py-2">
                    <div className="flex min-w-0 flex-col">
                      <span className="text-xs text-muted-foreground">
                        {t("house.group.joinCodeLabel")}
                      </span>
                      <span className="text-lg font-bold tracking-[0.3em]">
                        {group.joinCode}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        aria-label={t("house.group.regenerateCode")}
                        className="flex size-8 items-center justify-center rounded-full hover:bg-muted disabled:opacity-50"
                        onClick={() => regenerateMutation.mutate()}
                        disabled={regenerateMutation.isPending}
                      >
                        <RefreshCw className="size-4" />
                      </button>
                      <button
                        type="button"
                        aria-label={t("house.group.copyCode")}
                        className="flex size-8 items-center justify-center rounded-full hover:bg-muted"
                        onClick={() =>
                          handleCopy(
                            group.joinCode,
                            t("house.group.copySuccess"),
                          )
                        }
                      >
                        <Copy className="size-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 rounded-full border border-[#372f32] bg-white px-4 py-2">
                    <div className="flex min-w-0 flex-col">
                      <span className="text-xs text-muted-foreground">
                        {t("house.group.inviteLinkLabel")}
                      </span>
                      <span className="truncate text-sm">{inviteLink}</span>
                    </div>
                    <button
                      type="button"
                      aria-label={t("house.group.copyLink")}
                      className="flex size-8 shrink-0 items-center justify-center rounded-full hover:bg-muted"
                      onClick={() =>
                        handleCopy(inviteLink, t("house.group.copySuccess"))
                      }
                    >
                      <Link2 className="size-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </GroupHouseFrame>
        </div>
      )}

      <AlertDialog
        open={dialog.type !== "none"}
        onOpenChange={(open) => !open && setDialog({ type: "none" })}
      >
        <AlertDialogContent className="pt-10">
          <AlertDialogHeader>
            <AlertDialogMedia className="absolute top-0 h-fit w-full translate-y-[-50%] rounded-2xl border bg-red-500 py-2">
              <img src={danger_icon.src} alt="danger" />
            </AlertDialogMedia>

            <AlertDialogTitle className="text-xl font-bold text-black">
              {dialog.type === "delete" && t("house.group.confirmDeleteTitle")}
              {dialog.type === "leave" && t("house.group.confirmLeaveTitle")}
              {dialog.type === "kick" && t("house.group.confirmKickTitle")}
              {dialog.type === "blocked" &&
                t("house.group.leaderHasMembersTitle")}
            </AlertDialogTitle>

            <AlertDialogDescription className="whitespace-pre-line text-lg text-black">
              {dialog.type === "delete" && t("house.group.confirmDeleteDesc")}
              {dialog.type === "leave" && t("house.group.confirmLeaveDesc")}
              {dialog.type === "kick" &&
                t("house.group.confirmKickDesc", {
                  name: memberName(dialog.member),
                })}
              {dialog.type === "blocked" &&
                t("house.group.leaderHasMembersDesc")}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex justify-center gap-4">
            {dialog.type === "blocked" ? (
              <AlertDialogAction
                className="bg-red-500 text-white"
                onClick={() => setDialog({ type: "none" })}
              >
                {t("house.ranking.ok")}
              </AlertDialogAction>
            ) : (
              <>
                <AlertDialogAction
                  className="bg-red-500 text-white"
                  onClick={() => {
                    if (dialog.type === "delete" || dialog.type === "leave") {
                      leaveMutation.mutate();
                    } else if (dialog.type === "kick") {
                      kickMutation.mutate(dialog.member.userId);
                    }
                  }}
                  disabled={leaveMutation.isPending || kickMutation.isPending}
                >
                  {t("walkrally.events.confirm")}
                </AlertDialogAction>
                <AlertDialogCancel>
                  {t("walkrally.events.cancel")}
                </AlertDialogCancel>
              </>
            )}
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </MonotoneNoiseContainer>
  );
}
