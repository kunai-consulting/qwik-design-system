import { component$ } from "@builder.io/qwik";
import { Dropdown } from "@kunai-consulting/qwik";

export default component$(() => {
  return (
    <div
      style={{
        padding: "50px",
        height: "300px",
        border: "1px dashed gray",
        position: "relative"
      }}
    >
      <Dropdown.Root>
        <Dropdown.Trigger>Open Menu</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item onSelect$={() => console.log("Selected Item 1")}>
            <Dropdown.ItemLabel>Item 1</Dropdown.ItemLabel>
          </Dropdown.Item>
          <Dropdown.Item onSelect$={() => console.log("Selected Item 2")}>
            <Dropdown.ItemLabel>Item 2</Dropdown.ItemLabel>
          </Dropdown.Item>
          <Dropdown.Item disabled>
            <Dropdown.ItemLabel>Item 3 (Disabled)</Dropdown.ItemLabel>
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>
    </div>
  );
});
