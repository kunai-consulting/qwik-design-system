import type {
  AnatomyItem,
  ComponentEntry,
  ParsedProps
} from "@kunai-consulting/code-notate-core";
import { component$, useContext, useTask$ } from "@qwik.dev/core";

import { Popover } from "@qwik-ui/headless";
import { rootContextId } from "~/routes/layout";
import { MainHeading, SubHeading } from "../toc/toc";

type DataAttribute = {
  name: string;
  type: string;
  comment?: string;
};

type ItemProps = {
  types?: Array<Record<string, ParsedProps[]>>;
  dataAttributes?: DataAttribute[];
};

type KeyboardInteraction = {
  key: string;
  comment: string;
};

export type ComponentParts = {
  [key: string]: Array<AnatomyItem | ComponentEntry> | KeyboardInteraction[];
} & {
  keyboardInteractions?: KeyboardInteraction[];
  features?: string[];
  anatomy?: AnatomyItem[];
};

const getItemPropsCount = (item: Record<string, ItemProps>) => {
  const propsCount =
    Object.values(item)[0]?.types?.[0]?.[
      Object.keys(Object.values(item)[0]?.types?.[0] || {})[0]
    ]?.length || 0;

  const dataAttributesCount = Object.values(item)[0]?.dataAttributes?.length || 0;

  return propsCount + dataAttributesCount;
};

const sortByPropsCount = (
  a: AnatomyItem | ComponentEntry,
  b: AnatomyItem | ComponentEntry
) => {
  const aProps = getItemPropsCount(a as Record<string, ItemProps>);
  const bProps = getItemPropsCount(b as Record<string, ItemProps>);
  return bProps - aProps;
};

export const APITable = component$(({ api }: { api: ComponentParts }) => {
  const context = useContext(rootContextId);
  if (!api) return null;

  const componentName = Object.keys(api)[0];
  if (!componentName) return null;

  const items = api[componentName]
    .filter((item): item is ComponentEntry => !("anatomy" in item || "key" in item))
    .sort(sortByPropsCount);

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
      context.allHeadingsSig.value = [
        ...context.allHeadingsSig.value,
        {
          text: apiHeading,
          id: apiHeading,
          level: 3
        }
      ];
    }

    if (api.keyboardInteractions?.length) {
      context.allHeadingsSig.value = [
        ...context.allHeadingsSig.value,
        {
          text: "Accessibility",
          id: "accessibility",
          level: 2
        },
        {
          text: "Keyboard Interactions",
          id: "keyboard-interactions",
          level: 3
        }
      ];
    }
  });

  return (
    <div class="overflow-x-auto">
      <MainHeading id="api-reference">API Reference</MainHeading>
      {items.map((item, index) => {
        const componentData = Object.entries(item)[0];
        const [itemName, itemProps] = componentData;

        if (!itemProps || typeof itemProps !== "object") return null;

        const propsArray = itemProps.types?.[0]?.[Object.keys(itemProps.types[0])[0]];

        return (
          <div key={itemName}>
            <div
              class={`h-[1px] bg-neutral-primary ${index === 0 ? "mt-0" : "mt-8"}`}
              aria-hidden="true"
            />
            <SubHeading id={itemName}>{itemName}</SubHeading>
            {itemProps.inheritsFrom && (
              <p class="mb-4 text-sm text-neutral-foreground mt-4">
                Inherits from:{" "}
                <code class="px-2 py-1 !bg-neutral-primary !text-qwik-blue-300">
                  {`<${itemProps.inheritsFrom} />`}
                </code>
              </p>
            )}

            {/* Props Table */}
            {propsArray && propsArray.length > 0 && (
              <>
                <h4 class="mb-2 font-medium">Props</h4>
                <div class="border-neutral-primary border mb-6">
                  <table class="w-full border-collapse text-sm">
                    <thead>
                      <tr class="border-b border-neutral-primary bg-neutral-primary">
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
                          class="border-b last-of-type:border-b-0 border-qwik-neutral-900"
                        >
                          <td class="py-4 px-4 text-sm">{prop.prop}</td>
                          <td class="py-4 px-4 text-sm">{prop.type}</td>
                          <td class="py-4 px-4 text-sm">{prop.defaultValue || "-"}</td>
                          <td class="py-4 px-4">
                            {prop.comment && (
                              <Popover.Root gutter={4}>
                                <Popover.Trigger class="text-qwik-blue-500 hover:text-blue-300 cursor-pointer">
                                  Details
                                </Popover.Trigger>
                                <Popover.Panel class="p-4 max-w-xs bg-neutral-foreground rounded-md">
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
              </>
            )}

            {/* Data Attributes Table */}
            {itemProps.dataAttributes && itemProps.dataAttributes.length > 0 && (
              <>
                <h4 class="mb-2 font-medium">Data Attributes</h4>
                <div class="border-neutral-primary border">
                  <table class="w-full border-collapse text-sm">
                    <thead>
                      <tr class="border-b border-neutral-primary bg-neutral-primary">
                        <th class="py-4 px-4 text-left font-medium">Attribute</th>
                        <th class="py-4 px-4 text-left font-medium">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itemProps.dataAttributes.map((attr: DataAttribute) => (
                        <tr
                          key={attr.name}
                          class="border-b last-of-type:border-b-0 border-neutral-primary"
                        >
                          <td class="py-4 px-4 text-sm text-qwik-blue-200">
                            {attr.name}
                          </td>
                          <td class="py-4 px-4">{attr.comment}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        );
      })}

      {/* Add Keyboard Interactions Table */}
      {api.keyboardInteractions && api.keyboardInteractions.length > 0 && (
        <>
          <MainHeading id="accessibility">Accessibility</MainHeading>
          <SubHeading id="keyboard-interactions">Keyboard Interactions</SubHeading>
          <div class="border-neutral-primary border mt-6">
            <table class="w-full border-collapse border-spacing-1 text-sm">
              <thead>
                <tr class="border-b border-neutral-primary bg-neutral-primary">
                  <th class="py-4 px-4 text-left font-medium">Key</th>
                  <th class="py-4 px-4 text-left font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {api.keyboardInteractions.map((interaction) => (
                  <tr
                    key={interaction.key}
                    class="border-b last-of-type:border-b-0 border-neutral-primary"
                  >
                    <td class="py-4 px-4 text-sm flex items-center">
                      <span class="bg-neutral-interactive px-3 py-1 border-b-2 border-neutral-primary rounded-md">
                        {interaction.key}
                      </span>
                    </td>
                    <td class="py-4 px-4">{interaction.comment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
});
