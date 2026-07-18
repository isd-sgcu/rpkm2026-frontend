import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, ChevronLeft, Copy, Link2, RefreshCw } from "lucide-react";

import { MonotoneNoiseContainer } from "@components/shared/MonotoneNoise";
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
import house_frame from "@assets/images/house/group_house_frame.svg";
import ground from "@assets/images/house/group_ground.svg";
import deco_left from "@assets/images/house/group_deco_left.png";
import deco_right from "@assets/images/house/group_deco_right.png";
import rank_back from "@assets/images/house/group_rank_back.svg";
import rank_front from "@assets/images/house/group_rank_front.svg";
import rank_podium from "@assets/images/house/group_rank_podium.svg";
import artboard_27 from "@assets/images/artboard_27.svg";
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
import { MemberWindow } from "./MemberWindow";

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

/**
 * The "การจัดอันดับ" button from the Figma group modal — a yellow pill with a
 * layered house-and-podium badge on the left, rebuilt from the design's
 * exported vector parts with the label kept as live (translatable) text.
 */
function RankingButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative block h-[54px] w-[159px]"
    >
      <img
        src={rank_back.src}
        alt=""
        className="absolute top-0 left-0 h-full w-[52.89%]"
      />
      <div className="absolute inset-[39.82%_55.01%_50.99%_8.37%] rounded-[3px] bg-[#e9d106]" />
      <div className="absolute inset-[31.3%_0_2.41%_27.04%] rounded-[11px] border border-[#373032] bg-[#e9d106]" />
      <img
        src={rank_front.src}
        alt=""
        className="absolute top-[9.36%] left-[3.2%] h-[85.96%] w-[45.46%]"
      />
      <div className="absolute inset-[43.59%_58.13%_48.51%_10.39%] rounded-[3px] bg-[#7fcbe8]" />
      <img
        src={rank_podium.src}
        alt=""
        className="absolute top-[19.84%] left-[15.72%] h-[64.38%] w-[20.58%]"
      />
      <span className="absolute inset-[47.87%_0.63%_18.99%_44.03%] flex items-center justify-center text-[13px] font-bold text-[#373032]">
        {label}
      </span>
    </button>
  );
}

/**
 * Ground decoration matching the Figma background: green noise mound with
 * flower/teacup art bottom-left and the yellow ladder with tulips
 * bottom-right, all exported straight from the design.
 */
function GroundDecoration() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[265px] select-none"
    >
      <img
        src={ground.src}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-top"
      />
      <img
        src={deco_left.src}
        alt=""
        className="absolute bottom-0 -left-3 w-[120px]"
      />
      <img
        src={deco_right.src}
        alt=""
        className="absolute right-0 bottom-0 h-[216px] w-[98px]"
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
  const [copied, setCopied] = useState<"code" | "link" | null>(null);

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
      ? `${window.location.origin}/room#${group.joinCode}`
      : group
        ? `/room#${group.joinCode}`
        : "";
  const inviteLinkDisplay = inviteLink.replace(/^https?:\/\//, "");

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

  const handleCopy = async (
    value: string,
    message: string,
    target: "code" | "link",
  ) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(message);
      setCopied(target);
      window.setTimeout(
        () => setCopied((current) => (current === target ? null : current)),
        1500,
      );
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
    <MonotoneNoiseContainer
      noise={{
        noiseSize: 0.7,
        noiseDensity: 20,
        noiseColor: "rgba(0 0 0 / 0.59)",
        noiseSeed: 2676,
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-[#fefdf5]"
    >
      <div className="relative flex min-h-full flex-col items-center overflow-hidden pb-16">
        <GroundDecoration />
        <img
          src={artboard_27.src}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute top-[180px] right-0 w-[60px] opacity-25 select-none"
        />

        <button
          type="button"
          aria-label={t("walkrally.events.cancel")}
          onClick={onClose}
          className="absolute top-4 left-4 z-10 flex size-12 items-center justify-center rounded-full border border-[#372f32] bg-[#fefdf5] text-[#373032]"
        >
          <ChevronLeft className="size-8" />
        </button>

        {isLoading ? (
          <p className="relative py-20 text-center text-foreground">
            {t("house.group.loading")}
          </p>
        ) : isError || !group ? (
          <p className="relative py-20 text-center text-destructive">
            {t("house.group.loadError")}
          </p>
        ) : (
          <>
            <h1 className="relative mt-16 text-center text-[30px] font-bold text-[#373032]">
              {t("house.group.title")}
            </h1>
            <p className="relative text-center text-[20px] font-bold text-[#595959]">
              {t("house.group.memberCount", {
                count: String(group.members.length),
                max: String(GROUP_MAX_MEMBERS),
              })}
            </p>

            <div className="relative mt-3 w-[368px] max-w-full">
              <img
                src={house_frame.src}
                alt=""
                className="block w-full select-none"
              />

              <button
                type="button"
                className="absolute top-[104px] right-[19px] h-[24px] rounded-[8px] border border-[#373032] bg-[#d9443e] px-2 text-[12px] font-bold text-white disabled:opacity-50"
                onClick={handlePrimaryActionClick}
                disabled={leaveMutation.isPending}
              >
                {viewerIsLeader
                  ? t("house.group.deleteRoom")
                  : t("house.group.leaveRoom")}
              </button>

              <div className="absolute inset-x-0 top-[142px] flex flex-col items-center gap-5">
                <div className="grid grid-cols-2 gap-x-8 gap-y-7">
                  {Array.from(
                    { length: GROUP_MAX_MEMBERS },
                    (_, index) => group.members[index] ?? null,
                  ).map((member, index) =>
                    member ? (
                      <MemberWindow
                        key={member.userId}
                        variant={member.isLeader ? "leader" : "member"}
                        name={memberName(member)}
                        avatarUrl={member.avatarUrl}
                        onKick={
                          viewerIsLeader && member.userId !== currentUserId
                            ? () => setDialog({ type: "kick", member })
                            : undefined
                        }
                        kickLabel={t("house.group.removeMember", {
                          name: memberName(member),
                        })}
                      />
                    ) : (
                      <MemberWindow key={`empty-${index}`} variant="empty" />
                    ),
                  )}
                </div>

                <RankingButton
                  onClick={onClose}
                  label={t("house.ranking.title")}
                />
              </div>
            </div>

            <div className="relative mt-3 flex flex-col gap-[10px]">
              <div>
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-[16px] font-bold text-[#373032]">
                    {t("house.group.joinCodeLabel")}
                  </span>
                  {viewerIsLeader && (
                    <button
                      type="button"
                      aria-label={t("house.group.regenerateCode")}
                      className="text-[#0d0809] transition-transform active:rotate-90 disabled:opacity-50"
                      onClick={() => regenerateMutation.mutate()}
                      disabled={regenerateMutation.isPending}
                    >
                      <RefreshCw
                        className={`size-[18px] ${
                          regenerateMutation.isPending ? "animate-spin" : ""
                        }`}
                      />
                    </button>
                  )}
                </div>
                <div className="mt-0.5 flex h-[37px] items-center justify-center gap-3 rounded-[10px] border border-[#373032] bg-[#fffdf5]">
                  <span
                    key={group.joinCode}
                    className="animate-in fade-in zoom-in-95 pl-[0.3em] text-[20px] font-bold tracking-[0.3em] text-[#373032] duration-300"
                  >
                    {group.joinCode}
                  </span>
                  <button
                    type="button"
                    aria-label={t("house.group.copyCode")}
                    className="text-[#373032] transition-transform active:scale-90"
                    onClick={() =>
                      handleCopy(
                        group.joinCode,
                        t("house.group.copySuccess"),
                        "code",
                      )
                    }
                  >
                    {copied === "code" ? (
                      <Check className="size-[18px] animate-in zoom-in-50 text-[#2e7d32] duration-200" />
                    ) : (
                      <Copy className="size-[18px]" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <p className="text-center text-[16px] font-bold text-[#373032]">
                  {t("house.group.inviteLinkLabel")}
                </p>
                <div className="mt-0.5 flex h-[37px] items-center justify-center gap-1.5 rounded-[10px] border border-[#373032] bg-[#fffdf5] px-3">
                  <span className="truncate text-[15px] font-bold text-[#373032]">
                    {inviteLinkDisplay}
                  </span>
                  <button
                    type="button"
                    aria-label={t("house.group.copyLink")}
                    className="shrink-0 text-[#373032] transition-transform active:scale-90"
                    onClick={() =>
                      handleCopy(
                        inviteLink,
                        t("house.group.copySuccess"),
                        "link",
                      )
                    }
                  >
                    {copied === "link" ? (
                      <Check className="size-[18px] animate-in zoom-in-50 text-[#2e7d32] duration-200" />
                    ) : (
                      <Link2 className="size-[18px]" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

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
