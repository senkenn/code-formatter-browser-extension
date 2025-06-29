import * as prettier from "prettier/standalone";
import parserTypeScript from "prettier/plugins/typescript";
import parserEstree from "prettier/plugins/estree";

export async function formatCode(code: string): Promise<string> {
  try {
    const formatted = await prettier.format(code, {
      parser: "typescript",
      plugins: [parserTypeScript, parserEstree],
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
