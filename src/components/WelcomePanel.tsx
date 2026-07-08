import { useState } from "react";

import { MonotoneNoiseContainer } from "@components/shared/MonotoneNoise";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@components/ui/alert-dialog";
import { Button } from "@components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@components/ui/drawer";

type WelcomePanelProps = {
  appName: string;
};

export function WelcomePanel({ appName }: WelcomePanelProps) {
  const [isReady, setIsReady] = useState(false);

  return (
    <section className="grid gap-6 rounded-lg bg-white p-6 border">
      <div>
        <h1 className="text-4xl font-bold">{appName}</h1>
        <p className="text-lg text-[#46545b]">
          Astro, React, and TypeScript are ready for the team to start building
          product screens.
        </p>
      </div>

      <Button
        className="border-border"
        type="button"
        onClick={() => setIsReady((value) => !value)}
      >
        {isReady ? "Ready" : "Check React"}
      </Button>

      <Drawer>
        <DrawerTrigger
          render={
            <Button className="border-border" variant="secondary">
              drawer
            </Button>
          }
        />
        <DrawerContent>
          <div className="p-4">hihi</div>
        </DrawerContent>
      </Drawer>

      <AlertDialog>
        <AlertDialogTrigger
          render={<Button variant="outline">Show Dialog</Button>}
        />
        <AlertDialogContent className="border">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction variant="destructive" className="border-border">
              Continue
            </AlertDialogAction>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <MonotoneNoiseContainer className="bg-rpkm-green rounded-lg border p-4 py-6">
        <h1 className="text-black font-bold text-xl"> MonotoneNoise </h1>
        <p>hihi</p>
      </MonotoneNoiseContainer>
    </section>
  );
}
