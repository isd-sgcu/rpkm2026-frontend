import { useState } from "react";
import { cn } from "@lib/utils";
import { useT } from "@lib/i18n/useT";
import { ActivityTabs, type Tab } from "@components/walkrally/ActivityTabs";
import { ActivityList } from "@components/walkrally/ActivityList";
import { EventDetail } from "@components/walkrally/EventDetail";

type Topic = "white" | "black";

const topicTextClass: Record<Topic, string> = {
  white: "text-white",
  black: "text-foreground",
};

interface WalkRallyPanelProps {
  topic?: Topic;
}

type Screen = { type: "events" } | { type: "eventDetail"; eventName: string };

const WalkRallyPanel = ({ topic = "white" }: WalkRallyPanelProps) => {
  const t = useT();
  const [tab, setTab] = useState<Tab>("workshop");
  const [screen, setScreen] = useState<Screen>({ type: "events" });

  const headerTitle =
    screen.type === "events" ? t("walkrally.title") : screen.eventName;

  return (
    <>
      <div
        className={cn(
          "absolute inset-x-0 top-[4.5cqw] sm:top-4.5 h-10 flex items-center justify-center text-xl font-bold pointer-events-none",
          topicTextClass[topic],
        )}
      >
        {headerTitle}
      </div>

      {screen.type === "events" && (
        <div className="flex flex-col">
          <ActivityTabs tab={tab} onTabChange={setTab} />
          <ActivityList
            tab={tab}
            onSelect={(activity) =>
              setScreen({ type: "eventDetail", eventName: activity.name })
            }
          />
        </div>
      )}

      {screen.type === "eventDetail" && (
        <EventDetail
          eventName={screen.eventName}
          onBack={() => setScreen({ type: "events" })}
        />
      )}
    </>
  );
};

export default WalkRallyPanel;
