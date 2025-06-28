import { describe, expect, it } from "vitest";
import { formatCode } from "../lib/formatter";

describe("formatCode", () => {
  it("should format TypeScript code correctly", async () => {
    const input = `const x={a:1,b:2};function test(){return x.a+x.b;}`;
    const expected = `const x = { a: 1, b: 2 };\nfunction test() {\n  return x.a + x.b;\n}\n`;

    const result = await formatCode(input);
    expect(result).toBe(expected);
  });

  it("should apply single quotes", async () => {
    const input = `const str = "hello world";`;
    const expected = `const str = 'hello world';\n`;

    const result = await formatCode(input);
    expect(result).toBe(expected);
  });

  it("should add semicolons", async () => {
    const input = `const x = 5\nconst y = 10`;
    const expected = `const x = 5;\nconst y = 10;\n`;

    const result = await formatCode(input);
    expect(result).toBe(expected);
  });

  it("should format with trailing commas", async () => {
    const input = `const obj = {a: 1, b: 2}`;
    const expected = `const obj = { a: 1, b: 2 };\n`;

    const result = await formatCode(input);
    expect(result).toBe(expected);
  });

  it("should handle function formatting", async () => {
    const input = `function longFunctionName(parameterOne,parameterTwo,parameterThree){return parameterOne+parameterTwo+parameterThree;}`;
    const expected = `function longFunctionName(parameterOne, parameterTwo, parameterThree) {\n  return parameterOne + parameterTwo + parameterThree;\n}\n`;

    const result = await formatCode(input);
    expect(result).toBe(expected);
  });

  it("should throw error for invalid syntax", async () => {
    const input = `const x = {`;

    await expect(formatCode(input)).rejects.toThrow();
  });

  it("should format empty input", async () => {
    const input = "";
    const expected = "";

    const result = await formatCode(input);
    expect(result).toBe(expected);
  });
});
