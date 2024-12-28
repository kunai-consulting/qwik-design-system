import { component$, useContext, useTask$ } from "@builder.io/qwik";
import { Popover } from "@qwik-ui/headless";
import type { ComponentParts, ParsedProps } from "../../../auto-api/types";
import { rootContextId } from "~/routes/layout";

export const APITable = component$(({ api }: { api: ComponentParts }) => {
  console.log("init api table");
  const context = useContext(rootContextId);
  if (!api) return null;

  const componentName = Object.keys(api)[0];
  if (!componentName) return null;

  const items = Object.values(api)[0];
  if (!items) return null;

  const propsContainer = items
    .map((item) => Object.values(item)[0])
    .find(
      (value) =>
        Array.isArray(value) &&
        value.length > 0 &&
        Object.keys(value[0]).some((key) => key.endsWith("Props"))
    );

  const propsArray =
    propsContainer?.[0]?.[
      Object.keys(propsContainer[0]).find((key) => key.endsWith("Props")) ?? ""
    ];

  if (!propsArray) return null;

  console.log("items: ", items);

  useTask$(() => {
    context.allHeadingsSig.value = [
      {
        text: "API Reference",
        id: "api-reference",
        level: 2
      }
    ];

    for (const item of items) {
      const apiHeading = Object.keys(item)[0];
      console.log("apiHeading: ", apiHeading.split("-")[0]);
      context.allHeadingsSig.value = [
        ...context.allHeadingsSig.value,
        {
          text: apiHeading,
          id: componentName,
          level: 3
        }
      ];
    }
  });

  return (
    <div class="overflow-x-auto">
      <h2>API</h2>
      <table class="w-full border-collapse text-sm">
        <thead>
          <tr class="border-b border-gray-200 dark:border-gray-800">
            <th class="py-4 px-4 text-left font-medium">Prop</th>
            <th class="py-4 px-4 text-left font-medium">Type</th>
            <th class="py-4 px-4 text-left font-medium">Default</th>
            <th class="py-4 px-4 text-left font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          {propsArray.map((prop: ParsedProps) => (
            <tr key={prop.prop} class="border-b border-gray-200 dark:border-gray-800">
              <td class="py-4 px-4 font-mono text-sm">{prop.prop}</td>
              <td class="py-4 px-4 font-mono text-sm">{prop.type}</td>
              <td class="py-4 px-4 font-mono text-sm">{prop.defaultValue || "-"}</td>
              <td class="py-4 px-4">
                {prop.comment && (
                  <Popover.Root>
                    <Popover.Trigger class="text-blue-500 hover:text-blue-600">
                      Details
                    </Popover.Trigger>
                    <Popover.Panel class="p-4 max-w-xs">{prop.comment}</Popover.Panel>
                  </Popover.Root>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
