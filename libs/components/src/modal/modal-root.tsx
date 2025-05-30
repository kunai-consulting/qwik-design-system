import {
  type PropsOf,
  type Signal,
  Slot,
  component$,
  createContextId,
  useContextProvider,
  useSignal,
  useTask$
} from "@builder.io/qwik";
import { type BindableProps, useBindings } from "@kunai-consulting/qwik-utils";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";

export const modalContextId = createContextId<ModalContext>("qds-modal");

type ModalContext = {
  contentRef: Signal<HTMLDialogElement | undefined>;
  isOpenSig: Signal<boolean>;
};

type ModalRootProps = PropsOf<"div"> &
  BindableProps<{
    open: boolean;
  }>;

export const ModalRootBase = component$((props: ModalRootProps) => {
  const contentRef = useSignal<HTMLDialogElement | undefined>();

  const { openSig: isOpenSig } = useBindings(props, {
    open: false
  });

  useTask$(({ track }) => {
    track(() => isOpenSig.value);

    if (isOpenSig.value) {
      contentRef.value?.showModal();
    } else {
      contentRef.value?.close();
    }
  });

  const context: ModalContext = {
    contentRef,
    isOpenSig
  };

  useContextProvider(modalContextId, context);

  return (
    <Render fallback="div" {...props}>
      <Slot />
    </Render>
  );
});

export const ModalRoot = withAsChild(ModalRootBase);
