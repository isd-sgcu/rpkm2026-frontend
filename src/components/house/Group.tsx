import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Copy, RefreshCw, Crown, UserRound, X } from "lucide-react";

import { MonotoneNoiseContainer } from "@components/shared/MonotoneNoise";
import { QueryProvider } from "@components/shared/QueryProvider";
import { Toaster } from "@components/ui/sonner";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
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
import Logo from "@assets/images/house/house_group_logo.svg";
import SendIcon from "@assets/icons/send.svg";
import danger_icon from "@assets/icons/danger.svg";
import { APIError } from "@lib/client";
import { useT, type Translator } from "@lib/i18n/useT";
import { useProfile } from "@lib/auth/useProfile";
import {
  GROUP_MAX_MEMBERS,
  getMyGroup,
  joinGroup,
  kickMember,
  leaveGroup,
  regenerateJoinCode,
  type GroupMember,
  type GroupWithMembers,
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

function joinErrorMessage(err: unknown, t: Translator) {
  if (err instanceof APIError) {
    switch (err.code) {
      case "INVALID_JOIN_CODE":
        return t("house.group.joinErrorInvalidCode");
      case "GROUP_FULL":
        return t("house.group.joinErrorGroupFull");
      case "ALREADY_CONFIRMED":
        return t("house.group.joinErrorAlreadyConfirmed");
      case "LEADER_HAS_MEMBERS":
        return t("house.group.leaderHasMembersDesc");
    }
  }
  return t("house.group.joinErrorGeneric");
}

function GroupCard({
  group,
  currentUserId,
}: {
  group: GroupWithMembers;
  currentUserId: string | null;
}) {
  const t = useT();
  const queryClient = useQueryClient();
  const [dialog, setDialog] = useState<DialogState>({ type: "none" });
  const [joinCodeInput, setJoinCodeInput] = useState("");

  const viewerIsLeader =
    currentUserId !== null && group.leaderId === currentUserId;
  const hasOtherMembers = group.members.length > 1;

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["rpkm-group"] });

  const joinMutation = useMutation({
    mutationFn: joinGroup,
    onSuccess: () => {
      setJoinCodeInput("");
      invalidate();
    },
    onError: (err) => toast.error(joinErrorMessage(err, t)),
  });

  const leaveMutation = useMutation({
    mutationFn: leaveGroup,
    onSuccess: () => {
      setDialog({ type: "none" });
      invalidate();
    },
    onError: () => {
      setDialog({ type: "none" });
      toast.error(t("house.group.leaveErrorGeneric"));
    },
  });

  const kickMutation = useMutation({
    mutationFn: kickMember,
    onSuccess: () => {
      setDialog({ type: "none" });
      invalidate();
    },
    onError: () => {
      setDialog({ type: "none" });
      toast.error(t("house.group.kickErrorGeneric"));
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

  const handleJoinSubmit = () => {
    const code = joinCodeInput.trim();
    if (!code || joinMutation.isPending) return;
    if (viewerIsLeader && hasOtherMembers) {
      setDialog({ type: "blocked" });
      return;
    }
    joinMutation.mutate(code);
  };

  const inviteLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/house?code=${group.joinCode}`
      : `/house?code=${group.joinCode}`;

  const slots: (GroupMember | null)[] = Array.from(
    { length: GROUP_MAX_MEMBERS },
    (_, index) => group.members[index] ?? null,
  );

  return (
    <>
      <div className="flex w-full flex-col items-center gap-5">
        <div className="relative flex w-full flex-col items-center gap-1">
          <img
            src={Logo.src}
            alt={t("house.group.title")}
            width={109}
            height={75}
            className="mx-auto"
          />
          <p className="text-lg font-bold text-foreground">
            {t("house.group.memberCount", {
              count: String(group.members.length),
              max: String(GROUP_MAX_MEMBERS),
            })}
          </p>

          <Button
            type="button"
            size="sm"
            variant="destructive"
            className="absolute top-0 right-0 rounded-full"
            onClick={handlePrimaryActionClick}
            disabled={leaveMutation.isPending}
          >
            {viewerIsLeader
              ? t("house.group.deleteRoom")
              : t("house.group.leaveRoom")}
          </Button>
        </div>

        <div className="grid w-full grid-cols-2 gap-3">
          {slots.map((member, index) =>
            member ? (
              <div
                key={member.userId}
                className="relative flex flex-col items-center gap-1 rounded-2xl border border-foreground bg-background p-3"
              >
                {member.isLeader && (
                  <Crown className="absolute -top-2 -left-2 size-6 text-yellow-500" />
                )}
                {viewerIsLeader && member.userId !== currentUserId && (
                  <button
                    type="button"
                    aria-label={t("house.group.removeMember", {
                      name: memberName(member),
                    })}
                    className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full border border-foreground bg-destructive text-background"
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
                className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-muted-foreground/50 p-3 text-muted-foreground"
              >
                <UserRound className="size-10" />
                <span className="text-sm">{t("house.group.emptySlot")}</span>
              </div>
            ),
          )}
        </div>

        <div className="flex w-full flex-col gap-2">
          <div className="flex items-center justify-between gap-2 rounded-full border border-foreground bg-background px-4 py-2">
            <div className="flex min-w-0 flex-col">
              <span className="text-xs text-muted-foreground">
                {t("house.group.joinCodeLabel")}
              </span>
              <span className="text-lg font-bold tracking-[0.3em]">
                {group.joinCode}
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              {viewerIsLeader && (
                <button
                  type="button"
                  aria-label={t("house.group.regenerateCode")}
                  className="flex size-8 items-center justify-center rounded-full hover:bg-muted disabled:opacity-50"
                  onClick={() => regenerateMutation.mutate()}
                  disabled={regenerateMutation.isPending}
                >
                  <RefreshCw className="size-4" />
                </button>
              )}
              <button
                type="button"
                aria-label={t("house.group.copyCode")}
                className="flex size-8 items-center justify-center rounded-full hover:bg-muted"
                onClick={() =>
                  handleCopy(group.joinCode, t("house.group.copySuccess"))
                }
              >
                <Copy className="size-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 rounded-full border border-foreground bg-background px-4 py-2">
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
              <Copy className="size-4" />
            </button>
          </div>
        </div>

        <div className="relative w-full">
          <Input
            placeholder={t("house.group.joinPlaceholder")}
            value={joinCodeInput}
            onChange={(event) =>
              setJoinCodeInput(event.target.value.toUpperCase())
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") handleJoinSubmit();
            }}
            className="h-13.5 rounded-full border-foreground bg-background px-13 text-center"
            disabled={joinMutation.isPending}
          />
          <button
            type="button"
            aria-label={t("house.group.joinAction")}
            className="absolute top-1/2 right-4 -translate-y-1/2 disabled:opacity-50"
            onClick={handleJoinSubmit}
            disabled={joinMutation.isPending}
          >
            <img src={SendIcon.src} alt="" className="size-6" />
          </button>
        </div>
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
    </>
  );
}

function GroupPanel() {
  const t = useT();
  const profile = useProfile();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["rpkm-group"],
    queryFn: getMyGroup,
  });

  const currentUserId = profile.status === "ready" ? profile.me.id : null;

  return (
    <MonotoneNoiseContainer
      noise={{
        noiseSize: 0.7,
        noiseDensity: 20,
        noiseColor: "rgba(0 0 0 / 0.59)",
        noiseSeed: 7087,
      }}
      className="flex w-full flex-col items-center gap-6 rounded-[29px] border border-foreground bg-[#f1aacc] px-8 py-5"
    >
      {isLoading ? (
        <p className="py-6 text-foreground">{t("house.group.loading")}</p>
      ) : isError || !data ? (
        <p className="py-6 text-destructive">{t("house.group.loadError")}</p>
      ) : (
        <GroupCard group={data} currentUserId={currentUserId} />
      )}
      <Toaster />
    </MonotoneNoiseContainer>
  );
}

export default function Group() {
  return (
    <QueryProvider>
      <GroupPanel />
    </QueryProvider>
  );
}
