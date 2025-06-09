import { component$ } from "@builder.io/qwik";
import { Tooltip } from "@kunai-consulting/qwik";

const positions = [
  { side: "top", label: "Top" },
  { side: "right", label: "Right" },
  { side: "bottom", label: "Bottom" },
  { side: "left", label: "Left" }
] as const;

const alignments = [
  { align: "start", label: "Start" },
  { align: "center", label: "Center" },
  { align: "end", label: "End" }
] as const;

const combinedExamples = [
  { side: "top", align: "start", label: "Top Start" },
  { side: "right", align: "center", label: "Right Center" },
  { side: "bottom", align: "end", label: "Bottom End" }
] as const;

export default component$(() => {
  return (
    <div class="flex flex-col gap-8">
      <div class="flex flex-col gap-4">
        <h3 class="text-lg font-semibold">Side Positions</h3>
        <div class="flex flex-wrap gap-4">
          {positions.map(({ side, label }) => (
            <Tooltip.Root key={side}>
              <Tooltip.Trigger class="bg-qwik-blue-700 p-1">{label}</Tooltip.Trigger>
              <Tooltip.Content side={side} class="w-max" align="center" sideOffset={10}>
                <p>Tooltip on {side}</p>
                <Tooltip.Arrow />
              </Tooltip.Content>
            </Tooltip.Root>
          ))}
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <h3 class="text-lg font-semibold">Alignment Options</h3>
        <div class="flex flex-wrap gap-4">
          {alignments.map(({ align, label }) => (
            <Tooltip.Root key={align}>
              <Tooltip.Trigger class="bg-qwik-blue-700 p-1">{label}</Tooltip.Trigger>
              <Tooltip.Content side="top" align={align} class="w-max" sideOffset={10}>
                <p>Aligned to {align}</p>
                <Tooltip.Arrow />
              </Tooltip.Content>
            </Tooltip.Root>
          ))}
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <h3 class="text-lg font-semibold">Combined Examples</h3>
        <div class="flex flex-wrap gap-4">
          {combinedExamples.map(({ side, align, label }) => (
            <Tooltip.Root key={`${side}-${align}`}>
              <Tooltip.Trigger class="bg-qwik-blue-700 p-1">{label}</Tooltip.Trigger>
              <Tooltip.Content side={side} align={align} sideOffset={10}>
                <p>{label}</p>
                <Tooltip.Arrow />
              </Tooltip.Content>
            </Tooltip.Root>
          ))}
        </div>
      </div>
    </div>
  );
});
