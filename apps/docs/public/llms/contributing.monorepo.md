# Contributing Monorepo

Accessible via: `/contributing/monorepo`

> TODO: Add description.

# Adding or Changing a Package

This monorepo uses [PNPM Workspaces](https://pnpm.io/workspaces), [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html), and [Vite](https://vitejs.dev/) to manage dependencies and build processes. When adding a new local package (e.g., in the `libs/` directory) or changing how packages depend on each other, several configuration files need updates.

## 1. Root tsconfig.json

The root `tsconfig.json` file defines base TypeScript settings and path aliases.

*   **`compilerOptions.paths`:** Maps package names (e.g., `@kunai-consulting/qwik`) to their source directories (`libs/components/src`). This helps TypeScript and potentially other tools understand the mapping.
    *   **Action:** When adding a new package (e.g., `libs/new-package`), add a new entry:
        ```json:tsconfig.json
        {
          "compilerOptions": {
            "baseUrl": ".",
            "paths": {
              "@kunai-consulting/qwik": ["libs/components/src"],
              "@kunai-consulting/qwik-icons": ["libs/icons/src"],
              "@kunai-consulting/qwik-utils": ["libs/utils/src"],
              "@kunai-consulting/new-package": ["libs/new-package/src"]
            }
          },
          "references": [
            { "path": "./libs/components" },
            { "path": "./libs/icons" },
            { "path": "./libs/utils" },
            { "path": "./libs/new-package" }
          ]
        }
        ```
*   **`references`:** Lists all local packages for the TypeScript build graph.
    *   **Action:** Add the new package:
        ```json:tsconfig.json
        {
          "compilerOptions": {
            "baseUrl": ".",
            "paths": {
              "@kunai-consulting/qwik": ["libs/components/src"],
              "@kunai-consulting/qwik-icons": ["libs/icons/src"],
              "@kunai-consulting/qwik-utils": ["libs/utils/src"],
              "@kunai-consulting/new-package": ["libs/new-package/src"]
            }
          },
          "references": [
            { "path": "./libs/components" },
            { "path": "./libs/icons" },
            { "path": "./libs/utils" },
            { "path": "./libs/new-package" }
          ]
        }
        ```

## 2. Package tsconfig.json

Each local package needs its own `tsconfig.json`.

*   **`extends`:** It should extend the root `tsconfig.json` (`"extends": "../../tsconfig.json"`) to inherit base settings.
*   **`compilerOptions.composite`:** Set to `true`. This enables TypeScript Project References.
*   **`compilerOptions.rootDir` and `include`:** Typically set to `"./"` and `["src"]` respectively, defining the source boundary for the package.
*   **`compilerOptions.outDir` / `declarationDir`:** Define where build outputs (JS and type definitions) should go (e.g., `lib/` and `lib-types/`). These are used when *publishing* or when other packages consume the *built* version.
*   **`references`:** This is crucial. If this package depends on *other local packages* within the monorepo, list them here using relative paths. This tells TypeScript about the internal dependency graph for build order and type checking.
    *   **Action:** Add references to any local packages the new package imports:
        ```json:libs/new-package/tsconfig.json
        {
          "extends": "../../tsconfig.json",
          "compilerOptions": {
            "composite": true
          },
          "include": ["src"],
          "references": [
            { "path": "../utils" }
          ]
        }
        ```

## 3. Package Dependencies (package.json)

In the `package.json` of any package that needs to *use* another local package:

*   **Action:** Use the `workspace:*` protocol in `dependencies` or `devDependencies` to link them via PNPM.
    ```json:apps/docs/package.json
    {
      "devDependencies": {
        "@kunai-consulting/qwik": "workspace:*",
        "@kunai-consulting/new-package": "workspace:*"
      }
    }
    ```
    PNPM will create symlinks in `node_modules`, allowing standard Node resolution to find the packages.

## 4. Vite Configuration (apps/docs/vite.config.ts)

The Vite configuration for the consuming application (`apps/docs`) is critical for development, **especially for Hot Module Replacement (HMR)**.

*   **`resolve.alias`:** This section **must** explicitly map the package names of your local `libs/*` dependencies directly to their `src` directories. While `vite-tsconfig-paths` might handle initial resolution using the root `tsconfig.json`, experience shows **this explicit aliasing in the Vite config is necessary for HMR to reliably detect and apply changes** made within the source files of linked local packages.
    *   **Action:** When adding a new package (e.g., `@kunai-consulting/new-package`), add a corresponding alias:
        ```typescript:apps/docs/vite.config.ts
        import { resolve } from "pathe";
        
        resolve: {
          alias: {
            "@kunai-consulting/qwik": resolve(__dirname, "../../libs/components/src"),
            "@kunai-consulting/qwik-utils": resolve(__dirname, "../../libs/utils/src"),
            "@kunai-consulting/qwik-icons": resolve(__dirname, "../../libs/icons/src"),
            "@kunai-consulting/new-package": resolve(__dirname, "../../libs/new-package/src"),
            "~": resolve(__dirname, "src")
          },
          dedupe: ["@qwik.dev/core", "@qwik.dev/router"]
        }
        ```
*   **`resolve.dedupe`:** Essential for ensuring only one instance of core libraries like `@qwik.dev/core` is loaded. Keep this updated as needed.
    ```typescript:apps/docs/vite.config.ts
        resolve: {
          dedupe: ["@qwik.dev/core", "@qwik.dev/router"]
        }
    ```
*   **`plugins: [tsconfigPaths()]`:** Keep this plugin, as it might still be useful for other path resolutions or build steps, even if explicit aliases are needed for HMR.
*   **`server.fs.allow`:** Ensure this allows access to the monorepo root (`['../..']`).

Maintaining the `resolve.alias` in `apps/docs/vite.config.ts` is the key step to ensure HMR works correctly when editing files within the `libs/*` packages during development.

## 5. Vitest Configuration (apps/docs/vitest.config.ts)
For testing with Vitest, we need to ensure proper path resolution for local packages:

*   **Action:** When adding a new package, update the `resolve.alias` in the Vitest configuration:
    ```typescript:vitest.config.ts
    import { resolve } from "pathe";
    
    export default defineConfig({
      resolve: {
        alias: {
          "@kunai-consulting/qwik-utils": resolve(__dirname, "libs/utils/src"),
          "@kunai-consulting/qwik-components": resolve(__dirname, "libs/components/src"),
          "@kunai-consulting/qwik-icons": resolve(__dirname, "libs/icons/src"),
          "@kunai-consulting/new-package": resolve(__dirname, "libs/new-package/src")
        }
      },
      test: {
        include: ["**/*.unit.ts", "**/*.smoke.ts"]
      }
    });
    ```

This ensures that tests can properly resolve imports from local packages in the monorepo.

## Further Learning

*   [PNPM Workspaces](https://pnpm.io/workspaces)
*   [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)
*   [Vite `resolve.alias`](https://vitejs.dev/config/shared-options.html#resolve-alias) (Crucial for HMR in this setup)
*   [Vite `resolve.dedupe`](https://vitejs.dev/config/shared-options.html#resolve-dedupe)
*   [Vite Server Options (`fs.allow`, `watch`)](https://vitejs.dev/config/server-options.html)
*   [vite-tsconfig-paths Plugin](https://github.com/aleclarson/vite-tsconfig-paths)
