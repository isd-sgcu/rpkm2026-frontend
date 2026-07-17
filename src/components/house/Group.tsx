import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MonotoneNoiseContainer } from "@components/shared/MonotoneNoise";
import { QueryProvider } from "@components/shared/QueryProvider";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import Logo from "@assets/images/house/house_group_logo.svg";
import SendIcon from "@assets/icons/send.svg";
import Vine from "@assets/images/house/group_vine.svg";
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
import { MemberWindow } from "./MemberWindow";

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

// const mockGetMyGroup = async (): Promise<GroupWithMembers> => ({
//   id: "group-1",
//   createdAt: new Date().toISOString(),
//   updatedAt: new Date().toISOString(),
//   leaderId: "1",
//   joinCode: "ABC123",
//   assignedHouseId: null,
//   assignedAt: null,
//   confirmedAt: null,
//   members: [
//     {
//       userId: "1",
//       firstName: "Alice",
//       lastName: "",
//       nickname: "Leader",
//       isLeader: true,
//     },
//     {
//       userId: "2",
//       firstName: "Bob",
//       lastName: "",
//       nickname: "Bob",
//       isLeader: false,
//     },
//     {
//       userId: "3",
//       firstName: "Chris",
//       lastName: "",
//       nickname: "Chris",
//       isLeader: false,
//     },
//   ],
// });

function GroupSummary({
  group,
  onOpen,
}: {
  group: GroupWithMembers;
  onOpen: () => void;
}) {
  const t = useT();

  const decorations = [
    "rotate-5 -translate-y-2",
    "-rotate-5 translate-y-2",
    "rotate-4 -translate-y-1",
    "-rotate-4",
  ];

  return (
    <>
      <p className="text-lg font-bold text-foreground">
        {t("house.group.memberCount", {
          count: String(group.members.length),
          max: String(GROUP_MAX_MEMBERS),
        })}
      </p>

      <div className="relative flex w-full items-start justify-between gap-1">
        <img src={Vine.src} alt="vine decoration" className="absolute top-5" />
        {Array.from(
          { length: GROUP_MAX_MEMBERS },
          (_, index) => group.members[index] ?? null,
        ).map((member, index) => (
          <div
            key={member?.userId ?? `empty-${index}`}
            className="h-20.25 w-17.25 flex items-center justify-center"
          >
            <div
              className={`${decorations[index]} scale-[0.65]`}
              style={{
                scale: "clamp(0.65, 2%, 0.85)",
              }}
            >
              {member ? (
                <MemberWindow
                  variant={member.isLeader ? "leader" : "member"}
                  name={memberName(member)}
                />
              ) : (
                <MemberWindow variant="empty" />
              )}
            </div>
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

/**
 * Join code carried over from an invite link (/room#CODE redirects to
 * /house?code=CODE). Read once on mount; consumed by the auto-join effect.
 */
function inviteCodeFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  const code = new URLSearchParams(window.location.search).get("code");
  return code ? code.trim().toUpperCase() : null;
}

function GroupPanel() {
  const t = useT();
  const profile = useProfile();
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  // Ref, not state: the code is consumed exactly once by the effect below
  // and never drives rendering.
  const autoJoinCodeRef = useRef(inviteCodeFromUrl());
  const { data, isLoading, isError } = useQuery({
    queryKey: ["rpkm-group"],
    queryFn: getMyGroup,
    // queryFn: mockGetMyGroup,
  });

  const autoJoinMutation = useMutation({
    mutationFn: joinGroup,
    onSuccess: () => {
      toast.success(t("house.group.joinSuccess"));
      queryClient.invalidateQueries({ queryKey: ["rpkm-group"] });
    },
    onError: (err) => toast.error(joinErrorMessage(err, t)),
  });

  useEffect(() => {
    // Wait until the user's own group is known so we can skip joining a
    // room they are already in, then consume the code exactly once.
    const code = autoJoinCodeRef.current;
    if (!code || !data) return;
    autoJoinCodeRef.current = null;
    const url = new URL(window.location.href);
    url.searchParams.delete("code");
    window.history.replaceState(null, "", url);
    if (data.joinCode !== code) {
      autoJoinMutation.mutate(code);
    }
  }, [data, autoJoinMutation]);

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
