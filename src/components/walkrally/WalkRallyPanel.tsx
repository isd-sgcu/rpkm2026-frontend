import { useState } from "react";
import { cn } from "@lib/utils";

type Topic = "white" | "black";

const topicTextClass: Record<Topic, string> = {
  white: "text-white",
  black: "text-foreground",
};

interface WalkRallyPanelProps {
  topic?: Topic;
}

type Screen = { type: "events" } | { type: "eventDetail"; eventName: string };

// TODO: replace with real activity data
const sampleEvents = ["ปั้นลูกชุบ", "ทำพิมพ์สนำ", "เพ้นท์ถุงผ้า"];

const WalkRallyPanel = ({ topic = "white" }: WalkRallyPanelProps) => {
  const [screen, setScreen] = useState<Screen>({ type: "events" });

  const headerTitle = screen.type === "events" ? "กิจกรรม" : screen.eventName;

  return (
    <>
      <div
        className={cn(
          "absolute inset-x-0 top-[4.5cqw] sm:top-4.5 h-10 flex items-center justify-center text-xl font-bold pointer-events-none",
          topicTextClass[topic],
        )}
      >
        {/* TODO: i18n */}
        {headerTitle}
      </div>

      {screen.type === "events" && (
        <div className="flex flex-col gap-3">
          {sampleEvents.map((eventName) => (
            <button
              key={eventName}
              type="button"
              className="rounded-2xl bg-background p-4 text-left"
              onClick={() => setScreen({ type: "eventDetail", eventName })}
            >
              {eventName}
            </button>
          ))}
        </div>
      )}

      {screen.type === "eventDetail" && (
        <div className="flex flex-col gap-3">
          <button
            type="button"
            className="self-start text-sm underline"
            onClick={() => setScreen({ type: "events" })}
          >
            {/* TODO: i18n */}
            กลับ
          </button>
          <div className="rounded-2xl bg-background p-4">
            รายละเอียดกิจกรรม: {screen.eventName}
          </div>
        </div>
      )}
    </>
  );
};

export default WalkRallyPanel;
