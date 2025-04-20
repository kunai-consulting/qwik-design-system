import { component$, useStyles$ } from "@builder.io/qwik";
import { Tree } from "@kunai-consulting/qwik";
import { LuChevronRight } from "@qwikest/icons/lucide";
import styles from "./tree.css?inline";

export type TreeItemType = {
  id: string;
  label: string;
  children?: TreeItemType[];
};

export default component$(() => {
  useStyles$(styles);
  const treeData: TreeItemType[] = [
    {
      id: "item-1",
      label: "Docs",
      children: [
        {
          id: "item-1-1",
          label: "Guides",
          children: [{ id: "item-1-1-1", label: "Getting Started" }]
        },
        {
          id: "item-1-2",
          label: "Components",
          children: [
            { id: "item-1-2-1", label: "Button" },
            { id: "item-1-2-2", label: "Input" }
          ]
        }
      ]
    },
    {
      id: "item-2",
      label: "API Reference"
    },
    {
      id: "item-3",
      label: "Examples"
    },
    {
      id: "item-4",
      label: "Community"
    }
  ];

  return (
    <Tree.Root class="tree-root">
      {treeData.map((item) => renderTreeItem(item))}
    </Tree.Root>
  );
});

function renderTreeItem(item: TreeItemType) {
  if (item.children && item.children.length > 0) {
    return (
      <Tree.Item key={item.id}>
        <Tree.ItemTrigger class="tree-item-trigger">
          <Tree.ItemLabel>{item.label}</Tree.ItemLabel>
          <LuChevronRight />
        </Tree.ItemTrigger>
        <Tree.ItemContent class="tree-item-content">
          {item.children.map((child) => renderTreeItem(child))}
        </Tree.ItemContent>
      </Tree.Item>
    );
  }

  return (
    <Tree.Item key={item.id}>
      <Tree.ItemIndicator>🔹</Tree.ItemIndicator>
      <Tree.ItemLabel>{item.label}</Tree.ItemLabel>
    </Tree.Item>
  );
}
