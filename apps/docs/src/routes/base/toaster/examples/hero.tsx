import { component$, useSignal } from "@builder.io/qwik";
import { Toaster } from "@kunai-consulting/qwik";

interface ToastData {
  title?: string;
  description?: string;
  open: boolean;
}

export default component$(() => {
  const toastsSig = useSignal<ToastData[]>([]);

  return (
    <Toaster.Root bind:toasts={toastsSig}>
      <Toaster.Trigger class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Show Toast
      </Toaster.Trigger>
      {toastsSig.value.map((toast) => (
        <Toaster.Item key={`toast-item-${toast.title}`}>
          <Toaster.ItemTitle class="font-semibold text-black">
            {toast.title || "Notification"}
          </Toaster.ItemTitle>
          <Toaster.ItemDescription class="text-gray-600 mt-1">
            {toast.description || "This is a toast notification"}
          </Toaster.ItemDescription>
          <Toaster.ItemClose class="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
            ×
          </Toaster.ItemClose>
        </Toaster.Item>
      ))}
    </Toaster.Root>
  );
});
