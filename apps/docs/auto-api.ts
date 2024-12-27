import * as fs from 'node:fs';
import { resolve } from 'node:path';
import ts from 'typescript';

export default function autoAPI() {
  return {
    name: 'watch-monorepo-changes',
    watchChange(file: string) {
        console.log('file changed', file);
        const watchPath = resolve(__dirname, '../../libs/components');
        if (file.startsWith(watchPath)) {
          console.log('looping on all child files', file);
          loopOnAllChildFiles(file);
        }
    },
  };
}

// The object should have this general structure, arranged from parent to child
// componentName: [subComponent, subComponent, ...] & componentName comes from the directory
// subComponentName/type alias: [PublicType, PublicType, ...] & subComponent comes from the file under directory
// PublicType: [{ comment, prop, type }, { comment, prop, type }, ...] & PublicType comes from type inside file
// THE UPPER-MOST KEY IS ALWAYS USED AS A HEADING

export type ComponentParts = {
  [key: string]: SubComponents | ComponentAnatomy;
  anatomy: ComponentAnatomy;
};
type SubComponents = SubComponent[];
export type SubComponent = Record<string, PublicType[]>;
export type PublicType = Record<string, ParsedProps[]>;
type ParsedProps = {
  comment: string;
  prop: string;
  type: string;
  dataAttributes?: Array<{
    name: string;
    type: string;
  }>;
};

// Add new type for component anatomy
type ComponentAnatomy = {
  [componentName: string]: string[];
};

function parseComponentAnatomy(indexPath: string): string[] {
  const sourceFile = ts.createSourceFile(
    indexPath,
    fs.readFileSync(indexPath, 'utf-8'),
    ts.ScriptTarget.Latest,
    true
  );
  
  const subComponents: string[] = [];
  
  function visit(node: ts.Node) {
    if (ts.isExportDeclaration(node)) {
      const clause = node.exportClause;
      if (clause && ts.isNamedExports(clause)) {
        for (const element of clause.elements) {
          if (element.propertyName) {
            subComponents.push(element.name.text);
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  }
  
  visit(sourceFile);
  return subComponents;
}

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

    // Look for JSX elements to collect data attributes
    if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
      const attributes = ts.isJsxElement(node) 
        ? node.openingElement.attributes.properties 
        : node.attributes.properties;

      const dataAttrs = attributes
        .filter(attr => 
          ts.isJsxAttribute(attr) && 
          ts.isIdentifier(attr.name) &&
          attr.name.text.startsWith('data-') &&
          !attr.name.text.startsWith('data-qds-')
        )
        .map(attr => {
          const jsxAttr = attr as ts.JsxAttribute;
          const attrName = jsxAttr.name.getText();
          // If there's a conditional expression or undefined in the initializer, 
          // it's likely string | undefined, otherwise just string
          const attrType = jsxAttr.initializer && 
            ts.isJsxExpression(jsxAttr.initializer) && 
            jsxAttr.initializer.expression &&
            (ts.isConditionalExpression(jsxAttr.initializer.expression) || 
             jsxAttr.initializer.expression.getText().includes('undefined'))
            ? 'string | undefined'
            : 'string';

          return {
            name: attrName,
            type: attrType
          };
        });

      if (dataAttrs.length > 0 && currentType) {
        const typeName = Object.keys(currentType)[0];
        const lastProp = currentType[typeName][currentType[typeName].length - 1];
        if (lastProp) {
          lastProp.dataAttributes = dataAttrs;
        }
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
  if (!componentMatch) return;
  if (!fs.existsSync(parentDir)) return;
  const componentName = componentMatch[1];
  
  // Add anatomy parsing
  const indexPath = resolve(parentDir, 'index.ts');
  const anatomy: ComponentAnatomy = {};
  
  if (fs.existsSync(indexPath)) {
    anatomy[componentName] = parseComponentAnatomy(indexPath);
  }

  const allParts: SubComponents = [];
  const store: ComponentParts = { 
    [componentName]: allParts,
    anatomy: anatomy
  };

  for (const fileName of fs.readdirSync(parentDir)) {
    if (/\.tsx$/.test(fileName)) {
      const fullPath = resolve(parentDir, fileName);
      parseSingleComponentFromDir(fullPath, allParts);
    }
  }

  writeToDocs(filePath, componentName, store);
}