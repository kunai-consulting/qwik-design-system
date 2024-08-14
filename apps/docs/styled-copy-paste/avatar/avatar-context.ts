import { type ContextId, createContextId } from "@builder.io/qwik";
import type { VariantProps } from "class-variance-authority";
import type { avatarSizeVariants } from "./avatar";

export const avatarContextId: ContextId<AvatarContext> =
  createContextId("general-avatar");

export type AvatarContext = {
  status?: "online" | "offline" | "dnd";
  size?: VariantProps<typeof avatarSizeVariants>["size"];
};
