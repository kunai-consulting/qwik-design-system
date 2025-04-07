import { component$ } from "@builder.io/qwik";
import { Link, useContent, useLocation } from "@builder.io/qwik-city";
import { TreeItemType } from "~/routes/base/tree/examples/hero";
import { LuChevronRight } from "@qwikest/icons/lucide";
import { Tree } from "@kunai-consulting/qwik";
import { useSignal } from "@builder.io/qwik";

export const Sidebar = component$(() => {
	const treeData: TreeItemType[] = [
		{
			id: "/base",
			label: "Base",
			children: [
				{ id: "/base/checkbox", label: "Checkbox" },
				{ id: "/base/checklist", label: "Checklist" },
				{ id: "/base/pagination", label: "Pagination" },
				{ id: "/base/otp", label: "OTP" },
				{ id: "/base/scroll-area", label: "Scroll Area" },
				{ id: "/base/radio-group", label: "Radio Group" },
				{ id: "/base/calendar", label: "Calendar" },
				{ id: "/base/file-upload", label: "File Upload" },
				{ id: "/base/qr-code", label: "QR Code" },
				{ id: "/base/resizable", label: "Resizable" },
				{ id: "/base/slider", label: "Slider" },
				{ id: "/base/tree", label: "Tree" },
			],
		},
		{
			id: "/contributing",
			label: "Contributing",
			children: [
				{ id: "/contributing/intro", label: "Intro" },
				{ id: "/contributing/growth-mindset", label: "Growth Mindset" },
				{ id: "/contributing/new-component", label: "New Components" },
				{
					id: "/contributing/component-structure",
					label: "Component Structure",
				},
				{ id: "/contributing/composition", label: "Composition" },
				{ id: "/contributing/research", label: "Research" },
				{ id: "/contributing/state", label: "State" },
				{ id: "/contributing/indexing", label: "Indexing" },
				{ id: "/contributing/events", label: "Events" },
				{ id: "/contributing/testing", label: "Testing" },
				{ id: "/contributing/styling", label: "Styling" },
				{ id: "/contributing/philosophy", label: "Philosophy" },
				{ id: "/contributing/accessibility", label: "Accessibility" },
				{ id: "/contributing/conventions", label: "Conventions" },
				{ id: "/contributing/forms", label: "Forms" },
				{ id: "/contributing/tradeoffs", label: "Tradeoffs" },
			],
		},
		{
			id: "/qwik-core",
			label: "Qwik core (future)",
			children: [{ id: "/qwik-core/tasks", label: "Tasks" }],
		},
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
			<Tree.Item key={item.id}>
				<div class="flex items-center gap-2">
					<Tree.ItemLabel>{item.label}</Tree.ItemLabel>
					<Tree.ItemTrigger class="tree-item-trigger">
						<LuChevronRight />
					</Tree.ItemTrigger>
				</div>
				<Tree.ItemContent class="tree-item-content">
					{item.children.map((child) => renderTreeItem(child))}
				</Tree.ItemContent>
			</Tree.Item>
		);
	}

	return (
		<Tree.Item key={item.id}>
			<Tree.ItemLabel>{item.label}</Tree.ItemLabel>
		</Tree.Item>
	);
}
