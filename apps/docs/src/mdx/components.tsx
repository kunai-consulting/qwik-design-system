import type { Component, PropsOf } from "@builder.io/qwik";
import { Slot, component$ } from "@builder.io/qwik";

import { Features } from "~/docs-widgets/features/features";
import { cn } from "~/utils/cn";
import { AnatomyTable } from "../docs-widgets/anatomy-table/anatomy-table";
import { APITable } from "../docs-widgets/api-table/api-table";
import { MainHeading, SubHeading } from "../docs-widgets/toc/toc";
import { Showcase } from "./showcase";
import { Image } from "../docs-widgets/image/image";
export const components: Record<string, Component> = {
  p: component$<PropsOf<"p">>(({ ...props }) => {
    return (
      <p
        {...props}
        class={cn("leading-7 [&:not(:first-child)]:mt-6 text-[#b8c1cc]", props.class)}
      >
        <Slot />
      </p>
    );
  }),
  h1: component$<PropsOf<"h1">>(({ ...props }) => {
    return (
      <h1
        {...props}
        class={cn(
          "mt-2 scroll-m-20 text-4xl font-bold tracking-tight text-cool-700",
          props.class
        )}
      >
        <Slot />
      </h1>
    );
  }),
  h2: MainHeading,
  h3: SubHeading,
  h4: component$<PropsOf<"h4">>(({ ...props }) => {
    return (
      <h4
        {...props}
        class={cn(
          "mt-8 scroll-m-20 text-xl font-semibold tracking-tight text-cool-700",
          props.class
        )}
      >
        <Slot />
      </h4>
    );
  }),
  h5: component$<PropsOf<"h5">>(({ ...props }) => {
    return (
      <h5
        {...props}
        class={cn(
          "mt-8 scroll-m-20 text-lg font-semibold tracking-tight text-cool-700",
          props.class
        )}
      >
        <Slot />
      </h5>
    );
  }),
  a: component$<PropsOf<"a">>(({ ...props }) => {
    return (
      <a
        {...props}
        class={cn(
          "font-medium text-cool-700 underline underline-offset-4 text-white hover:text-qwik-blue-300 transition-colors",
          props.class
        )}
        target="_blank"
        rel="noreferrer"
      >
        <Slot />
      </a>
    );
  }),
  ul: component$<PropsOf<"ul">>(({ ...props }) => {
    return (
      <ul {...props} class={cn("my-6 ml-6 list-disc text-cool-700", props.class)}>
        <Slot />
      </ul>
    );
  }),
  ol: component$<PropsOf<"ol">>(({ ...props }) => {
    return (
      <ol {...props} class={cn("my-6 ml-6 list-decimal text-cool-700", props.class)}>
        <Slot />
      </ol>
    );
  }),
  li: component$<PropsOf<"li">>(({ ...props }) => {
    return (
      <li {...props} class={cn("mt-2 text-[#b8c1cc]", props.class)}>
        <Slot />
      </li>
    );
  }),
  blockquote: component$<PropsOf<"blockquote">>(({ ...props }) => {
    return (
      <blockquote
        {...props}
        class={cn(
          "mt-6 border-l-2 border-[#7a8799] bg-[#0e0f12] p-2 pl-6 italic [&>*]:text-[#7a8799]",
          props.class
        )}
      >
        <Slot />
      </blockquote>
    );
  }),
  hr: component$<PropsOf<"hr">>(({ ...props }) => {
    return <hr {...props} class={cn("my-6 border-cool-200 md:my-8", props.class)} />;
  }),
  img: component$<PropsOf<"img">>(({ alt, ...props }) => {
    return <img {...props} alt={alt} class={cn("border border-cool-200", props.class)} />;
  }),
  pre: component$<PropsOf<"pre">>(({ ...props }) => {
    return (
      <pre
        {...props}
        class={cn(
          "border border-neutral-primary overflow-clip text-sm bg-[#0e0f12] mt-6",
          props.class
        )}
        data-pagefind-ignore
      >
        <Slot />
      </pre>
    );
  }),
  code: component$<PropsOf<"code">>(({ ...props }) => {
    return (
      <code
        {...props}
        class={cn("max-h-[31.25rem] max-w-full overflow-auto", props.class)}
      >
        <Slot />
      </code>
    );
  }),
  table: component$<PropsOf<"table">>(({ ...props }) => {
    return (
      <table
        {...props}
        class={cn("mt-6 w-full border-collapse border border-cool-200", props.class)}
      >
        <Slot />
      </table>
    );
  }),
  th: component$<PropsOf<"th">>(({ ...props }) => {
    return (
      <th
        {...props}
        class={cn(
          "border border-cool-200 px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
          props.class
        )}
      >
        <Slot />
      </th>
    );
  }),
  td: component$<PropsOf<"td">>(({ ...props }) => {
    return (
      <td
        {...props}
        class={cn(
          "border border-cool-200 px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
          props.class
        )}
      >
        <Slot />
      </td>
    );
  }),
  tr: component$<PropsOf<"tr">>(({ ...props }) => {
    return (
      <tr
        {...props}
        class={cn("m-0 border-t border-cool-300 p-0 even:bg-cool-100", props.class)}
      />
    );
  }),
  em: component$<PropsOf<"em">>(({ ...props }) => {
    return (
      <em {...props} class={cn("font-medium text-white", props.class)}>
        <Slot />
      </em>
    );
  }),
  strong: component$<PropsOf<"strong">>(({ ...props }) => {
    return (
      <strong {...props} class={cn("text-white", props.class)}>
        <Slot />
      </strong>
    );
  }),
  Showcase,
  APITable,
  AnatomyTable,
  Features,
  Image
};
