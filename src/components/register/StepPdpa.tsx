import { useEffect, useRef, useState } from "react";
import { useStore } from "@nanostores/react";

import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";
import { $locale } from "@lib/i18n/locale";
import { PDPA_CONTENT, type PdpaBlock } from "@lib/pdpa";
import { DoubleArrowDownIcon, DoubleArrowUpIcon } from "./icons";

function Blocks({ blocks }: { blocks: PdpaBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        if (block.kind === "p") {
          return <p key={i}>{block.text}</p>;
        }
        if (block.kind === "defs") {
          return (
            <ul key={i} className="list-disc space-y-3 pl-4">
              {block.items.map((d) => (
                <li key={d.term}>
                  <span>{d.term}</span> {d.definition}
                </li>
              ))}
            </ul>
          );
        }
        const ListTag = block.ordered ? "ol" : "ul";
        return (
          <ListTag
            key={i}
            className={`space-y-3 pl-4 ${block.ordered ? "list-decimal" : "list-disc"}`}
          >
            {block.items.map((item, j) => (
              <li key={j} className="space-y-3">
                <span>{item.text}</span>
                {item.children && <Blocks blocks={item.children} />}
              </li>
            ))}
          </ListTag>
        );
      })}
    </>
  );
}

export function StepPdpa({ onConsent }: { onConsent: () => void }) {
  const locale = useStore($locale);
  const content = PDPA_CONTENT[locale];

  const scrollRef = useRef<HTMLDivElement>(null);
  const [atBottom, setAtBottom] = useState(false);
  const [hasReadToEnd, setHasReadToEnd] = useState(false);
  const [consented, setConsented] = useState(false);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const reachedEnd = el.scrollTop + el.clientHeight >= el.scrollHeight - 8;
    setAtBottom(reachedEnd);
    if (reachedEnd) setHasReadToEnd(true);
  };

  // If the policy doesn't overflow, there's nothing to scroll — unlock immediately.
  useEffect(() => {
    const el = scrollRef.current;
    if (el && el.scrollHeight <= el.clientHeight + 8) {
      setAtBottom(true);
      setHasReadToEnd(true);
    }
  }, []);

  const jump = () =>
    scrollRef.current?.scrollTo({
      top: atBottom ? 0 : scrollRef.current.scrollHeight,
      behavior: "smooth",
    });

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mt-6 shrink-0 px-6 text-center">
        <h1 className="text-3xl leading-tight text-primary">
          {content.title.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        <p className="mt-1 text-base text-foreground">{content.subtitle}</p>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="no-scrollbar mt-4 min-h-0 flex-1 space-y-3 overflow-y-auto px-6 text-base text-foreground"
      >
        {content.intro.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}

        <ol className="ml-5 list-decimal space-y-3">
          {content.sections.map((section) => (
            <li key={section.heading} className="space-y-3">
              <span>{section.heading}</span>
              <Blocks blocks={section.blocks} />
            </li>
          ))}
        </ol>
      </div>

      <div className="shrink-0 px-6 pt-3 pb-10">
        <button
          type="button"
          onClick={jump}
          className="mx-auto mb-3 flex items-center gap-1.5 text-sm text-rpkm-red"
        >
          {atBottom ? (
            <DoubleArrowUpIcon className="size-5" />
          ) : (
            <DoubleArrowDownIcon className="size-5" />
          )}
          {atBottom ? content.ui.scrollUp : content.ui.scrollDown}
        </button>

        <label className="mb-3 flex cursor-pointer items-start gap-2 text-sm text-foreground select-none">
          <Checkbox
            checked={consented}
            disabled={!hasReadToEnd}
            onCheckedChange={(checked) => setConsented(checked === true)}
            className="mt-0.5"
          />
          {content.consentLabel}
        </label>

        <Button
          type="button"
          size="lg"
          disabled={!consented}
          onClick={onConsent}
          className="h-14 w-full rounded-full text-lg font-normal disabled:bg-[#A1A1A1] disabled:text-primary-foreground disabled:opacity-100"
        >
          {content.ui.consentAction}
        </Button>
      </div>
    </div>
  );
}
