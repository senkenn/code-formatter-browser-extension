import * as prettier from "prettier";

export async function formatCode(code: string): Promise<string> {
  const parserTypeScript = await import("prettier/plugins/typescript");
  const parserEstree = await import("prettier/plugins/estree");

  try {
    const formatted = await prettier.format(code, {
      parser: "typescript",
      plugins: [parserTypeScript.default, parserEstree.default],
      semi: true,
      singleQuote: true,
      trailingComma: "es5",
      tabWidth: 2,
      printWidth: 80,
    });
    return formatted;
  } catch (error) {
    console.error("Formatting error:", error);
    throw error;
  }
}
