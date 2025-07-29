import { describe, expect, it } from "vitest";
import asChildPlugin from "./as-child";

type TransformResult = { code: string; map: unknown } | null;

describe("asChildPlugin", () => {
  const plugin = asChildPlugin();
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
    expect(result.code).toContain('movedProps={{ href: "/test" }}');
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
    expect(result.code).toContain('movedProps={{ to: "/test" }}');
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
    expect(result.code).toContain("disabled: true");
    expect(result.code).toContain("required: true");
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
    expect(result.code).toContain("href: href");
    expect(result.code).toContain("onClick: handleClick");
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
      'movedProps={isLink ? { href: "/test" } : { type: "button" }}'
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
      'movedProps={external ? { to: "/external" } : { route: "/internal" }}'
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
    expect(result.code).toContain('type: "text"');
    expect(result.code).toContain('name: "username"');
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
    expect(result.code).toContain("href: getUrl()");
    expect(result.code).toContain("className: `btn ${variant}`");
    expect(result.code).toContain("style: { color: 'red' }");
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
    expect(result).toBeNull(); // Should return null as there's no transformation needed
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
    expect(result.code).toContain('href: "/link1"');
    expect(result.code).toContain('className: "label"');
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
    expect(result.code).toContain('href: "/test"');
    expect(result.code).toContain('title: "Test Link"');
    expect(result.code).toContain('target: "_blank"');
  });
});

describe("asChildPlugin error cases", () => {
  const plugin = asChildPlugin();
  const transform = plugin.transform as (code: string, id: string) => TransformResult;

  it("should throw for unsupported child types", () => {
    const code = `
      function App() {
        return (
          <Button asChild>
            {someComplexExpression()}
          </Button>
        );
      }
    `;
    expect(() => transform(code, "test.tsx")).toThrow(
      "Unsupported child type for asChild"
    );
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
    expect(result).toBeNull(); // Should handle parse errors gracefully
  });
});

describe("asChildPlugin type guards", () => {
  it("should correctly identify JSX elements", () => {
    // These are internal functions, but we can test the transform behavior
    const code = `
      function App() {
        return (
          <Button asChild>
            <div>Element</div>
          </Button>
        );
      }
    `;
    const plugin = asChildPlugin();
    const transform = plugin.transform as (code: string, id: string) => TransformResult;
    const result = transform(code, "test.tsx");
    expect(result).toBeTruthy();
  });
});
