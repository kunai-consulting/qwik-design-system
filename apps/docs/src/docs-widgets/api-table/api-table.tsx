import { Fragment, component$, useContext, useTask$ } from "@qwik.dev/core";
import { Popover } from "@kunai-consulting/qwik";
import { rootContextId } from "~/routes/layout";
import type { AnatomyItem, ComponentEntry, ParsedProps } from "../../../auto-api/types";
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
      {items.map((item) => {
        const componentData = Object.entries(item)[0];
        const [itemName] = componentData;

        return (
          <div key={itemName}>
            <>
              <Popover.Trigger>Details</Popover.Trigger>
              <Popover.Panel>ddd</Popover.Panel>
            </>
          </div>
        );
      })}
    </div>
  );
});

export const DummyComp = component$(() => {
  return <div>hey</div>;
});
