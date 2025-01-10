import { component$ } from "@builder.io/qwik";
import { LuBadgeCheck } from "@qwikest/icons/lucide";
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
          <li class="flex items-center gap-2" key={feature}>
            <span>
              <LuBadgeCheck class="text-qwik-blue-400" />
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
});
