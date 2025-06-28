export interface FormatterOptions {
  indentSize: number;
  useTabs: boolean;
  lineWidth: number;
}

export interface CodeFormatter {
  formatCode(code: string, options: FormatterOptions): string;
}

export interface FormatResult {
  formattedCode: string;
  changes: number;
}
