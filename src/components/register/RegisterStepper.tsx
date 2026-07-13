import step1Filled from "@assets/images/step1_filled.svg";
import step2Filled from "@assets/images/step2_filled.svg";
import step3Filled from "@assets/images/step3_filled.svg";
import step4Filled from "@assets/images/step4_filled.svg";
import step2NoFilled from "@assets/images/step2_no_filled.svg";
import step3NoFilled from "@assets/images/step3_no_filled.svg";
import step4NoFilled from "@assets/images/step4_no_filled.svg";
import wateringCan from "@assets/images/watering_can.svg";

type RegisterStepperProps = {
  current: number;
  total: number;
};

// Step 1 has no "no_filled" variant — position 1 is always reached (current ≥ 1).
const FILLED = [step1Filled, step2Filled, step3Filled, step4Filled];
const NO_FILLED = [step1Filled, step2NoFilled, step3NoFilled, step4NoFilled];

export function RegisterStepper({ current, total }: RegisterStepperProps) {
  const steps = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <div className="relative mx-auto flex w-full max-w-72 items-end justify-between px-3">
      {/* green stem connecting the pots */}
      <div
        aria-hidden
        className="absolute right-7 bottom-2 left-7 h-1 rounded-full bg-rpkm-green"
      />

      {steps.map((step) => {
        const reached = step <= current;
        const src = (reached ? FILLED : NO_FILLED)[step - 1].src;

        return (
          <div
            key={step}
            className="relative z-10 flex flex-col items-center"
            aria-current={step === current ? "step" : undefined}
          >
            {step === current && (
              <img
                src={wateringCan.src}
                alt=""
                aria-hidden
                className="absolute -top-7 left-1/2 h-7 w-auto -translate-x-1/4"
              />
            )}
            <img src={src} alt="" aria-hidden className="h-9 w-auto" />
          </div>
        );
      })}
    </div>
  );
}
