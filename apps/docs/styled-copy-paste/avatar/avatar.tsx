import {
  type PropsOf,
  Slot,
  component$,
  useContext,
  useContextProvider,
} from "@builder.io/qwik";
import { cn } from "../../src/utils/cn";
import { avatarContextId, type AvatarContext } from "./avatar-context";
import { type VariantProps, cva } from "class-variance-authority";

type Size = "small" | "medium" | "large";

type RootProps = {
  status?: "online" | "offline" | "dnd";
} & PropsOf<"div"> &
  VariantProps<typeof avatarSizeVariants>;

/** Make sure to update the imageDimensions object for CLS shift. */
export const avatarSizeVariants = cva(["relative aspect-square"], {
  variants: {
    size: {
      small: "size-9", // 36px
      medium: "size-12", // 48px
      large: "size-[60px]", // 60px
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

const Root = component$(({ status, size = "medium", ...props }: RootProps) => {
  const context: AvatarContext = {
    status,
    size,
  };

  useContextProvider(avatarContextId, context);

  return (
    <div
      {...props}
      class={cn(
        avatarSizeVariants({ size }),
        "grid grid-cols-1 grid-rows-1",
        props.class
      )}
    >
      <Slot />
    </div>
  );
});

const Image = component$<PropsOf<"img">>(({ alt, width, height, ...props }) => {
  const context = useContext(avatarContextId);

  /** TODO: have one source of truth for these dimensions based on styles */
  const imageDimensions = {
    small: 36,
    medium: 48,
    large: 60,
  };

  return (
    <img
      {...props}
      alt={alt}
      width={width ? width : imageDimensions[context.size || "medium"]}
      height={height ? height : imageDimensions[context.size || "medium"]}
      class={cn(
        avatarSizeVariants({ size: context.size }),
        "rounded-full",
        props.class
      )}
    />
  );
});

const Fallback = component$<PropsOf<"div">>(({ ...props }) => {
  const context = useContext(avatarContextId);

  return (
    <div
      {...props}
      class={cn(
        avatarSizeVariants({ size: context.size }),
        "bg-slate-500 rounded-full flex items-center justify-center text-white -z-10",
        props.class
      )}
    >
      <Slot />
    </div>
  );
});

const Status = component$<PropsOf<"div">>(({ ...props }) => {
  const context = useContext(avatarContextId);

  return (
    <div
      {...props}
      class={cn(
        `absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
          context.status === "online" && "bg-green-400"
        } ${context.status === "offline" && "bg-gray-300"} ${
          context.status === "dnd" && "bg-red-500"
        }`,
        props.class
      )}
    />
  );
});

export const Avatar = {
  Root,
  Image,
  Fallback,
  Status,
};
