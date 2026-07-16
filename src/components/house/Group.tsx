import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Crown, UserRound } from "lucide-react";

import { MonotoneNoiseContainer } from "@components/shared/MonotoneNoise";
import { QueryProvider } from "@components/shared/QueryProvider";
import { Toaster } from "@components/ui/sonner";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import Logo from "@assets/images/house/house_group_logo.svg";
import SendIcon from "@assets/icons/send.svg";
import { APIError } from "@lib/client";
import { useT, type Translator } from "@lib/i18n/useT";
import { useProfile } from "@lib/auth/useProfile";
import {
  GROUP_MAX_MEMBERS,
  getMyGroup,
  joinGroup,
  type GroupWithMembers,
} from "@lib/api/groups";
import GroupDetailModal from "./GroupDetailModal";

function memberName(member: { nickname: string | null; firstName: string }) {
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

function SoloCreateJoin({ onCreateRoom }: { onCreateRoom: () => void }) {
  const t = useT();
  const queryClient = useQueryClient();
  const [joinCodeInput, setJoinCodeInput] = useState("");

  const joinMutation = useMutation({
    mutationFn: joinGroup,
    onSuccess: () => {
      setJoinCodeInput("");
      queryClient.invalidateQueries({ queryKey: ["rpkm-group"] });
    },
    onError: (err) => toast.error(joinErrorMessage(err, t)),
  });

  const handleJoinSubmit = () => {
    const code = joinCodeInput.trim();
    if (!code || joinMutation.isPending) return;
    joinMutation.mutate(code);
  };

  return (
    <>
      <Button
        type="button"
        size="xl"
        className="h-17.5 w-[85%] rounded-full border-foreground text-2xl"
        onClick={onCreateRoom}
      >
        {t("house.group.createRoom")}
      </Button>

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
    </>
  );
}

function GroupSummary({
  group,
  onOpen,
}: {
  group: GroupWithMembers;
  onOpen: () => void;
}) {
  const t = useT();

  return (
    <>
      <p className="text-lg font-bold text-foreground">
        {t("house.group.memberCount", {
          count: String(group.members.length),
          max: String(GROUP_MAX_MEMBERS),
        })}
      </p>

      <div className="flex w-full items-center justify-center gap-3">
        {group.members.map((member) => (
          <div
            key={member.userId}
            className="relative flex flex-col items-center gap-1 rounded-2xl border border-foreground bg-background p-2"
          >
            {member.isLeader && (
              <Crown className="absolute -top-2 -left-2 size-5 text-yellow-500" />
            )}
            <UserRound className="size-8 text-muted-foreground" />
            <span className="max-w-14 truncate rounded-full bg-secondary px-2 text-xs font-medium">
              {memberName(member)}
            </span>
          </div>
        ))}
      </div>

      <Button
        type="button"
        size="xl"
        className="h-13.5 w-[70%] rounded-full border-foreground text-xl"
        onClick={onOpen}
      >
        {t("house.group.enterRoom")}
      </Button>
    </>
  );
}

function GroupPanel() {
  const t = useT();
  const profile = useProfile();
  const [modalOpen, setModalOpen] = useState(false);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["rpkm-group"],
    queryFn: getMyGroup,
  });

  const currentUserId = profile.status === "ready" ? profile.me.id : null;
  const isSolo = !!data && data.members.length === 1;

  return (
    <>
      <MonotoneNoiseContainer
        noise={{
          noiseSize: 0.7,
          noiseDensity: 20,
          noiseColor: "rgba(0 0 0 / 0.59)",
          noiseSeed: 7087,
        }}
        className="flex w-full flex-col items-center gap-6 rounded-[29px] border border-foreground bg-[#f1aacc] px-8 py-5"
      >
        <img
          src={Logo.src}
          alt={t("house.group.title")}
          width={109}
          height={75}
          className="mx-auto"
        />

        {isLoading ? (
          <p className="py-6 text-foreground">{t("house.group.loading")}</p>
        ) : isError || !data ? (
          <p className="py-6 text-destructive">{t("house.group.loadError")}</p>
        ) : isSolo ? (
          <SoloCreateJoin onCreateRoom={() => setModalOpen(true)} />
        ) : (
          <GroupSummary group={data} onOpen={() => setModalOpen(true)} />
        )}
      </MonotoneNoiseContainer>

      {modalOpen && (
        <GroupDetailModal
          currentUserId={currentUserId}
          onClose={() => setModalOpen(false)}
        />
      )}

      <Toaster />
    </>
  );
}

export default function Group() {
  return (
    <QueryProvider>
      <GroupPanel />
    </QueryProvider>
  );
}
