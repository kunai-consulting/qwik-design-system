import { component$ } from "@builder.io/qwik";
import type { ComponentParts } from "../api-table/api-table";

export const Features = component$<{ api: ComponentParts }>(({ api }) => {
  if (!api?.features?.length) return null;

  const features = api.features.filter(
    (item): item is string => typeof item === "string"
  );

  return (
    <div class="my-4">
      <ul class="list-disc list-inside space-y-2">
        {features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
    </div>
  );
});
