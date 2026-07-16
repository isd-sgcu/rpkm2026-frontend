import { MonotoneNoiseContainer } from "@components/shared/MonotoneNoise";
import * as React from "react";

export default function ListChip({ children }: React.PropsWithChildren) {
  return (
    <MonotoneNoiseContainer className="bg-[#D7F4FF] px-2 py-1 border rounded-4xl whitespace-pre-wrap wrap-break-word max-w-full">
      {children}
    </MonotoneNoiseContainer>
  );
}
