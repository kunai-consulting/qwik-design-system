const packageJson = `{
  "name": "qds-example",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "serve dist"
  },
  "devDependencies": {
    "@kunai-consulting/qwik": "latest",
    "@qwikest/icons": "^0.0.13",
    "serve": "^14.2.4",
    "typescript": "~5.7.2",
    "vite": "^5.4"
  },
  "dependencies": {
    "@builder.io/qwik": "^1.12.1"
  }
}`;

const entryDevTsx = `import { render, type RenderOptions } from '@builder.io/qwik';
import Root from './root';

export default function(opts: RenderOptions) {
  return render(document, <Root />, opts);
}`;

const entrySsrTsx = `import {
  renderToStream,
  type RenderToStreamOptions,
} from '@builder.io/qwik/server';
import { manifest } from '@qwik-client-manifest';
import Root from './root';

export default function (opts: RenderToStreamOptions) {
  return renderToStream(<Root />, {
    manifest,
    ...opts,
  });
}`;

const rootTsx = `import { component$ } from '@builder.io/qwik';
import App from './app';

export default component$(() => {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Qwik Design System Example</title>
      </head>
      <body>
        <App />
      </body>
    </html>
  );
});`;

const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Qwik Design System Example</title>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>`;

const tsconfigAppJson = `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "jsxImportSource": "@builder.io/qwik",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}`;
const tsconfigNodeJson = `{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["vite.config.ts"]
}`;

const tsconfigJson = `{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}`;

const viteConfigTs = `import { defineConfig } from 'vite'
import { qwikVite } from '@builder.io/qwik/optimizer'

export default defineConfig({
  plugins: [
    qwikVite(),
  ],
});`;

const viteEnvTs = `/// <reference types="vite/client" />`;

export const STACKBLITZ_CONFIG = {
  packageJson,
  tsconfigJson,
  tsconfigAppJson,
  tsconfigNodeJson,
  indexHtml,
  viteConfigTs,
  viteEnvTs,
  entryDevTsx,
  entrySsrTsx,
  rootTsx
};

export const getHeadlessAppContent = (componentCode: string) => {
  if (!componentCode) return "";

  // 1. Remove CSS import statements
  let cleanedCode = componentCode.replace(
    /import\s+(?:.*\s+from\s+)?['"].*\.css(?:\?.*)?['"];?/g,
    ""
  );

  // 2. Remove useStyles$ from import statements
  cleanedCode = cleanedCode.replace(
    /import\s+{([^}]*)useStyles\$([^}]*)}([^;]*);/g,
    (match, before, after, from) => {
      // Handle leading/trailing commas and whitespace properly
      const imports = `${before}${after}`
        .replace(/,\s*,/g, ",")
        .replace(/^\s*,\s*/, "") // Remove leading comma
        .replace(/\s*,\s*$/, "") // Remove trailing comma
        .trim();

      if (!imports) {
        return ""; // Remove the entire import if nothing else is imported
      }
      return `import { ${imports} }${from};`;
    }
  );

  // 3. Remove useStyles$ hook calls
  cleanedCode = cleanedCode.replace(/useStyles\$\([^)]*\);/g, "");

  // 4. Remove class attributes from JSX elements
  cleanedCode = cleanedCode.replace(/\sclass=["'][^"']*["']/g, "");

  // 5. Remove all comments (single-line and multi-line)
  cleanedCode = cleanedCode.replace(/(?:^|\s)\/\/.*|\/\*[\s\S]*?\*\//g, "");

  // 6. Clean up multiple blank lines
  cleanedCode = cleanedCode.replace(/\n\s*\n\s*\n/g, "\n\n");

  return cleanedCode;
};
