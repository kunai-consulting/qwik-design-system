import { component$, type PropsOf } from "@builder.io/qwik";
import { cn } from "~/utils/cn";

export const Image = component$<PropsOf<"img">>(({ alt, ...props }) => {
  return (
    <img
      {...props}
      alt={alt}
      class={cn("rounded-md border border-neutral-600 mt-6", props.class)}
    />
  );
});
