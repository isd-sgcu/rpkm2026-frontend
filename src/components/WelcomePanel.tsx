import { useState } from "react";

import { Button } from "@components/ui/button";

type WelcomePanelProps = {
  appName: string;
};

export function WelcomePanel({ appName }: WelcomePanelProps) {
  const [isReady, setIsReady] = useState(false);

  return (
    <section className="grid gap-6 rounded-lg bg-white p-6">
      <div>
        <h1 className="text-4xl font-bold">{appName}</h1>
        <p className="text-lg text-[#46545b]">
          Astro, React, and TypeScript are ready for the team to start building
          product screens.
        </p>
      </div>

      <Button type="button" onClick={() => setIsReady((value) => !value)}>
        {isReady ? "Ready" : "Check React"}
      </Button>
    </section>
  );
}
