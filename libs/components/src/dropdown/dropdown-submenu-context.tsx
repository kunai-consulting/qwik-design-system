import { createContextId } from "@builder.io/qwik";

type SubmenuIds = {
  triggerId: string;
  contentId: string;
  /** The level of the submenu */
  level: number;
};

/**
 * Context for managing submenu IDs
 * This context provides the trigger and content IDs to submenu components
 */
export const submenuContextId = createContextId<SubmenuIds>("dropdown-submenu");
