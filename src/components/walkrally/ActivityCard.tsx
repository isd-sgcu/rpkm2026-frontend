import { getImageUrl } from "@lib/function";
import { ChevronRight } from "lucide-react";

export interface Activity {
  id: string;
  name: string;
  description?: string;
  imageName?: string;
}

interface ActivityCardProps {
  activity: Activity;
  accentColor: string;
}

export function ActivityCard({ activity, accentColor }: ActivityCardProps) {
  const imageUrl = getImageUrl(activity.imageName ?? "");
  const frameStyle = { backgroundColor: accentColor };

  return (
    <a
      href={`/walkrally/${activity.id}`}
      style={frameStyle}
      className="rounded-3xl border border-black p-1 text-left"
    >
      <div className="relative flex items-center gap-3 rounded-[1.15rem] border border-black bg-[#FFFAC9] p-2 pr-10 sm:gap-4 sm:p-3">
        <div
          style={frameStyle}
          className="shrink-0 rounded-2xl border border-black p-1"
        >
          {activity.imageName ? (
            <img
              src={imageUrl}
              alt=""
              className="size-24 rounded-xl border border-black object-cover sm:size-28"
            />
          ) : (
            <div className="size-24 rounded-xl border border-black bg-muted sm:size-28" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-base font-bold sm:text-lg">{activity.name}</div>
          {activity.description && (
            <p className="line-clamp-3 text-xs text-muted-foreground sm:text-sm">
              {activity.description}
            </p>
          )}
        </div>
        <ChevronRight className="text-black absolute right-2 bottom-2 size-6 shrink-0" />
      </div>
    </a>
  );
}
