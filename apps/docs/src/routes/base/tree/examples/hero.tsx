import { component$ } from "@builder.io/qwik";
import { Tree } from "@kunai-consulting/qwik";

type TreeItemType = {
  id: string;
  label: string;
  children?: TreeItemType[];
};

export default component$(() => {
  const treeData: TreeItemType[] = [
    {
      id: "item-1",
      label: "Documents",
      children: [
        { id: "item-1-1", label: "Work" },
        { id: "item-1-2", label: "Personal" }
      ]
    },
    {
      id: "item-2",
      label: "Downloads"
    },
    {
      id: "item-3",
      label: "Desktop"
    }
  ];

  return <Tree.Root>{treeData.map((item) => renderTreeItem(item))}</Tree.Root>;
});

function renderTreeItem(item: TreeItemType) {
  if (item.children && item.children.length > 0) {
    return (
      <Tree.Group key={item.id}>
        <Tree.GroupTrigger asChild>
          <output>
            <Tree.GroupLabel>{item.label}</Tree.GroupLabel>
          </output>
        </Tree.GroupTrigger>
        <Tree.GroupContent>
          {item.children.map((child) => renderTreeItem(child))}
        </Tree.GroupContent>
      </Tree.Group>
    );
  }

  return (
    <Tree.Item key={item.id}>
      <Tree.ItemIndicator>🔹</Tree.ItemIndicator>
      <Tree.ItemLabel>{item.label}</Tree.ItemLabel>
    </Tree.Item>
  );
}
