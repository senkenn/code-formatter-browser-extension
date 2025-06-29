import { test, expect, chromium } from '@playwright/test';
import path from 'path';

test.describe('Code Formatter Extension Basic Test', () => {
  test('extension loads and can access TypeScript Playground', async () => {
    const extensionPath = path.resolve(__dirname, '../../.output/chrome-mv3');
    
    const browser = await chromium.launchPersistentContext('', {
      headless: true,
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ]
    });

    const page = await browser.newPage();
    
    // TypeScript Playgroundに移動
    await page.goto('https://www.typescriptlang.org/play', { timeout: 30000 });
    
    // エディターが読み込まれるまで待機
    await page.waitForSelector('.monaco-editor', { timeout: 15000 });
    
    // ページが正常に読み込まれたことを確認
    const title = await page.title();
    expect(title).toContain('TypeScript');
    
    // Monaco Editorのtextareaが存在することを確認
    const textarea = await page.locator('.monaco-editor textarea').first();
    await expect(textarea).toBeVisible();
    
    await browser.close();
  });

  test('can type and select code in playground', async () => {
    const extensionPath = path.resolve(__dirname, '../../.output/chrome-mv3');
    
    const browser = await chromium.launchPersistentContext('', {
      headless: true,
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ]
    });

    const page = await browser.newPage();
    
    await page.goto('https://www.typescriptlang.org/play', { timeout: 30000 });
    await page.waitForSelector('.monaco-editor', { timeout: 15000 });
    
    // エディターをクリア
    await page.click('.monaco-editor textarea');
    await page.keyboard.press('Control+a');
    
    // テストコードを入力
    const testCode = 'const x = 1;';
    await page.keyboard.type(testCode);
    
    // 入力されたコードを確認
    const content = await page.evaluate(() => {
      const textarea = document.querySelector('.monaco-editor textarea') as HTMLTextAreaElement;
      return textarea?.value || '';
    });
    
    expect(content).toContain('const x = 1;');
    
    await browser.close();
  });
});
