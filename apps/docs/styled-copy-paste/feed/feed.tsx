import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { cn } from "~/utils/cn";

type RootProps = PropsOf<"div">;

const Root = component$((props: RootProps) => {
  return (
    <div
      {...props}
      class={cn("p-4 text-white flex flex-col gap-4 selection:bg-slate-700", props.class)}
    >
      <Slot />
    </div>
  );
});

const Item = component$((props: PropsOf<"div">) => {
  return (
    <div {...props} class="flex items-center gap-4 px-4">
      <Slot />
    </div>
  );
});

const Dynamic = component$((props: PropsOf<"span">) => {
  return (
    <span {...props} class={cn("text-white", props.class)}>
      <Slot />
    </span>
  );
});

const Text = component$((props: PropsOf<"span">) => {
  return (
    <span {...props} class={cn("text-gray-500", props.class)}>
      <Slot />
    </span>
  );
});

export const Feed = {
  Root,
  Item,
  Dynamic,
  Text
};
