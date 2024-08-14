import { component$ } from "@builder.io/qwik";
import { Avatar } from "@/styled/avatar";

export default component$(() => {
  return (
    <Avatar.Root status="online">
      <Avatar.Image src="https://github.com/mhevery.png" alt="@mhevery" />
      <Avatar.Fallback>JS</Avatar.Fallback>
      <Avatar.Status />
    </Avatar.Root>
  );
});
