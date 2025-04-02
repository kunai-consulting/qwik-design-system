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

export const getUnstyledAppContent = (componentCode: string) => {
  if (!componentCode) return "";

  let cleanedCode = componentCode.replace(/useStyles\$\(.*?\);/g, "");

  cleanedCode = cleanedCode.replace(/\sclass=["'].*?["']/g, "");

  cleanedCode = cleanedCode.replace(/import.*\.css.*?;/g, "");

  return cleanedCode;
};
