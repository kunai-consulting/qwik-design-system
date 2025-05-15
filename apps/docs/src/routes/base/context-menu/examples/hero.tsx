import { component$ } from "@builder.io/qwik";
import { ContextMenu } from "@kunai-consulting/qwik";

export default component$(() => {
  return (
    <div class="p-10 flex justify-center">
      <ContextMenu.Root>
        <ContextMenu.Trigger class="border border-gray-400 p-6 rounded bg-white">
          <div class="text-blue-500">Right click here to open the context menu</div>
        </ContextMenu.Trigger>
        <ContextMenu.Content class="bg-white border border-gray-200 rounded-md shadow-lg p-1 min-w-[200px]">
          <ContextMenu.Item
            class="px-2 py-1.5 hover:bg-gray-100 rounded text-sm cursor-pointer text-gray-700 outline-none"
            onSelect$={() => console.log("Edit selected")}
          >
            <ContextMenu.ItemLabel>Edit</ContextMenu.ItemLabel>
          </ContextMenu.Item>
          <ContextMenu.Item
            class="px-2 py-1.5 hover:bg-gray-100 rounded text-sm cursor-pointer text-gray-700 outline-none"
            onSelect$={() => console.log("Duplicate selected")}
          >
            <ContextMenu.ItemLabel>Duplicate</ContextMenu.ItemLabel>
          </ContextMenu.Item>
          <ContextMenu.Item
            class="px-2 py-1.5 hover:bg-gray-100 rounded text-sm cursor-pointer text-gray-700 outline-none"
            onSelect$={() => console.log("Delete selected")}
          >
            <ContextMenu.ItemLabel>Delete</ContextMenu.ItemLabel>
          </ContextMenu.Item>
          <ContextMenu.Item
            class="px-2 py-1.5 hover:bg-gray-100 rounded text-sm cursor-pointer text-gray-700 outline-none"
            disabled
          >
            <ContextMenu.ItemLabel>Disabled Item</ContextMenu.ItemLabel>
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>
    </div>
  );
});
