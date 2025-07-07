import { describe, it, expect } from "vitest";
import { useDummy } from "./dummy.auto";
import { mock } from "node:test";

// Minimal mock adapter for testing
function mockSignal(initial: unknown) {
  let _value = initial;
  return {
    get value() {
      return _value;
    },
    set value(v) {
      _value = v;
    }
  };
}
function mockComputed(fn: () => unknown) {
  return {
    get value() {
      return fn();
    }
  };
}
function mockTask(cb: any) {
  if (cb) cb({ track: () => {}, cleanup: () => {} });
  return;
}
function mockFn(fn: any) {
  return fn;
}

function createReactivityAdapter(framework: string, impls: any) {
  return {
    framework,
    ...impls
  };
}

function mockBindings(signals) {
  return signals.map((sig) => sig.value);
}

describe("useDummy fullNameFn", () => {
  const adapter = createReactivityAdapter("test", {
    signal: mockSignal,
    computed: mockComputed,
    task: mockTask,
    fn: mockFn,
    bindings: (signals) => signals.map((sig) => sig.value)
  });

  it("should return the correct full name when signals change", () => {
    // Setup
    const { firstNameSig, lastNameSig } = useDummy(null, adapter);

    // Recreate fullNameFn as in useDummy
    const fullNameFn = adapter.fn(() => {
      return `${firstNameSig.value} ${lastNameSig.value}`;
    });

    // Initial value
    expect(fullNameFn()).toBe("Jay Doe");

    // Change first name
    firstNameSig.value = "Jane";
    expect(fullNameFn()).toBe("Jane Doe");

    // Change last name
    lastNameSig.value = "Smith";
    expect(fullNameFn()).toBe("Jane Smith");
  });

  it("should return the correct age when ageSig changes", () => {
    const { ageSig } = useDummy(null, adapter);

    // Initial value
    expect(ageSig.value).toBe(25);

    // Change age
    ageSig.value = 42;
    expect(ageSig.value).toBe(42);
  });
});

describe("adapter.bindings", () => {
  const adapter = createReactivityAdapter("test", {
    signal: mockSignal,
    computed: mockComputed,
    task: mockTask,
    fn: mockFn,
    bindings: mockBindings
  });

  it("returns the current values of signals", () => {
    const sig1 = adapter.signal("Jay");
    const sig2 = adapter.signal(42);

    let values = adapter.bindings([sig1, sig2]);
    expect(values).toEqual(["Jay", 42]);

    sig1.value = "John";
    sig2.value = 100;
    values = adapter.bindings([sig1, sig2]);
    expect(values).toEqual(["John", 100]);
  });
});
