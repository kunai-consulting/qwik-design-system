import { AkarIcons, Heroicons, Lucide, Tabler } from "@kunai-consulting/qwik";
import { component$ } from "@qwik.dev/core";

export default component$(() => {
  return (
    <div class="space-y-8 p-8">
      <div class="space-y-4">
        <h2 class="text-2xl font-bold">Lucide Icons</h2>
        <div class="flex gap-4 items-center">
          <Lucide.Check width={24} class="text-green-500" />
          <Lucide.X width={24} class="text-red-500" />
          <Lucide.Heart width={24} class="text-red-500 fill-current" />
          <Lucide.Star width={24} class="text-yellow-500" />
          <Lucide.Search width={24} class="text-gray-500" />
          {/* <Hugeicons.Abacus /> */}
          <AkarIcons.Air class="size-6 text-green-500" />
          <AkarIcons.Airpods />
        </div>
      </div>

      <div class="space-y-4">
        <h2 class="text-2xl font-bold">Heroicons</h2>
        <div class="flex gap-4 items-center">
          <Heroicons.CheckCircle width={24} class="text-green-500" />
          <Heroicons.XCircle width={24} class="text-red-500" />
          <Heroicons.Heart width={24} class="text-red-500 fill-current" />
          <Heroicons.Star width={24} class="text-yellow-500" />
        </div>
      </div>

      <div class="space-y-4">
        <h2 class="text-2xl font-bold">Tabler Icons</h2>
        <div class="flex gap-4 items-center">
          <Tabler.Check width={24} class="text-green-500" />
          <Tabler.X width={24} class="text-red-500" />
          <Tabler.Heart width={24} class="text-red-500 fill-current" />
          <Tabler.Star width={24} class="text-yellow-500" />
        </div>
      </div>

      <div class="space-y-4">
        <h2 class="text-2xl font-bold">Icon with Title (A11y)</h2>
        <div class="flex gap-4 items-center">
          <Lucide.Info width={24} class="text-blue-500" />
        </div>
      </div>

      <div class="space-y-4">
        <h2 class="text-2xl font-bold">Icon with Custom Children</h2>
        <div class="flex gap-4 items-center">
          <Lucide.User width={24} class="text-gray-500">
            <title>Profile</title>
            <desc>Click to view user profile</desc>
          </Lucide.User>
        </div>
      </div>
    </div>
  );
});
