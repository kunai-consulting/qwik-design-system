import {
  $,
  type ClassList,
  type PropsOf,
  component$,
  useSignal,
  useTask$,
} from "@builder.io/qwik";

import { cn } from "~/utils/cn";
import { codeToHtml } from "shiki";

export type HighlightProps = PropsOf<"div"> & {
  code: string;
  copyCodeClass?: ClassList;
  language?: "tsx" | "html" | "css";
  splitCommentStart?: string;
  splitCommentEnd?: string;
};

export const Highlight = component$(
  ({
    code,
    language = "tsx",
    splitCommentStart = "{/* start */}",
    splitCommentEnd = "{/* end */}",
    ...props
  }: HighlightProps) => {
    const codeSig = useSignal("");

    const addShiki$ = $(async () => {
      let modifiedCode: string = code;

      let partsOfCode = modifiedCode.split(splitCommentStart);

      if (partsOfCode.length > 1) {
        modifiedCode = partsOfCode[1];
      }

      partsOfCode = modifiedCode.split(splitCommentEnd);

      if (partsOfCode.length > 1) {
        modifiedCode = partsOfCode[0];
      }

      const str = await codeToHtml(modifiedCode, {
        lang: language,
        theme: "material-theme-palenight",
      });

      codeSig.value = str.toString();
    });

    useTask$(async () => {
      await addShiki$();
    });

    return (
      <div
        {...props}
        class={cn(
          "max-h-[31.25rem] max-w-full overflow-auto rounded-lg",
          props.class
        )}
      >
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
        <div dangerouslySetInnerHTML={codeSig.value} />
      </div>
    );
  }
);
