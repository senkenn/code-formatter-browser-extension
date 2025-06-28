import { defineConfig } from "wxt";

export default defineConfig({
  manifest: {
    name: "Code Formatter Browser Extension",
    description: "A browser extension for formatting code.",
    permissions: ["activeTab", "scripting"],
    commands: {
      "format-code": {
        suggested_key: {
          default: "Shift+Alt+F",
          mac: "Shift+Alt+F",
        },
        description: "Format TypeScript code with Prettier",
      },
    },
  },
});
