import { useSignal, useVisibleTask$, $ } from "@builder.io/qwik";

export const random = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min)) + min;

export const useRandomInterval = (
  callback: () => void,
  minDelay: number,
  maxDelay: number
) => {
  const timeoutId = useSignal<number>();

  useVisibleTask$(({ cleanup }) => {
    const isEnabled = typeof minDelay === "number" && typeof maxDelay === "number";

    if (isEnabled) {
      const handleTick = () => {
        const nextTickAt = random(minDelay, maxDelay);
        timeoutId.value = window.setTimeout(() => {
          callback();
          handleTick();
        }, nextTickAt);
      };
      handleTick();
    }

    cleanup(() => window.clearTimeout(timeoutId.value));
  });

  const cancel = $(() => {
    window.clearTimeout(timeoutId.value);
  });

  return cancel;
};
