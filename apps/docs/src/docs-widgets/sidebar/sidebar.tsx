import { component$ } from "@builder.io/qwik";
import type { TreeItemType } from "~/routes/base/tree/examples/hero";
import { LuChevronRight } from "@qwikest/icons/lucide";
import { Tree } from "@kunai-consulting/qwik";
import { Link } from "@builder.io/qwik-city";

export const Sidebar = component$(() => {
  const treeData: TreeItemType[] = [
    {
      id: "/base",
      label: "Base",
      children: [
        {
          id: "/base/input",
          label: "Input Components",
          children: [
            { id: "/base/checkbox", label: "Checkbox" },
            { id: "/base/checklist", label: "Checklist" },
            { id: "/base/otp", label: "OTP" },
            { id: "/base/radio-group", label: "Radio Group" },
            { id: "/base/slider", label: "Slider" }
          ]
        },
        {
          id: "/base/layout",
          label: "Layout Components",
          children: [
            { id: "/base/scroll-area", label: "Scroll Area" },
            { id: "/base/resizable", label: "Resizable" },
            { id: "/base/tree", label: "Tree" }
          ]
        },
        {
          id: "/base/selection",
          label: "Selection Components",
          children: [
            { id: "/base/calendar", label: "Calendar" },
            { id: "/base/pagination", label: "Pagination" }
          ]
        },
        {
          id: "/base/media",
          label: "Media Components",
          children: [
            { id: "/base/file-upload", label: "File Upload" },
            { id: "/base/qr-code", label: "QR Code" }
          ]
        }
      ]
    },
    {
      id: "/contributing",
      label: "Contributing",
      children: [
        {
          id: "/contributing/getting-started",
          label: "Getting Started",
          children: [
            { id: "/contributing/intro", label: "Intro" },
            { id: "/contributing/growth-mindset", label: "Growth Mindset" }
          ]
        },
        {
          id: "/contributing/development",
          label: "Development",
          children: [
            { id: "/contributing/new-component", label: "New Components" },
            {
              id: "/contributing/component-structure",
              label: "Component Structure"
            },
            { id: "/contributing/composition", label: "Composition" },
            { id: "/contributing/research", label: "Research" }
          ]
        },
        {
          id: "/contributing/technical",
          label: "Technical",
          children: [
            { id: "/contributing/state", label: "State" },
            { id: "/contributing/indexing", label: "Indexing" },
            { id: "/contributing/events", label: "Events" },
            { id: "/contributing/testing", label: "Testing" },
            { id: "/contributing/styling", label: "Styling" }
          ]
        },
        {
          id: "/contributing/guidelines",
          label: "Guidelines",
          children: [
            { id: "/contributing/philosophy", label: "Philosophy" },
            { id: "/contributing/accessibility", label: "Accessibility" },
            { id: "/contributing/conventions", label: "Conventions" },
            { id: "/contributing/forms", label: "Forms" },
            { id: "/contributing/tradeoffs", label: "Tradeoffs" }
          ]
        }
      ]
    },
    {
      id: "/qwik-core",
      label: "Qwik core (future)",
      children: [{ id: "/qwik-core/tasks", label: "Tasks" }]
    }
  ];

  return (
    <nav class="flex-col gap-4 sticky top-20 hidden md:flex h-[calc(100vh-160px)]">
      <Tree.Root class="tree-root">
        {treeData.map((item) => renderTreeItem(item))}
      </Tree.Root>
    </nav>
  );
});

function renderTreeItem(item: TreeItemType) {
  if (item.children && item.children.length > 0) {
    return (
      <Tree.Item class="group" key={item.id}>
        <div class="flex items-center gap-2 hover:bg-neutral-accent transition-colors bg-inherit duration-200 justify-between">
          <Tree.ItemLabel>{item.label}</Tree.ItemLabel>
          <Tree.ItemTrigger class="group p-2 hover:bg-neutral-primary">
            <LuChevronRight class="group-data-open:rotate-90 transition-transform duration-200" />
          </Tree.ItemTrigger>
        </div>
        <Tree.ItemContent class="pl-4 transition-all overflow-hidden">
          {item.children.map((child) => renderTreeItem(child))}
        </Tree.ItemContent>
      </Tree.Item>
    );
  }

  return (
    <Tree.Item
      class="hover:bg-neutral-accent transition-colors bg-inherit duration-200"
      key={item.id}
      asChild
    >
      <Link href={item.id} class="w-full block">
        <Tree.ItemLabel>{item.label}</Tree.ItemLabel>
      </Link>
    </Tree.Item>
  );
}
