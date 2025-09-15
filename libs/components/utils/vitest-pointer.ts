import type { Locator } from "@vitest/browser/context";

export type Target = Locator | HTMLElement | Document | Window;

export type Edge =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "left"
  | "right"
  | "top"
  | "bottom";

export type Position =
  | { client: { x: number; y: number } } // absolute client coords
  | { offset: { x: number; y: number } } // element-relative from top-left
  | { outside: { side?: Edge; distance?: number } }; // just outside rect

export interface PointerOpts {
  pointerId?: number; // default 1; use -1 to simulate keyboard-triggered pointer events
  pointerType?: "mouse" | "touch" | "pen"; // default "mouse"
}

type Pt = { x: number; y: number };

async function toEventTarget(target: Target): Promise<EventTarget> {
  const targetAsLocator = target as Locator;
  if (targetAsLocator && typeof targetAsLocator.element === "function") {
    const el = await targetAsLocator.element();
    if (!el) throw new Error("Locator resolved to null element");
    return el;
  }
  return target as unknown as EventTarget;
}

function isElement(t: EventTarget): t is Element {
  return !!(t as Element).getBoundingClientRect;
}

function rectOf(t: EventTarget) {
  if (isElement(t)) return (t as Element).getBoundingClientRect();
  return new DOMRect(0, 0, window.innerWidth, window.innerHeight);
}

function resolvePoint(t: EventTarget, pos: Position): Pt {
  if ("client" in pos) return pos.client;
  const r = rectOf(t);
  if ("offset" in pos) return { x: r.left + pos.offset.x, y: r.top + pos.offset.y };
  const side = pos.outside.side ?? "top-left";
  const distance = pos.outside.distance ?? 50;
  switch (side) {
    case "top-left":
      return { x: r.left - distance, y: r.top - distance };
    case "top-right":
      return { x: r.right + distance, y: r.top - distance };
    case "bottom-left":
      return { x: r.left - distance, y: r.bottom + distance };
    case "bottom-right":
      return { x: r.right + distance, y: r.bottom + distance };
    case "left":
      return { x: r.left - distance, y: r.top + r.height / 2 };
    case "right":
      return { x: r.right + distance, y: r.top + r.height / 2 };
    case "top":
      return { x: r.left + r.width / 2, y: r.top - distance };
    case "bottom":
      return { x: r.left + r.width / 2, y: r.bottom + distance };
  }
}

async function dispatchPointer(
  target: Target,
  type: "pointerdown" | "pointerup",
  pos: Position,
  opts?: PointerOpts
) {
  const et = await toEventTarget(target);
  const { x, y } = resolvePoint(et, pos);
  const ev = new PointerEvent(type, {
    bubbles: true,
    cancelable: true,
    isPrimary: true,
    pointerId: opts?.pointerId ?? 1,
    pointerType: opts?.pointerType ?? "mouse",
    clientX: Math.round(x),
    clientY: Math.round(y)
  });
  (et as Element | Document | Window).dispatchEvent(ev);
}

export const pointer = {
  async tapOutside(
    target: Target,
    opts?: { side?: Edge; distance?: number } & PointerOpts
  ) {
    const p: Position = { outside: { side: opts?.side, distance: opts?.distance } };
    await dispatchPointer(target, "pointerdown", p, opts);
    await dispatchPointer(target, "pointerup", p, opts);
  },

  async down(target: Target, pos: Position, opts?: PointerOpts) {
    await dispatchPointer(target, "pointerdown", pos, opts);
  },

  async up(target: Target, pos: Position, opts?: PointerOpts) {
    await dispatchPointer(target, "pointerup", pos, opts);
  },

  // Optional convenience; current modal tests only need down+up
  async drag(target: Target, from: Position, to: Position, opts?: PointerOpts) {
    await dispatchPointer(target, "pointerdown", from, opts);
    await dispatchPointer(target, "pointerup", to, opts);
  }
};
