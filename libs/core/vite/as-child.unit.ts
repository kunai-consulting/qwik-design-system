import { describe, expect, it, vi } from "vitest";
import { asChild } from "./as-child";

type TransformResult = { code: string; map: unknown } | null;

describe("asChild", () => {
  const plugin = asChild();
  const transform = plugin.transform as (code: string, id: string) => TransformResult;

  it("should skip non-JSX files", () => {
    const code = "const x = 1;";
    const result = transform(code, "test.js");
    expect(result).toBeNull();
  });

  it("should return null for files without asChild", () => {
    const code = `
      function App() {
        return <div>Hello</div>;
      }
    `;
    const result = transform(code, "test.tsx");
    expect(result).toBeNull();
  });

  it("should transform simple element with asChild", () => {
    const code = `
      function App() {
        return (
          <Button asChild>
            <a href="/test">Link</a>
          </Button>
        );
      }
    `;
    const result = transform(code, "test.tsx");
    expect(result).toBeTruthy();
    expect(result.code).toContain('jsxType="a"');
    expect(result.code).toContain('movedProps={{ "href": "/test" }}');
    expect(result.code).not.toContain('<a href="/test">');
  });

  it("should transform component with asChild", () => {
    const code = `
      function App() {
        return (
          <Button asChild>
            <CustomLink to="/test">Link</CustomLink>
          </Button>
        );
      }
    `;
    const result = transform(code, "test.tsx");
    expect(result).toBeTruthy();
    expect(result.code).toContain("jsxType={CustomLink}");
    expect(result.code).toContain('movedProps={{ "to": "/test" }}');
    expect(result.code).not.toContain('<CustomLink to="/test">');
  });

  it("should handle element without props", () => {
    const code = `
      function App() {
        return (
          <Button asChild>
            <div>Content</div>
          </Button>
        );
      }
    `;
    const result = transform(code, "test.tsx");
    expect(result).toBeTruthy();
    expect(result.code).toContain('jsxType="div"');
    expect(result.code).toContain("movedProps={{  }}");
  });

  it("should handle boolean props", () => {
    const code = `
      function App() {
        return (
          <Button asChild>
            <input disabled required />
          </Button>
        );
      }
    `;
    const result = transform(code, "test.tsx");
    expect(result).toBeTruthy();
    expect(result.code).toContain('"disabled": true');
    expect(result.code).toContain('"required": true');
  });

  it("should handle expression props", () => {
    const code = `
      function App() {
        const href = "/test";
        return (
          <Button asChild>
            <a href={href} onClick={handleClick}>Link</a>
          </Button>
        );
      }
    `;
    const result = transform(code, "test.tsx");
    expect(result).toBeTruthy();
    expect(result.code).toContain('"href": href');
    expect(result.code).toContain('"onClick": handleClick');
  });

  it("should handle conditional expressions", () => {
    const code = `
      function App() {
        return (
          <Button asChild>
            {isLink ? <a href="/test">Link</a> : <button type="button">Button</button>}
          </Button>
        );
      }
    `;
    const result = transform(code, "test.tsx");
    expect(result).toBeTruthy();
    expect(result.code).toContain('jsxType={isLink ? "a" : "button"}');
    expect(result.code).toContain(
      'movedProps={isLink ? { "href": "/test" } : { "type": "button" }}'
    );
  });

  it("should handle nested conditional with components", () => {
    const code = `
      function App() {
        return (
          <Button asChild>
            {external ? <Link to="/external">External</Link> : <InternalLink route="/internal">Internal</InternalLink>}
          </Button>
        );
      }
    `;
    const result = transform(code, "test.tsx");
    expect(result).toBeTruthy();
    expect(result.code).toContain("jsxType={external ? Link : InternalLink}");
    expect(result.code).toContain(
      'movedProps={external ? { "to": "/external" } : { "route": "/internal" }}'
    );
  });

  it("should throw error for multiple children", () => {
    const code = `
      function App() {
        return (
          <Button asChild>
            <a href="/test">Link</a>
            <span>Extra</span>
          </Button>
        );
      }
    `;
    expect(() => transform(code, "test.tsx")).toThrow(
      "asChild elements must have exactly one child"
    );
  });

  it("should ignore whitespace-only text nodes", () => {
    const code = `
      function App() {
        return (
          <Button asChild>
            
            <a href="/test">Link</a>
            
          </Button>
        );
      }
    `;
    const result = transform(code, "test.tsx");
    expect(result).toBeTruthy();
    expect(result.code).toContain('jsxType="a"');
  });

  it("should handle self-closing elements", () => {
    const code = `
      function App() {
        return (
          <Label asChild>
            <input type="text" name="username" />
          </Label>
        );
      }
    `;
    const result = transform(code, "test.tsx");
    expect(result).toBeTruthy();
    expect(result.code).toContain('jsxType="input"');
    expect(result.code).toContain('"type": "text"');
    expect(result.code).toContain('"name": "username"');
  });

  it("should handle complex prop values", () => {
    const code = `
      function App() {
        return (
          <Button asChild>
            <a href={getUrl()} className={\`btn \${variant}\`} style={{ color: 'red' }}>Link</a>
          </Button>
        );
      }
    `;
    const result = transform(code, "test.tsx");
    expect(result).toBeTruthy();
    expect(result.code).toContain('"href": getUrl()');
    expect(result.code).toContain('"className": `btn ${variant}`');
    expect(result.code).toContain("\"style\": { color: 'red' }");
  });

  it("should preserve existing props on asChild element", () => {
    const code = `
      function App() {
        return (
          <Button asChild className="existing" data-testid="button">
            <a href="/test">Link</a>
          </Button>
        );
      }
    `;
    const result = transform(code, "test.tsx");
    expect(result).toBeTruthy();
    expect(result.code).toContain('className="existing"');
    expect(result.code).toContain('data-testid="button"');
    expect(result.code).toContain('jsxType="a"');
  });

  it("should handle empty children gracefully", () => {
    const code = `
      function App() {
        return (
          <Button asChild>
          </Button>
        );
      }
    `;
    const result = transform(code, "test.tsx");
    expect(result).toBeNull();
  });

  it("should handle complex nested conditional", () => {
    const code = `
      function App() {
        return (
          <Button asChild>
            {condition ? (otherCondition ? <a href="/a">A</a> : <a href="/b">B</a>) : <button>Button</button>}
          </Button>
        );
      }
    `;
    const result = transform(code, "test.tsx");
    expect(result).toBeTruthy();
    // This is a complex case that might not be fully supported, but should not crash
  });

  it("should generate source maps", () => {
    const code = `
      function App() {
        return (
          <Button asChild>
            <a href="/test">Link</a>
          </Button>
        );
      }
    `;
    const result = transform(code, "test.tsx");
    expect(result).toBeTruthy();
    expect(result.map).toBeTruthy();
  });

  it("should handle multiple asChild elements in same file", () => {
    const code = `
      function App() {
        return (
          <div>
            <Button asChild>
              <a href="/link1">Link 1</a>
            </Button>
            <Label asChild>
              <span className="label">Label</span>
            </Label>
          </div>
        );
      }
    `;
    const result = transform(code, "test.tsx");
    expect(result).toBeTruthy();
    expect(result.code).toContain('jsxType="a"');
    expect(result.code).toContain('jsxType="span"');
    expect(result.code).toContain('"href": "/link1"');
    expect(result.code).toContain('"className": "label"');
  });

  it("should handle literal string props correctly", () => {
    const code = `
      function App() {
        return (
          <Button asChild>
            <a href="/test" title="Test Link" target="_blank">Link</a>
          </Button>
        );
      }
    `;
    const result = transform(code, "test.tsx");
    expect(result).toBeTruthy();
    expect(result.code).toContain('"href": "/test"');
    expect(result.code).toContain('"title": "Test Link"');
    expect(result.code).toContain('"target": "_blank"');
  });

  it("should remove child element wrapper and keep grandchildren", () => {
    const code = `
      function App() {
        return (
          <div asChild data-from-div>
            <span data-yo>
              <p>I am a p tag</p>
            </span>
          </div>
        );
      }
    `;
    const result = transform(code, "test.tsx");
    expect(result).toBeTruthy();
    expect(result.code).toContain('jsxType="span"');
    expect(result.code).toContain('movedProps={{ "data-yo": true }}');
    expect(result.code).toContain("data-from-div");
    expect(result.code).toContain("<p>I am a p tag</p>");
    expect(result.code).not.toContain("<span data-yo>");
    expect(result.code).not.toContain("</span>");
  });

  it("should remove child element completely if it has no children", () => {
    const code = `
      function App() {
        return (
          <Button asChild>
            <input type="submit" />
          </Button>
        );
      }
    `;
    const result = transform(code, "test.tsx");
    expect(result).toBeTruthy();
    expect(result.code).toContain('jsxType="input"');
    expect(result.code).toContain('movedProps={{ "type": "submit" }}');
    expect(result.code).not.toContain("<input");
    expect(result.code).not.toContain('type="submit"');
  });

  it("should handle nested children properly", () => {
    const code = `
      function App() {
        return (
          <Card asChild className="card">
            <article data-article>
              <h1>Title</h1>
              <p>Content here</p>
              <footer>Footer</footer>
            </article>
          </Card>
        );
      }
    `;
    const result = transform(code, "test.tsx");
    expect(result).toBeTruthy();
    expect(result.code).toContain('jsxType="article"');
    expect(result.code).toContain('movedProps={{ "data-article": true }}');
    expect(result.code).toContain('className="card"');
    expect(result.code).toContain("<h1>Title</h1>");
    expect(result.code).toContain("<p>Content here</p>");
    expect(result.code).toContain("<footer>Footer</footer>");
    expect(result.code).not.toContain("<article data-article>");
    expect(result.code).not.toContain("</article>");
  });

  it("should handle JSX member expressions like Menu.Item", () => {
    const code = `
      function App() {
        return (
          <Button asChild>
            <Menu.Item value="option1" className="menu-item">
              Option 1
            </Menu.Item>
          </Button>
        );
      }
    `;
    const result = transform(code, "test.tsx");
    expect(result).toBeTruthy();
    expect(result.code).toContain("jsxType={Menu.Item}");
    expect(result.code).toContain(
      'movedProps={{ "value": "option1", "className": "menu-item" }}'
    );
    expect(result.code).toContain("Option 1");
    expect(result.code).not.toContain("<Menu.Item");
    expect(result.code).not.toContain("</Menu.Item>");
  });

  it("should handle deeply nested JSX member expressions", () => {
    const code = `
      function App() {
        return (
          <Container asChild>
            <Dropdown.Content.Item id="nested" disabled>
              Nested Item
            </Dropdown.Content.Item>
          </Container>
        );
      }
    `;
    const result = transform(code, "test.tsx");
    expect(result).toBeTruthy();
    expect(result.code).toContain("jsxType={Dropdown.Content.Item}");
    expect(result.code).toContain('movedProps={{ "id": "nested", "disabled": true }}');
    expect(result.code).toContain("Nested Item");
  });
});

describe("asChild error cases", () => {
  const plugin = asChild();
  const transform = plugin.transform as (code: string, id: string) => TransformResult;

  it("should skip transformation for unsupported child types gracefully", () => {
    const code = `
      function App() {
        return (
          <Button asChild>
            {someComplexExpression()}
          </Button>
        );
      }
    `;
    const result = transform(code, "test.tsx");
    expect(result).toBeTruthy();
  });

  it("should handle parse errors gracefully", () => {
    const code = `
      function App() {
        return (
          <Button asChild>
            <a href="/test" unclosed-tag
          </Button>
        );
      }
    `;
    const result = transform(code, "test.tsx");
    expect(result).toBeNull();
  });
});

describe("asChild type guards", () => {
  it("should correctly identify JSX elements", () => {
    const code = `
      function App() {
        return (
          <Button asChild>
            <div>Element</div>
          </Button>
        );
      }
    `;
    const plugin = asChild();
    const transform = plugin.transform as (code: string, id: string) => TransformResult;
    const result = transform(code, "test.tsx");
    expect(result).toBeTruthy();
  });
});

describe("asChild robustness improvements", () => {
  const plugin = asChild({ debug: true });
  const transform = plugin.transform as (code: string, id: string) => TransformResult;

  describe("Expression type validation", () => {
    it("should handle logical expressions (&&)", () => {
      const code = `
        function App() {
          return (
            <Button asChild>
              {condition && <a href="/test">Link</a>}
            </Button>
          );
        }
      `;
      const result = transform(code, "test.tsx");
      expect(result).toBeTruthy();
      expect(result.code).toContain('jsxType={condition && "a"}');
      expect(result.code).toContain('movedProps={condition ? { "href": "/test" } : {}}');
    });

    it("should handle identifier expressions (variables)", () => {
      const code = `
        function App() {
          return (
            <Button asChild>
              {myElement}
            </Button>
          );
        }
      `;
      const result = transform(code, "test.tsx");
      expect(result).toBeTruthy();
      expect(result.code).toContain("jsxType={myElement}");
      expect(result.code).toContain("movedProps={{}}");
    });

    it("should handle call expressions (function calls)", () => {
      const code = `
        function App() {
          return (
            <Button asChild>
              {renderElement()}
            </Button>
          );
        }
      `;
      const result = transform(code, "test.tsx");
      expect(result).toBeTruthy();
      expect(result.code).toContain("jsxType={renderElement()}");
      expect(result.code).toContain("movedProps={{}}");
    });

    it("should handle member expressions (object.method)", () => {
      const code = `
         function App() {
           return (
             <Button asChild>
               {items.map(item => <div key={item.id}>{item.name}</div>)}
             </Button>
           );
         }
       `;
      const result = transform(code, "test.tsx");
      expect(result).toBeTruthy();
      expect(result.code).toContain(
        "jsxType={items.map(item => <div key={item.id}>{item.name}</div>)}"
      );
    });

    it("should skip truly unsupported expressions gracefully", () => {
      const code = `
         function App() {
           return (
             <Button asChild>
               {items[dynamicKey] + "complex" * math.operation}
             </Button>
           );
         }
       `;
      const result = transform(code, "test.tsx");
      expect(result).toBeNull();
    });

    it("should handle JSX member expressions in conditionals", () => {
      const code = `
         function App() {
           return (
             <Button asChild>
               {isDropdown ? <Menu.Item value="test">Item</Menu.Item> : <Menu.Trigger>Trigger</Menu.Trigger>}
             </Button>
           );
         }
       `;
      const result = transform(code, "test.tsx");
      expect(result).toBeTruthy();
      expect(result.code).toContain("jsxType={isDropdown ? Menu.Item : Menu.Trigger}");
      expect(result.code).toContain(
        'movedProps={isDropdown ? { "value": "test" } : {  }}'
      );
    });
  });

  describe("Spacing resilience", () => {
    it("should handle no space before attributes", () => {
      const code = `
        function App() {
          return (
            <Button asChild>
              <a href="/test">Link</a>
            </Button>
          );
        }
      `;
      const result = transform(code, "test.tsx");
      expect(result).toBeTruthy();
      expect(result.code).toContain('jsxType="a"');
      expect(result.code).not.toContain('href="/test"');
    });

    it("should handle multiple spaces around attributes", () => {
      const code = `
        function App() {
          return (
            <Button asChild>
              <a   href="/test"   className="link"  >Link</a>
            </Button>
          );
        }
      `;
      const result = transform(code, "test.tsx");
      expect(result).toBeTruthy();
      expect(result.code).toContain('jsxType="a"');
      expect(result.code).toContain('"href": "/test"');
      expect(result.code).toContain('"className": "link"');
    });

    it("should handle newlines in attributes", () => {
      const code = `
        function App() {
          return (
            <Button asChild>
              <a
                href="/test"
                className="link"
              >
                Link
              </a>
            </Button>
          );
        }
      `;
      const result = transform(code, "test.tsx");
      expect(result).toBeTruthy();
      expect(result.code).toContain('jsxType="a"');
      expect(result.code).toContain('"href": "/test"');
    });
  });

  describe("Error handling improvements", () => {
    it("should provide line numbers in debug messages", () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const code = `function App() {
  return (
    <Button asChild>
      {a + b * c}
    </Button>
  );
}`;

      const result = transform(code, "test.tsx");
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("line 3"));

      consoleSpy.mockRestore();
    });

    it("should handle malformed JSX gracefully", () => {
      const code = `
        function App() {
          return (
            <Button asChild>
              <a href="/test" unclosed
            </Button>
          );
        }
      `;
      const result = transform(code, "test.tsx");
      expect(result).toBeNull();
    });
  });

  describe("AST traversal safety", () => {
    it("should handle deeply nested structures", () => {
      const code = `
        function App() {
          return (
            <div>
              <div>
                <div>
                  <Button asChild>
                    <a href="/test">Link</a>
                  </Button>
                </div>
              </div>
            </div>
          );
        }
      `;
      const result = transform(code, "test.tsx");
      expect(result).toBeTruthy();
      expect(result.code).toContain('jsxType="a"');
    });

    it("should handle multiple asChild elements at different nesting levels", () => {
      const code = `
        function App() {
          return (
            <div>
              <Button asChild>
                <a href="/link1">Link 1</a>
              </Button>
              <div>
                <Label asChild>
                  <span>Label</span>
                </Label>
              </div>
            </div>
          );
        }
      `;
      const result = transform(code, "test.tsx");
      expect(result).toBeTruthy();
      expect(result.code).toContain('jsxType="a"');
      expect(result.code).toContain('jsxType="span"');
    });
  });

  describe("Debug mode", () => {
    it("should log debug messages when debug mode is enabled", () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const code = `
        function App() {
          return (
            <Button asChild>
              <a href="/test">Link</a>
            </Button>
          );
        }
      `;

      transform(code, "test.tsx");
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("🔧 asChild plugin processing")
      );
      expect(consoleSpy).toHaveBeenCalledWith("🔄 Found asChild element!");

      consoleSpy.mockRestore();
    });

    it("should not log when debug mode is disabled", () => {
      const pluginNoDebug = asChild({ debug: false });
      const transformNoDebug = pluginNoDebug.transform as (
        code: string,
        id: string
      ) => TransformResult;
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const code = `
        function App() {
          return (
            <Button asChild>
              <a href="/test">Link</a>
            </Button>
          );
        }
      `;

      transformNoDebug(code, "test.tsx");
      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });
});
