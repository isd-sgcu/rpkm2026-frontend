import { cn } from "@lib/utils";
import { useT } from "@lib/i18n/useT";
import { MonotoneNoise } from "@components/shared/MonotoneNoise";

export type Tab = "workshop" | "walkingTour" | "minigame";

const tabs: Tab[] = ["workshop", "walkingTour", "minigame"];

const rightOffsetClass = [
  "right-[58cqw] sm:right-[16.25rem]",
  "right-[31cqw] sm:right-[8.7rem]",
  "right-[4cqw] sm:right-[1.1rem]",
];

interface ActivityTabsProps {
  tab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function ActivityTabs({ tab, onTabChange }: ActivityTabsProps) {
  const t = useT();

  return (
    <div className="relative h-12 w-full">
      {tabs.map((tabOption, index) => {
        const active = tab === tabOption;
        return (
          <button
            key={tabOption}
            type="button"
            className={cn(
              "relative isolate flex w-[25cqw] items-center justify-center overflow-hidden rounded-t-2xl border border-b-0 border-black px-2 sm:w-28",
              rightOffsetClass[index],
              active
                ? "absolute bottom-0 z-10 h-12 bg-[#f0a9cb] p-1.5"
                : "absolute bottom-0 z-0 h-9 bg-background text-xs font-bold text-foreground",
            )}
            onClick={() => onTabChange(tabOption)}
          >
            {active && (
              <MonotoneNoise className="absolute inset-0 -z-1 pointer-events-none" />
            )}
            {active ? (
              <div
                className="h-6 w-full rounded-full bg-[#f3eeee]"
                aria-hidden="true"
              />
            ) : (
              t(`walkrally.tabs.${tabOption}`)
            )}
          </button>
        );
      })}
    </div>
  );
}
