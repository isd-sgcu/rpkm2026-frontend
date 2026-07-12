import { useState, useSyncExternalStore } from "react";
import { cn } from "@lib/utils";
import { useT } from "@lib/i18n/useT";
import {
  ActivityTabs,
  type Tab,
} from "@components/walkrally/events/ActivityTabs";
import { ActivityList } from "@components/walkrally/events/ActivityList";

type Topic = "white" | "black";

const topicTextClass: Record<Topic, string> = {
  white: "text-white",
  black: "text-foreground",
};

interface WalkRallyPanelProps {
  topic?: Topic;
}

function subscribeNoop() {
  return () => {};
}

function getUrlTabSnapshot(): Tab {
  const urlTab = new URLSearchParams(window.location.search).get("tab");
  return urlTab === "workshop" ||
    urlTab === "walkingTour" ||
    urlTab === "minigame"
    ? urlTab
    : "workshop";
}

function getServerTabSnapshot(): Tab {
  return "workshop";
}

const WalkRallyEventPanel = ({ topic = "white" }: WalkRallyPanelProps) => {
  const t = useT();
  const urlTab = useSyncExternalStore(
    subscribeNoop,
    getUrlTabSnapshot,
    getServerTabSnapshot,
  );
  const [manualTab, setManualTab] = useState<Tab | null>(null);
  const tab = manualTab ?? urlTab;

  return (
    <>
      <div
        className={cn(
          "absolute inset-x-0 top-[4.5cqw] sm:top-4.5 h-10 flex items-center justify-center text-xl font-bold pointer-events-none",
          topicTextClass[topic],
        )}
      >
        {t("walkrally.events.title")}
      </div>

      <div className="flex flex-col">
        <ActivityTabs tab={tab} onTabChange={setManualTab} />
        <ActivityList tab={tab} />
      </div>
    </>
  );
};

export default WalkRallyEventPanel;
