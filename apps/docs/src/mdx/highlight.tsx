import {
  $,
  type ClassList,
  type PropsOf,
  component$,
  useSignal,
  useTask$
} from "@builder.io/qwik";

import { cn } from "~/utils/cn";

export type HighlightProps = PropsOf<"div"> & {
  code: string;
  copyCodeClass?: ClassList;
  splitCommentStart?: string;
  splitCommentEnd?: string;
};

export const Highlight = component$(
  ({
    code,
    splitCommentStart = "{/* start */}",
    splitCommentEnd = "{/* end */}",
    ...props
  }: HighlightProps) => {
    const codeSig = useSignal("");

    useTask$(async () => {
      let modifiedCode: string = code.toString();

      let partsOfCode = modifiedCode.split(splitCommentStart);

      if (partsOfCode.length > 1) {
        modifiedCode = partsOfCode[1];
      }

      partsOfCode = modifiedCode.split(splitCommentEnd);

      if (partsOfCode.length > 1) {
        modifiedCode = partsOfCode[0];
      }

      codeSig.value = modifiedCode.toString();
    });

    return (
      <div
        {...props}
        class={cn(
          "max-h-[31.25rem] max-w-full overflow-auto bg-neutral-background",
          props.class
        )}
        data-pagefind-ignore
      >
        <pre class="whitespace-pre-wrap">
          <code>{codeSig.value}</code>
        </pre>
      </div>
    );
  }
);
