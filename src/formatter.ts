import * as prettier from "prettier";
import * as parserTypeScript from "prettier/plugins/typescript";

export async function formatCode(code: string): Promise<string> {
  try {
    const formatted = await prettier.format(code, {
      parser: "typescript",
      plugins: [parserTypeScript],
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
