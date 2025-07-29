import type { Plugin } from "vite";

export interface AsChildPluginOptions {
  // Include patterns for files to transform
  // Default: ['**/*.tsx', '**/*.ts']
  include?: string[];

  // Exclude patterns for files to skip
  // Default: ['**/*.test.*', '**/*.spec.*', '**/node_modules/**']
  exclude?: string[];

  // Auto-wrap components with withAsChild
  // Default: false
  autoWrap?: boolean;

  // Add runtime validation for asChild usage
  // Default: true
  addValidation?: boolean;

  // Generate type definitions for asChild props
  // Default: true
  generateTypes?: boolean;

  // Optimize asChild patterns during build
  // Default: true
  optimize?: boolean;

  // Enable debug logging
  // Default: false
  debug?: boolean;
}

export function asChildPlugin(options: AsChildPluginOptions = {}): Plugin {
  const {
    include = ["**/*.tsx", "**/*.ts"],
    exclude = ["**/*.test.*", "**/*.spec.*", "**/node_modules/**"],
    autoWrap = false,
    addValidation = true,
    generateTypes = true,
    optimize = true,
    debug = false
  } = options;

  let isProduction = false;

  return {
    name: "vite-as-child",

    configResolved(config) {
      // Store config for later use
      isProduction = config.command === "build";
      if (debug) {
        console.log(
          `[vite-as-child] Plugin configured for ${isProduction ? "production" : "development"}`
        );
      }
    },

    transform(code, id) {
      // Skip files that don't match include patterns or match exclude patterns
      if (!shouldTransform(id, include, exclude)) {
        return null;
      }

      if (debug) {
        console.log(`[vite-as-child] Transforming: ${id}`);
      }

      try {
        let transformedCode = code;
        let hasChanges = false;

        // Auto-wrap components with withAsChild HOC
        if (autoWrap) {
          const wrapped = wrapComponentsWithAsChild(code);
          if (wrapped !== code) {
            transformedCode = wrapped;
            hasChanges = true;
            if (debug) {
              console.log(`[vite-as-child] Auto-wrapped components in: ${id}`);
            }
          }
        }

        // Add runtime validation
        if (addValidation && !isProduction) {
          const validated = addAsChildValidation(transformedCode);
          if (validated !== transformedCode) {
            transformedCode = validated;
            hasChanges = true;
            if (debug) {
              console.log(`[vite-as-child] Added validation to: ${id}`);
            }
          }
        }

        // Optimize asChild patterns for production
        if (optimize && isProduction) {
          const optimized = optimizeAsChildPatterns(transformedCode);
          if (optimized !== transformedCode) {
            transformedCode = optimized;
            hasChanges = true;
            if (debug) {
              console.log(`[vite-as-child] Optimized patterns in: ${id}`);
            }
          }
        }

        return hasChanges
          ? {
              code: transformedCode,
              map: null // TODO: Generate source maps
            }
          : null;
      } catch (error) {
        // Log parsing errors but don't fail the build
        console.warn(`[vite-as-child] Failed to parse ${id}:`, error);
        return null;
      }
    },

    generateBundle() {
      if (generateTypes) {
        // Generate type definitions for asChild props
        this.emitFile({
          type: "asset",
          fileName: "as-child.d.ts",
          source: generateAsChildTypes()
        });
        if (debug) {
          console.log("[vite-as-child] Generated type definitions");
        }
      }
    }
  };
}

function shouldTransform(id: string, include: string[], exclude: string[]): boolean {
  // Simple pattern matching
  const matchesInclude = include.some((pattern) =>
    id.includes(pattern.replace("**/*", "").replace("*", ""))
  );

  const matchesExclude = exclude.some((pattern) =>
    id.includes(pattern.replace("**/*", "").replace("*", ""))
  );

  return matchesInclude && !matchesExclude;
}

function wrapComponentsWithAsChild(code: string): string {
  // This would analyze the AST to find component definitions and wrap them
  // For now, return the original code - full implementation would require
  // more sophisticated AST manipulation

  // Look for component exports and add withAsChild wrapper
  const componentRegex =
    /export\s+(?:const|function)\s+(\w+)\s*[:=]\s*(?:component\$|Component)/gi;

  return code.replace(componentRegex, (match, componentName) => {
    // Check if already wrapped
    if (code.includes(`withAsChild(${componentName}`)) {
      return match;
    }

    // Add import if not present
    const hasImport = code.includes("import { withAsChild }");
    const importStatement = hasImport
      ? ""
      : `import { withAsChild } from '../as-child/as-child';\n`;

    // Wrap the component
    return `${importStatement}${match};\n${componentName} = withAsChild(${componentName});`;
  });
}

function addAsChildValidation(code: string): string {
  // Add development-time validation for asChild usage
  const validationCode = `
    if (typeof window !== 'undefined' && import.meta.env.DEV) {
      // Add asChild validation logic here
      const validateAsChild = (props: Record<string, unknown>, children: unknown[]) => {
        if (props.asChild && (!children || children.length === 0)) {
          console.warn('AsChild requires at least one child element');
        }
        if (props.asChild && children && children.length > 1) {
          console.warn('AsChild can only have one direct child');
        }
      };
    }
  `;

  return code.includes("validateAsChild") ? code : code + validationCode;
}

function optimizeAsChildPatterns(code: string): string {
  // Optimize asChild patterns for production builds
  // This could include:
  // - Removing development-only validation
  // - Inlining simple asChild transformations
  // - Dead code elimination for unused asChild branches

  // Remove development validation
  const optimized = code.replace(
    /if\s*\(.*import\.meta\.env\.DEV.*\)\s*\{[\s\S]*?\}/g,
    ""
  );

  return optimized;
}

function generateAsChildTypes(): string {
  return `
// Auto-generated asChild type definitions
declare module '@kunai-consulting/qwik' {
  export interface AsChildProps {
    /**
     * When true, the component will render as its child element
     * instead of its own wrapper element.
     */
    asChild?: boolean;
  }
  
  export interface ComponentWithAsChild<T = {}> extends T, AsChildProps {}
  
  export function withAsChild<T>(
    component: Component<T>
  ): Component<T & AsChildProps>;
}

export {};
`;
}

// Export default for easier usage
export default asChildPlugin;
