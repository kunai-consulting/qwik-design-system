import { component$, Fragment, useContext, useTask$ } from "@builder.io/qwik";
import { Popover } from "@qwik-ui/headless";
import type { ComponentParts, ParsedProps } from "../../../auto-api/types";
import { rootContextId } from "~/routes/layout";
import { MainHeading, SubHeading } from "../toc/toc";

export const APITable = component$(({ api }: { api: ComponentParts }) => {
  const context = useContext(rootContextId);
  if (!api) return null;

  const componentName = Object.keys(api)[0];
  if (!componentName) return null;

  const items = Object.values(api)[0];

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
      const value = item[apiHeading as keyof typeof item];
      
      if (!value || typeof value !== 'object' || Object.keys(value).length === 0) continue;
      
      context.allHeadingsSig.value = [
        ...context.allHeadingsSig.value,
        {
          text: apiHeading,
          id: apiHeading,
          level: 3
        }
      ];
    }
  });

  return (
    <div class="overflow-x-auto">
      <MainHeading id="api-reference">API Reference</MainHeading>
      {Object.entries(api).map(([componentName, items]) => (
        <Fragment key={componentName}>
          {items.map((item) => {
            const componentData = Object.entries(item)[0];
            const [itemName, itemProps] = componentData;

            const propsArray =
              itemProps[0]?.[
                Object.keys(itemProps[0]).find((key) => key.endsWith("Props")) ?? ""
              ];

            if (!propsArray) return null;

            return (
              <div key={itemName}>
                <SubHeading id={itemName}>{itemName}</SubHeading>
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
                      <tr
                        key={prop.prop}
                        class="border-b border-gray-200 dark:border-gray-800"
                      >
                        <td class="py-4 px-4 font-mono text-sm">{prop.prop}</td>
                        <td class="py-4 px-4 font-mono text-sm">{prop.type}</td>
                        <td class="py-4 px-4 font-mono text-sm">
                          {prop.defaultValue || "-"}
                        </td>
                        <td class="py-4 px-4">
                          {prop.comment && (
                            <Popover.Root>
                              <Popover.Trigger class="text-blue-500 hover:text-blue-600">
                                Details
                              </Popover.Trigger>
                              <Popover.Panel class="p-4 max-w-xs">
                                {prop.comment}
                              </Popover.Panel>
                            </Popover.Root>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </Fragment>
      ))}
    </div>
  );
});
