import * as fs from 'node:fs';
import { resolve } from 'node:path';
import type { ViteDevServer } from 'vite';
import ts from 'typescript';

export default function autoAPI() {
  return {
    name: 'watch-monorepo-changes',
    configureServer(server: ViteDevServer) {
      const watchPath = resolve(__dirname, '../../libs/components');
      server.watcher.on('change', (file: string) => {
        console.log('file changed', file);
        if (file.startsWith(watchPath)) {
          loopOnAllChildFiles(file);
        }
      });
    },
  };
}

// The object should have this general structure, arranged from parent to child
// componentName: [subComponent, subComponent, ...] & componentName comes from the directory
// subComponentName/type alias: [PublicType, PublicType, ...] & subComponent comes from the file under directory
// PublicType: [{ comment, prop, type }, { comment, prop, type }, ...] & PublicType comes from type inside file
// THE UPPER-MOST KEY IS ALWAYS USED AS A HEADING

export type ComponentParts = Record<string, SubComponents>;
type SubComponents = SubComponent[];
export type SubComponent = Record<string, PublicType[]>;
export type PublicType = Record<string, ParsedProps[]>;
type ParsedProps = {
  comment: string;
  prop: string;
  type: string;
};

/**
 * Note: For this code to run, you need to prefix the type with 'Public' (e.g., 'PublicMyType') in your TypeScript files
 *
 *  * e.g:
 *
 * ```tsx
 * type PublicModalRootProps = {
 *     //blablabla
 *     onShow$?: QRL<() => void>;
 *     //blablabla
 *     onClose$?: QRL<() => void>;
 *     //blablabla
 *     'bind:show'?: Signal<boolean>;
 *     //blablabla
 *     closeOnBackdropClick?: boolean;
 *     //blablabla
 *     alert?: boolean;
 * };
 * ```
 * This convention helps the parser identify and process the public types correctly.
 *
 * Now when you save the corresponding .mdx file, the API will be updated accordingly.
 *
 **/

function parseSingleComponentFromDir(
  path: string,
  ref: SubComponents,
): SubComponents | undefined {
  const componentNameMatch = /[\\/](\w[\w-]*)\.tsx$/.exec(path);
  if (!componentNameMatch) return;
  
  const componentName = componentNameMatch[1];
  const sourceFile = ts.createSourceFile(
    path,
    fs.readFileSync(path, 'utf-8'),
    ts.ScriptTarget.Latest,
    true
  );

  const parsed: PublicType[] = [];
  let currentType: PublicType | undefined;

  function visit(node: ts.Node) {
    // Look for type aliases that start with "Public"
    if (ts.isTypeAliasDeclaration(node) && 
        node.name.text.startsWith('Public')) {
      const typeName = node.name.text;
      currentType = { [typeName]: [] };
      parsed.push(currentType);
    }

    // Look for property signatures with comments
    if (ts.isPropertySignature(node) && currentType) {
      const typeName = Object.keys(currentType)[0];
      const comment = ts.getLeadingCommentRanges(
        sourceFile.text,
        node.pos
      )?.[0];
      
      if (comment) {
        const commentText = sourceFile.text
          .slice(comment.pos, comment.end)
          .replace(/[/*]/g, '')
          .trim();

        currentType[typeName].push({
          comment: commentText,
          prop: node.name.getText(),
          type: node.type?.getText() || ''
        });
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  const completeSubComponent: SubComponent = { [componentName]: parsed };
  ref.push(completeSubComponent);
  return ref;
}

function writeToDocs(fullPath: string, componentName: string, api: ComponentParts) {
  if (fullPath.includes("components")) {
    const relDocPath = `../docs/src/routes/${componentName}`;
    const fullDocPath = resolve(__dirname, relDocPath);
    const dirPath = resolve(fullDocPath, 'auto-api');

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
    const json = JSON.stringify(api, null, 2);
    const exportedApi = `export const api = ${json};`;

    try {
      fs.writeFileSync(resolve(dirPath, 'api.ts'), exportedApi);
      console.log('auto-api: successfully generated new JSON!');
    } catch (err) {
      console.error('Error writing API file:', err);
    }
  }
}

function loopOnAllChildFiles(filePath: string) {
  const childComponentMatch = /[\\/](\w[\w-]*)\.tsx$/.exec(filePath);
  if (!childComponentMatch) {
    return;
  }
  const parentDir = filePath.replace(childComponentMatch[0], '');
  const componentMatch = /[\\/](\w+)$/.exec(parentDir);
  if (!fs.existsSync(parentDir) || !componentMatch) {
    return;
  }
  const componentName = componentMatch[1];
  const allParts: SubComponents = [];
  const store: ComponentParts = { [componentName]: allParts };

  fs.readdirSync(parentDir).forEach((fileName) => {
    if (/\.tsx$/.test(fileName)) {
      const fullPath = resolve(parentDir, fileName);
      parseSingleComponentFromDir(fullPath, store[componentName]);
    }
  });

  writeToDocs(filePath, componentName, store);
}