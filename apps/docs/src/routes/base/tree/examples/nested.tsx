import { component$ } from "@qwik.dev/core";
import { Tree } from "@kunai-consulting/qwik";

export default component$(() => {
  return (
    <Tree.Root>
      <Tree.Item>
        <Tree.ItemLabel>Item 1</Tree.ItemLabel>
      </Tree.Item>
      <Tree.Group>
        <Tree.Group>
          <Tree.Item>
            <Tree.ItemLabel>Item 2</Tree.ItemLabel>
          </Tree.Item>
        </Tree.Group>
      </Tree.Group>
    </Tree.Root>
  );
});
