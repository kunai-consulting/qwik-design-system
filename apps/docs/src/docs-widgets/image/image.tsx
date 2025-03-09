import { type PropsOf, component$ } from "@qwik.dev/core";
import { cn } from "~/utils/cn";

export const Image = component$<PropsOf<"img">>(({ alt, ...props }) => {
  return (
    <img
      loading="lazy"
      decoding="async"
      {...props}
      alt={alt || "Image"}
      class={cn("rounded-md border border-neutral-primary mt-6", props.class)}
    />
  );
});
