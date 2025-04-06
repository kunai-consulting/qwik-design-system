import type { Component, PropsOf } from '@builder.io/qwik';

// Define the base type for an icon component
type IconComponent = Component<PropsOf<"svg">>;

// Export all icon namespaces
export * as Bootstrap from './bs/bs';
export * as Flowbite from './fl/fl';
export * as FontAwesome from './fa/fa';
export * as HeroIcons from './hi/hi';
export * as Iconoir from './in/in';
export * as Ionicons from './io/io';
export * as Lucide from './lu/lu';
export * as MaterialIcons from './mat/mat';
export * as MonoIcons from './mo/mo';
export * as Octicons from './go/go';
export * as SimpleIcons from './si/si';
export * as TablerIcons from './tb/tb';

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