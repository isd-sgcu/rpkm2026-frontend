import { useState } from "react";
import { cn } from "@lib/utils";
import { useT } from "@lib/i18n/useT";
import { ActivityTabs, type Tab } from "@components/walkrally/ActivityTabs";
import { ActivityList } from "@components/walkrally/ActivityList";

type Topic = "white" | "black";

const topicTextClass: Record<Topic, string> = {
  white: "text-white",
  black: "text-foreground",
};

interface WalkRallyPanelProps {
  topic?: Topic;
}

const WalkRallyPanel = ({ topic = "white" }: WalkRallyPanelProps) => {
  const t = useT();
  const [tab, setTab] = useState<Tab>("workshop");

  return (
    <>
      <div
        className={cn(
          "absolute inset-x-0 top-[4.5cqw] sm:top-4.5 h-10 flex items-center justify-center text-xl font-bold pointer-events-none",
          topicTextClass[topic],
        )}
      >
        {t("walkrally.title")}
      </div>

      <div className="flex flex-col">
        <ActivityTabs tab={tab} onTabChange={setTab} />
        <ActivityList tab={tab} />
      </div>
    </>
  );
};

export default WalkRallyPanel;
