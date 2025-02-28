import { component$ } from "@builder.io/qwik";
import type { AnatomyItem } from "../../../auto-api/types";
import type { ComponentParts } from "../api-table/api-table";

export const AnatomyTable = component$<{ api: ComponentParts }>(({ api }) => {
  if (!api?.anatomy?.length) {
    return null;
  }

  const anatomyItems = api.anatomy.filter((item): item is AnatomyItem => "name" in item);

  return (
    <div class="my-4">
      <div class="border-neutral-primary border overflow-hidden">
        <table class="w-full border-collapse text-sm">
          <thead>
            <tr class="border-b border-neutral-primary bg-neutral-primary">
              <th class="py-4 px-4 text-left font-medium">Part</th>
              <th class="py-4 px-4 text-left font-medium">Description</th>
            </tr>
          </thead>
          <tbody>
            {anatomyItems.map((item) => (
              <tr
                key={item.name}
                class="border-b last-of-type:border-b-0 border-neutral-primary"
              >
                <td class="py-4 px-4 text-sm">
                  <span class="bg-neutral-primary rounded-sm block p-1 px-2 w-fit">
                    <span class="text-neutral-foreground">{"<"}</span>
                    <span class="text-white">{item.name.split(".")[0]}</span>
                    {item.name.includes(".") && (
                      <>
                        <span class="text-neutral-foreground">{"."}</span>
                        <span class="text-qwik-blue-300">{item.name.split(".")[1]}</span>
                      </>
                    )}
                    <span class="text-neutral-foreground">{"\u003E"}</span>
                  </span>
                </td>
                <td class="py-4 px-4 text-[#b8c1cc]">{item.description || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});
