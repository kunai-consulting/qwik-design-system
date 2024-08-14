import {
  type ContextId,
  type PropsOf,
  Slot,
  component$,
  createContextId,
  useContext,
  useContextProvider,
} from "@builder.io/qwik";
import { cn } from "../../src/utils/cn";
import { type VariantProps, cva } from "class-variance-authority";

type RootProps = {
  status?: "online" | "offline" | "dnd";
} & PropsOf<"div"> &
  VariantProps<typeof avatarSizeVariants>;

export const avatarContextId: ContextId<AvatarContext> =
  createContextId("general-avatar");

export type AvatarContext = {
  status?: "online" | "offline" | "dnd";
  size?: VariantProps<typeof avatarSizeVariants>["size"];
};

/** Make sure to update the imageDimensions object for CLS shift. */
const avatarSizeVariants = cva(["relative aspect-square"], {
  variants: {
    size: {
      small: "size-9 min-w-9", // 36px
      medium: "size-12 min-w-12", // 48px
      large: "size-[60px] min-w-[60px]", // 60px
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
        "grid grid-cols-1 grid-rows-1 isolate",
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
        `absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-950 ${
          context.status === "online" && "bg-green-400"
        } ${context.status === "offline" && "bg-gray-500"} ${
          context.status === "dnd" && "bg-red-400"
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
  Content: Fallback,
  Status,
  avatarSizeVariants,
};
