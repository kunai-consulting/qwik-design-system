import { component$ } from "@builder.io/qwik";
import { Modal } from "@kunai-consulting/qwik";

export default component$(() => {
  return (
    <Modal.Root>
      <Modal.Trigger>Open Modal</Modal.Trigger>
      <Modal.Content>
        <Modal.Title>Modal Title</Modal.Title>
        <Modal.Description>Modal Description</Modal.Description>
        <Modal.Close>Close</Modal.Close>
      </Modal.Content>
    </Modal.Root>
  );
});
