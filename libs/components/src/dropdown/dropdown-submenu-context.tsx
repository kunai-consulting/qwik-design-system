import { createContextId, type Signal } from "@builder.io/qwik";

type SubmenuIds = {
  triggerId: string;
  contentId: string;
  /** The level of the submenu */
  level: number;
  /** The root element of the submenu parent */
  parentRef: Signal<HTMLElement>;
  /** The id of the submenu parent */
  parentId: string;
};

/**
 * Context for managing submenu IDs
 * This context provides the trigger and content IDs to submenu components
 */
export const submenuContextId = createContextId<SubmenuIds>("dropdown-submenu");
