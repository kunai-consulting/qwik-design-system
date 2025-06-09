import { component$ } from "@builder.io/qwik";
import { Tooltip } from "@kunai-consulting/qwik";

const delays = [
  { duration: 0, label: "No delay", text: "This tooltip appears immediately" },
  { duration: 500, label: "500ms delay", text: "This tooltip appears after 500ms" },
  { duration: 1000, label: "1s delay", text: "This tooltip appears after 1 second" }
] as const;

export default component$(() => {
  return (
    <div class="flex gap-4 items-center">
      {delays.map(({ duration, label, text }) => (
        <Tooltip.Root key={duration} delayDuration={duration}>
          <Tooltip.Trigger class="bg-qwik-blue-700 p-1">{label}</Tooltip.Trigger>
          <Tooltip.Content>{text}</Tooltip.Content>
        </Tooltip.Root>
      ))}
    </div>
  );
});
