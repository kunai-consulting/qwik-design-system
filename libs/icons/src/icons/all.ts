import type { Component, PropsOf } from '@builder.io/qwik';

// Define the base type for an icon component
type IconComponent = Component<PropsOf<"svg">>;

// Export all icon namespaces
export * as Bootstrap from './bs/bs.qwik.js';
export * as Flowbite from './fl/fl.qwik.js';
export * as FontAwesome from './fa/fa.qwik.js';
export * as HeroIcons from './hi/hi.qwik.js';
export * as Iconoir from './in/in.qwik.js';
export * as Ionicons from './io/io.qwik.js';
export * as Lucide from './lu/lu.qwik.js';
export * as MaterialIcons from './mat/mat.qwik.js';
export * as MonoIcons from './mo/mo.qwik.js';
export * as Octicons from './go/go.qwik.js';
export * as SimpleIcons from './si/si.qwik.js';
export * as TablerIcons from './tb/tb.qwik.js';

// Export types for each namespace
export type BootstrapIcons = Record<string, IconComponent>;
export type FlowbiteIcons = Record<string, IconComponent>;
export type FontAwesomeIcons = Record<string, IconComponent>;
export type HeroIconsIcons = Record<string, IconComponent>;
export type IconoirIcons = Record<string, IconComponent>;
export type IoniconsIcons = Record<string, IconComponent>;
export type LucideIcons = Record<string, IconComponent>;
export type MaterialIconsIcons = Record<string, IconComponent>;
export type MonoIconsIcons = Record<string, IconComponent>;
export type OcticonsIcons = Record<string, IconComponent>;
export type SimpleIconsIcons = Record<string, IconComponent>;
export type TablerIconsIcons = Record<string, IconComponent>;