import type { Component, HTMLElementAttrs } from "@qwik.dev/core";
import { Slot, component$ } from "@qwik.dev/core";

import { Features } from "~/docs-widgets/features/features";
import { cn } from "~/utils/cn";
import { AnatomyTable } from "../docs-widgets/anatomy-table/anatomy-table";
import { APITable } from "../docs-widgets/api-table/api-table";
import { Image } from "../docs-widgets/image/image";
import { MainHeading, SubHeading } from "../docs-widgets/toc/toc";
import { Showcase } from "./showcase";
export const components: Record<string, Component> = {
  p: component$<HTMLElementAttrs<"p">>(({ ...props }) => {
    return (
      <p
        {...props}
        class={cn("leading-7 [&:not(:first-child)]:mt-6 text-[#b8c1cc]", props.class)}
      >
        <Slot />
      </p>
    );
  }),
  h1: component$<HTMLElementAttrs<"h1">>(({ ...props }) => {
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
  h4: component$<HTMLElementAttrs<"h4">>(({ ...props }) => {
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
  h5: component$<HTMLElementAttrs<"h5">>(({ ...props }) => {
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
  a: component$<HTMLElementAttrs<"a">>(({ ...props }) => {
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
  ul: component$<HTMLElementAttrs<"ul">>(({ ...props }) => {
    return (
      <ul {...props} class={cn("my-6 ml-6 list-disc text-cool-700", props.class)}>
        <Slot />
      </ul>
    );
  }),
  ol: component$<HTMLElementAttrs<"ol">>(({ ...props }) => {
    return (
      <ol {...props} class={cn("my-6 ml-6 list-decimal text-cool-700", props.class)}>
        <Slot />
      </ol>
    );
  }),
  li: component$<HTMLElementAttrs<"li">>(({ ...props }) => {
    return (
      <li {...props} class={cn("mt-2 text-[#b8c1cc]", props.class)}>
        <Slot />
      </li>
    );
  }),
  blockquote: component$<HTMLElementAttrs<"blockquote">>(({ ...props }) => {
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
  hr: component$<HTMLElementAttrs<"hr">>(({ ...props }) => {
    return <hr {...props} class={cn("my-6 border-cool-200 md:my-8", props.class)} />;
  }),
  img: component$<HTMLElementAttrs<"img">>(({ alt, ...props }) => {
    return <img {...props} alt={alt} class={cn("border border-cool-200", props.class)} />;
  }),
  pre: component$<HTMLElementAttrs<"pre">>(({ ...props }) => {
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
  code: component$<HTMLElementAttrs<"code">>(({ ...props }) => {
    return (
      <code
        {...props}
        class={cn(
          "max-h-[31.25rem] whitespace-pre-wrap box-decoration-clone",
          props.class
        )}
      >
        <Slot />
      </code>
    );
  }),
  table: component$<HTMLElementAttrs<"table">>(({ ...props }) => {
    return (
      <table
        {...props}
        class={cn("mt-6 w-full border-collapse border border-cool-200", props.class)}
      >
        <Slot />
      </table>
    );
  }),
  th: component$<HTMLElementAttrs<"th">>(({ ...props }) => {
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
  td: component$<HTMLElementAttrs<"td">>(({ ...props }) => {
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
  tr: component$<HTMLElementAttrs<"tr">>(({ ...props }) => {
    return (
      <tr
        {...props}
        class={cn("m-0 border-t border-cool-300 p-0 even:bg-cool-100", props.class)}
      />
    );
  }),
  em: component$<HTMLElementAttrs<"em">>(({ ...props }) => {
    return (
      <em {...props} class={cn("font-medium text-white", props.class)}>
        <Slot />
      </em>
    );
  }),
  strong: component$<HTMLElementAttrs<"strong">>(({ ...props }) => {
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
