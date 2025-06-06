import { $, type PropsOf, component$ } from "@builder.io/qwik";
import { useSignal } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { useNavigate } from "@builder.io/qwik-city";
import { Tree } from "@kunai-consulting/qwik";
import { LuChevronRight } from "@qwikest/icons/lucide";

type TreeItemType = {
  id: string;
  label: string;
  children?: TreeItemType[];
};

export const Sidebar = component$((props: PropsOf<"nav">) => {
  const { renderTreeItem } = useSidebar();

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
            { id: "/base/date-input", label: "Date Input" },
            { id: "/base/dropdown", label: "Dropdown" },
            { id: "/base/otp", label: "OTP" },
            { id: "/base/radio-group", label: "Radio Group" },
            { id: "/base/slider", label: "Slider" },
            { id: "/base/switch", label: "Switch" }
          ]
        },
        {
          id: "/base/layout",
          label: "Layout Components",
          children: [
            { id: "/base/resizable", label: "Resizable" },
            { id: "/base/scroll-area", label: "Scroll Area" },
            { id: "/base/tree", label: "Tree" },
            { id: "/base/popover", label: "Popover" }
          ]
        },
        {
          id: "/base/selection",
          label: "Selection Components",
          children: [
            { id: "/base/calendar", label: "Calendar" },
            { id: "/base/pagination", label: "Pagination" },
            { id: "/base/toggle", label: "Toggle" }
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
            { id: "/contributing/growth-mindset", label: "Growth Mindset" },
            { id: "/contributing/terminology", label: "Terminology" }
          ]
        },
        {
          id: "/contributing/development",
          label: "Development",
          children: [
            { id: "/contributing/new-component", label: "New Component" },
            { id: "/contributing/component-structure", label: "Component Structure" },
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
            { id: "/contributing/styling", label: "Styling" },
            { id: "/contributing/monorepo", label: "Monorepo" }
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
            { id: "/contributing/icons", label: "Icons" },
            { id: "/contributing/tradeoffs", label: "Tradeoffs" }
          ]
        }
      ]
    },
    {
      id: "/qwik-core",
      label: "Qwik Core",
      children: [
        { id: "/qwik-core/tasks", label: "Tasks" },
        { id: "/qwik-core/use-constant", label: "Use Constant" }
      ]
    }
  ];

  return (
    // Adjusted classes for consistency with example structure
    <nav
      class="sticky top-20 hidden lg:flex flex-col h-[calc(100vh-160px)] overflow-y-auto"
      {...props}
    >
      <Tree.Root class="flex flex-col p-2">
        {treeData.map((node) => renderTreeItem(node))}
      </Tree.Root>
    </nav>
  );
});

export const TreeBranch = component$<{
  node: TreeItemType;
}>(({ node }) => {
  const { renderTreeItem } = useSidebar();
  const isOpen = useSignal(false);

  const labelStyles =
    "text-sm uppercase w-full select-none h-full flex items-center leading-[150%] tracking-[1.92px] font-sans-semi-bold";

  return (
    <Tree.Item
      class="group focus-visible:outline-qwik-blue-500 focus-visible:-outline-offset-2"
      key={node.id}
      bind:open={isOpen}
    >
      <div class="flex items-start gap-2 hover:bg-neutral-accent transition-colors bg-inherit duration-200 justify-between pl-2">
        <Tree.ItemTrigger class="group w-full cursor-pointer flex items-center justify-between">
          <Tree.ItemLabel class={labelStyles}>{node.label}</Tree.ItemLabel>
          <span class="p-2 hover:bg-neutral-primary transition-colors duration-200">
            <LuChevronRight
              data-open={isOpen.value}
              class="data-open:rotate-90 transition-transform duration-200"
            />
          </span>
        </Tree.ItemTrigger>
      </div>
      <Tree.ItemContent class="pl-4 transition-all overflow-hidden">
        {node.children?.map((child: TreeItemType) => renderTreeItem(child))}
      </Tree.ItemContent>
    </Tree.Item>
  );
});

export const TreeLeaves = component$<{
  node: TreeItemType;
}>(({ node }) => {
  const nav = useNavigate();

  const labelStyles = "capitalize w-full select-none h-full flex items-center";

  const linkStyles =
    "flex w-full items-center justify-between gap-2 px-2 group text-left transition-colors duration-200 py-2 hover:bg-neutral-accent focus-visible:outline-qwik-blue-500 focus-visible:-outline-offset-2";

  return (
    <Tree.Item
      class="transition-colors bg-inherit duration-200"
      key={node.id}
      onKeyDown$={(e: KeyboardEvent) => {
        if (e.key === "Enter") {
          nav(node.id);
        }
      }}
    >
      <Tree.ItemLabel class={labelStyles}>
        <Link tabIndex={-1} href={node.id} class={linkStyles}>
          {node.label}
        </Link>
      </Tree.ItemLabel>
    </Tree.Item>
  );
});

function useSidebar() {
  const renderTreeItem = $((node: TreeItemType) => {
    const hasChildren = node.children && node.children.length > 0;

    if (!hasChildren) {
      return <TreeLeaves node={node} />;
    }

    return <TreeBranch node={node} />;
  });

  return { renderTreeItem };
}
