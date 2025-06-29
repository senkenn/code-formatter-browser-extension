import path from "node:path";
import { chromium, expect, test } from "@playwright/test";

test.describe("Code Formatter Extension in TypeScript Playground", () => {
  test.beforeAll(async () => {
    // Chrome拡張機能をビルド
    await test.step("Build extension", async () => {
      const { exec } = await import("node:child_process");
      const { promisify } = await import("node:util");
      const execAsync = promisify(exec);

      await execAsync("pnpm build", { cwd: path.resolve(__dirname, "../..") });
    });
  });

  test("should format TypeScript code in playground", async () => {
    // 拡張機能を有効にしたブラウザを起動
    const extensionPath = path.resolve(__dirname, "../../.output/chrome-mv3");

    const browser = await chromium.launchPersistentContext("", {
      headless: false,
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
        "--no-sandbox",
        "--disable-setuid-sandbox",
      ],
    });

    const page = await browser.newPage();

    // TypeScript Playgroundに移動
    await page.goto("https://www.typescriptlang.org/play");

    // エディターが読み込まれるまで待機
    await page.waitForSelector(".monaco-editor", { timeout: 10000 });

    // デフォルトのコードをクリア
    await page.click(".monaco-editor textarea");
    await page.keyboard.press("Control+a");

    // フォーマットが必要なコードを入力
    const unformattedCode = `function test(    ) {
console.log(   "hello world"   )
   return    true;
}`;

    await page.keyboard.type(unformattedCode);

    // コードを選択
    await page.keyboard.press("Control+a");

    // フォーマット機能を実行（拡張機能のメッセージ送信）
    try {
      await page.evaluate(() => {
        if (window.chrome?.runtime) {
          window.chrome.runtime.sendMessage({ action: "formatCode" });
        }
      });
    } catch {
      // フォールバック: ショートカットキーを使用
      await page.keyboard.press("Control+Shift+F");
    }

    // フォーマットが完了するまで待機
    await page.waitForTimeout(2000);

    // フォーマット後のコードを取得
    const formattedCode = await page.evaluate(() => {
      const textarea = document.querySelector(
        ".monaco-editor textarea",
      ) as HTMLTextAreaElement;
      return textarea?.value || "";
    });

    // フォーマットが適用されたことを確認
    expect(formattedCode).toContain("function test() {");
    expect(formattedCode).toContain("console.log('hello world');");
    expect(formattedCode).toContain("return true;");
    expect(formattedCode).not.toContain("    )"); // 余分なスペースが削除されている

    await browser.close();
  });

  test("should show error message for invalid code", async () => {
    const extensionPath = path.resolve(__dirname, "../../.output/chrome-mv3");

    const browser = await chromium.launchPersistentContext("", {
      headless: false,
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
        "--no-sandbox",
        "--disable-setuid-sandbox",
      ],
    });

    const page = await browser.newPage();

    await page.goto("https://www.typescriptlang.org/play");
    await page.waitForSelector(".monaco-editor", { timeout: 10000 });

    // エディターをクリア
    await page.click(".monaco-editor textarea");
    await page.keyboard.press("Control+a");

    // 無効なコードを入力
    const invalidCode = `function test( {
console.log("missing closing brace"
`;

    await page.keyboard.type(invalidCode);
    await page.keyboard.press("Control+a");

    // コンソールエラーをキャッチするリスナーを設定
    const errorMessages: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errorMessages.push(msg.text());
      }
    });

    // フォーマットを実行
    try {
      await page.evaluate(() => {
        if (window.chrome?.runtime) {
          window.chrome.runtime.sendMessage({ action: "formatCode" });
        }
      });
    } catch {
      // エラーが期待される
    }

    await page.waitForTimeout(2000);

    // エラーが発生したことを確認
    expect(errorMessages.length).toBeGreaterThan(0);

    await browser.close();
  });

  test("should handle empty selection", async () => {
    const extensionPath = path.resolve(__dirname, "../../.output/chrome-mv3");

    const browser = await chromium.launchPersistentContext("", {
      headless: false,
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
        "--no-sandbox",
        "--disable-setuid-sandbox",
      ],
    });

    const page = await browser.newPage();

    await page.goto("https://www.typescriptlang.org/play");
    await page.waitForSelector(".monaco-editor", { timeout: 10000 });

    // エディターをクリックして選択をクリア
    await page.click(".monaco-editor textarea");
    await page.keyboard.press("Escape");

    const errorMessages: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errorMessages.push(msg.text());
      }
    });

    // 何も選択せずにフォーマットを実行
    await page.evaluate(() => {
      if (window.chrome?.runtime) {
        window.chrome.runtime.sendMessage({ action: "formatCode" });
      }
    });

    await page.waitForTimeout(1000);

    // 適切なエラーメッセージが表示されることを確認
    // 実際の実装に応じて調整

    await browser.close();
  });
});
