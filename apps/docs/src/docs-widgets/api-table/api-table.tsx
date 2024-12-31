import { component$, Fragment, useContext, useTask$ } from "@builder.io/qwik";
import { Popover } from "@qwik-ui/headless";
import type {
  AnatomyItem,
  ComponentEntry,
  ComponentParts,
  ParsedProps
} from "../../../auto-api/types";
import { rootContextId } from "~/routes/layout";
import { MainHeading, SubHeading } from "../toc/toc";

type DataAttribute = {
  name: string;
  type: string;
  comment: string;
};

type ItemProps = {
  types?: Array<Record<string, ParsedProps[]>>;
  dataAttributes?: DataAttribute[];
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

  const items = Object.values(api)[0]
    .filter((item) => !("anatomy" in item))
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
  });

  return (
    <div class="overflow-x-auto">
      <MainHeading id="api-reference">API Reference</MainHeading>
      {Object.entries(api).map(([componentName, items]) => (
        <Fragment key={componentName}>
          {items
            .filter((item) => !("anatomy" in item))
            .sort(sortByPropsCount)
            .map((item) => {
              const componentData = Object.entries(item)[0];
              const [itemName, itemProps] = componentData;

              if (!itemProps || typeof itemProps !== "object") return null;

              const propsArray =
                itemProps.types?.[0]?.[Object.keys(itemProps.types[0])[0]];

              return (
                <div key={itemName}>
                  <SubHeading id={itemName}>{itemName}</SubHeading>
                  {itemProps.inheritsFrom && (
                    <p class="mb-4 text-sm text-gray-600 dark:text-gray-400">
                      Inherits from: <code>{itemProps.inheritsFrom}</code>
                    </p>
                  )}

                  {/* Props Table */}
                  {propsArray && propsArray.length > 0 && (
                    <>
                      <h4 class="mb-2 font-medium">Props</h4>
                      <table class="w-full border-collapse text-sm mb-6">
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
                    </>
                  )}

                  {/* Data Attributes Table */}
                  {itemProps.dataAttributes && itemProps.dataAttributes.length > 0 && (
                    <>
                      <h4 class="mb-2 font-medium">Data Attributes</h4>
                      <table class="w-full border-collapse text-sm">
                        <thead>
                          <tr class="border-b border-gray-200 dark:border-gray-800">
                            <th class="py-4 px-4 text-left font-medium">Attribute</th>
                            <th class="py-4 px-4 text-left font-medium">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {itemProps.dataAttributes.map((attr: DataAttribute) => (
                            <tr
                              key={attr.name}
                              class="border-b border-gray-200 dark:border-gray-800"
                            >
                              <td class="py-4 px-4 font-mono text-sm">{attr.name}</td>
                              <td class="py-4 px-4">{attr.comment}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  )}
                </div>
              );
            })}
        </Fragment>
      ))}
    </div>
  );
});
