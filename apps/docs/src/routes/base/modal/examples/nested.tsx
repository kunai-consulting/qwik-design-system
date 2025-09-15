import { Modal } from "@kunai-consulting/qwik";
import { component$, useSignal } from "@qwik.dev/core";

export default component$(() => {
  const nestedOpen = useSignal(false);

  return (
    <Modal.Root data-testid="root">
      <Modal.Trigger data-testid="trigger">Open Modal</Modal.Trigger>
      <Modal.Content data-testid="content">
        <Modal.Title data-testid="title">First Modal</Modal.Title>
        <p>This is the first modal.</p>

        {/* Nested Modal */}
        <Modal.Root bind:open={nestedOpen}>
          <Modal.Trigger>Nested Modal Trigger</Modal.Trigger>
          <Modal.Content>
            <Modal.Title>Nested Modal Title</Modal.Title>
            <p>Nested Modal Content</p>
            <Modal.Close>Close Nested</Modal.Close>
          </Modal.Content>
        </Modal.Root>

        <Modal.Close data-testid="close">Close</Modal.Close>
      </Modal.Content>
    </Modal.Root>
  );
});
