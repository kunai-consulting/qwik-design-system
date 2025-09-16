import type { Locator } from "@vitest/browser/context";
import { nextTick } from "./tick";
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

function createDebugDot(x: number, y: number, type: "down" | "up") {
  if (typeof window === "undefined" || !import.meta.env?.DEV) return;

  const dot = document.createElement("div");
  dot.style.cssText = `
    position: fixed;
    left: ${x - 2}px;
    top: ${y - 2}px;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: ${type === "down" ? "#ff4444" : "#44ff44"};
    border: 1px solid white;
    z-index: 999999;
    pointer-events: none;
    box-shadow: 0 0 4px rgba(0,0,0,0.5);
  `;

  document.body.appendChild(dot);

  const label = document.createElement("div");
  label.textContent = `${Math.round(x)},${Math.round(y)}`;
  label.style.cssText = `
    position: fixed;
    left: ${x + 6}px;
    top: ${y - 6}px;
    background: rgba(0,0,0,0.8);
    color: white;
    padding: 2px 4px;
    border-radius: 3px;
    font-size: 10px;
    font-family: monospace;
    z-index: 999999;
    pointer-events: none;
  `;
  document.body.appendChild(label);

  setTimeout(() => {
    dot.remove();
    label.remove();
  }, 500);
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

  await nextTick();

  // Show debug dot if enabled
  if (pointer.showDebugDots) {
    createDebugDot(x, y, type === "pointerdown" ? "down" : "up");
  }

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
  // Visual debugging toggle (only works in development)
  showDebugDots: false,

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
