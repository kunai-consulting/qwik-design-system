import { component$, type PropsOf } from "@builder.io/qwik";
import { cn } from "~/utils/cn";

export const Image = component$<PropsOf<"img">>(({ alt, ...props }) => {
  return (
    <img
      alt={alt}
      loading="lazy"
      decoding="async"
      class={cn("rounded-md border border-neutral-primary mt-6", props.class)}
      {...props}
    />
  );
});
