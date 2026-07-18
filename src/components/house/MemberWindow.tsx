import { UserRound } from "lucide-react";

import star_leader from "@assets/images/house/group_star_leader.svg";
import star_member from "@assets/images/house/group_star_member.svg";
import star_empty from "@assets/images/house/group_star_empty.svg";
import kick_icon from "@assets/images/house/group_kick.svg";

export type MemberWindowVariant = "leader" | "member" | "empty";

const FRAME_BG: Record<MemberWindowVariant, string> = {
  leader: "bg-[#e75124]",
  member: "bg-[#fae200]",
  empty: "bg-[#a3a3a3]",
};

const INNER_BG: Record<MemberWindowVariant, string> = {
  leader: "bg-[#f6d7e4]",
  member: "bg-[#f6d7e4]",
  empty: "bg-[#d9d9d9]",
};

const TAG_BG: Record<MemberWindowVariant, string> = {
  leader: "bg-[#fae200]",
  member: "bg-[#fefdf5]",
  empty: "bg-[#a1a1a1]",
};

const STAR: Record<MemberWindowVariant, { src: string }> = {
  leader: star_leader,
  member: star_member,
  empty: star_empty,
};

/**
 * House-window member frame from the Figma group modal (node 1994:20503):
 * colored window frame, green sill, name tag pill, corner star (yellow for
 * the leader, blue for members, gray for empty slots) and an optional round
 * kick button overlapping the top-right corner.
 */
export function MemberWindow({
  variant,
  name,
  onKick,
  kickLabel,
}: {
  variant: MemberWindowVariant;
  name?: string;
  onKick?: () => void;
  kickLabel?: string;
}) {
  return (
    <div className="relative h-[131px] w-[111px]">
      <div
        className={`absolute top-[10px] left-[4px] flex size-[103px] items-center justify-center rounded-[3px] border border-[#373032] ${FRAME_BG[variant]}`}
      >
        <div
          className={`flex size-[87px] items-center justify-center rounded-[3px] border border-[#373032] ${INNER_BG[variant]}`}
        >
          {variant !== "empty" && (
            <UserRound className="size-12 text-[#373032]/50" />
          )}
        </div>
      </div>

      <div
        className={`absolute top-[107px] left-[1.5px] h-[10px] w-[108px] rounded-[1px] border border-[#373032] ${
          variant === "empty" ? "bg-[#a3a3a3]" : "bg-[#6abf73]"
        }`}
      />

      <img
        src={STAR[variant].src}
        alt=""
        className={
          variant === "member"
            ? "absolute -top-1 right-0 w-[36px]"
            : "absolute -top-1 left-0 w-[36px]"
        }
      />

      <div
        className={`absolute top-[101px] left-1/2 w-[74px] -translate-x-1/2 rounded-[5px] border border-[#373032] px-1 text-center ${TAG_BG[variant]}`}
      >
        <span className="block truncate text-[15px] leading-[22px] font-bold text-[#373032]">
          {name ?? " "}
        </span>
      </div>

      {onKick && (
        <button
          type="button"
          aria-label={kickLabel}
          onClick={onKick}
          className="absolute -top-[6px] -right-[10px] size-8"
        >
          <img src={kick_icon.src} alt="" className="size-full" />
        </button>
      )}
    </div>
  );
}
