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
  [key: string]: SubComponents | AnatomyItem[];
  anatomy: AnatomyItem[];
};

type SubComponents = SubComponent[];

export type SubComponent = {
  [key: string]: PublicType[] | Array<{ name: string; type: string; }>;
} & {
  dataAttributes?: Array<{ 
    name: string; 
    type: string; 
  }>;
};

export type PublicType = Record<string, ParsedProps[]>;

type ParsedProps = {
  comment: string;
  prop: string;
  type: string;
};

type AnatomyItem = {
  name: string;
  description?: string;
};

// Helper functions
function getSourceFile(path: string) {
  return ts.createSourceFile(
    path,
    fs.readFileSync(path, 'utf-8'),
    ts.ScriptTarget.Latest,
    true
  );
}

function getLeadingComment(sourceFile: ts.SourceFile, node: ts.Node): string | undefined {
  const comment = ts.getLeadingCommentRanges(sourceFile.text, node.pos)?.[0];
  if (!comment) return undefined;
  
  return sourceFile.text
    .slice(comment.pos, comment.end)
    .replace(/[/*]/g, '')
    .trim();
}

function parseComponentAnatomy(indexPath: string, componentName: string): AnatomyItem[] {
  const sourceFile = getSourceFile(indexPath);
  const subComponents: AnatomyItem[] = [];
  const capitalizedComponent = componentName.charAt(0).toUpperCase() + componentName.slice(1);
  const parentDir = indexPath.replace(/index\.ts$/, '');
  
  function getComponentSource(propertyName: string) {
    const kebabName = propertyName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
    const componentPath = resolve(parentDir, `${kebabName}.tsx`);
    return fs.existsSync(componentPath) ? getSourceFile(componentPath) : null;
  }

  function findExportedComponentComment(source: ts.SourceFile): string | undefined {
    let description: string | undefined;
    
    function visit(node: ts.Node) {
      if (description) return; // Stop if we found the comment
      
      if (ts.isVariableStatement(node) && 
          node.modifiers?.some(mod => mod.kind === ts.SyntaxKind.ExportKeyword)) {
        description = getLeadingComment(source, node);
        return;
      }
      ts.forEachChild(node, visit);
    }

    visit(source);
    return description;
  }

  function createAnatomyItem(element: ts.ExportSpecifier): AnatomyItem {
    if (!element.propertyName) return { name: '' }; // Should never happen due to earlier check
    
    const anatomyItem: AnatomyItem = {
      name: `${capitalizedComponent}.${element.name.text}`
    };

    const componentSource = getComponentSource(element.propertyName.text);
    if (componentSource) {
      const description = findExportedComponentComment(componentSource);
      if (description) {
        anatomyItem.description = description;
      }
    }

    return anatomyItem;
  }

  function visit(node: ts.Node) {
    if (!ts.isExportDeclaration(node)) {
      ts.forEachChild(node, visit);
      return;
    }

    const clause = node.exportClause;
    if (!clause) return;
    if (!ts.isNamedExports(clause)) return;

    for (const element of clause.elements) {
      if (element.propertyName) {
        subComponents.push(createAnatomyItem(element));
      }
    }
  }
  
  visit(sourceFile);
  return subComponents;
}

function parseSingleComponentFromDir(path: string, ref: SubComponents): SubComponents | undefined {
  const componentNameMatch = /[\\/](\w[\w-]*)\.tsx$/.exec(path);
  if (!componentNameMatch) return;
  
  const componentName = componentNameMatch[1];
  const sourceFile = getSourceFile(path);
  const parsed: PublicType[] = [];
  let currentType: PublicType | undefined;
  let dataAttributes: Array<{ name: string; type: string }> = [];

  function visit(node: ts.Node) {
    if (ts.isTypeAliasDeclaration(node) && node.name.text.startsWith('Public')) {
      const typeName = node.name.text;
      currentType = { [typeName]: [] };
      parsed.push(currentType);
    }

    if (ts.isPropertySignature(node) && currentType) {
      const typeName = Object.keys(currentType)[0];
      const comment = getLeadingComment(sourceFile, node);
      
      if (comment) {
        currentType[typeName].push({
          comment,
          prop: node.name.getText(),
          type: node.type?.getText() || ''
        });
      }
    }

    // Move data attributes collection outside of the PublicType
    if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
      const attributes = ts.isJsxElement(node) 
        ? node.openingElement.attributes.properties 
        : node.attributes.properties;

      const newDataAttrs = attributes
        .filter(attr => 
          ts.isJsxAttribute(attr) && 
          ts.isIdentifier(attr.name) &&
          attr.name.text.startsWith('data-') &&
          !attr.name.text.startsWith('data-qds-')
        )
        .map(attr => {
          const jsxAttr = attr as ts.JsxAttribute;
          const attrName = jsxAttr.name.getText();
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

      dataAttributes = [...dataAttributes, ...newDataAttrs];
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  // Add data attributes as a separate property
  const completeSubComponent: SubComponent = { 
    [componentName]: parsed,
    ...(dataAttributes.length > 0 && { dataAttributes })
  };
  
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
  let anatomy: AnatomyItem[] = [];
  
  if (fs.existsSync(indexPath)) {
    anatomy = parseComponentAnatomy(indexPath, componentName);
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